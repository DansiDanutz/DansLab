"""DansLab Video Pipeline Orchestrator.

Durable 10-step pipeline execution with checkpoints, retries,
cost tracking, and human review gates.
"""

from __future__ import annotations

import asyncio
import importlib
import time
import traceback
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any, Callable

from core.cost_tracker import CostTracker
from core.monitoring import (
    metrics,
    record_cost,
    record_pipeline_complete,
    record_pipeline_start,
    record_step_duration,
)
from core.queue import Job, JobStatus, PipelineQueue
from core.settings import settings


# Step registry: name -> (module_path, function_name)
STEP_REGISTRY: dict[str, tuple[str, str]] = {
    "research": ("engines.step1_research", "execute"),
    "script": ("engines.step2_script", "execute"),
    "visual_design": ("engines.step3_visual", "execute"),
    "scenes": ("engines.step4_scenes", "execute"),
    "audio": ("engines.step5_audio", "execute"),
    "subtitles": ("engines.step6_subtitles", "execute"),
    "render": ("engines.step7_render", "execute_parallel_render"),
    "qa": ("engines.step8_qa", "execute"),
    "final": ("engines.step9_final", "execute"),
    "addons": ("engines.step10_addons", "execute"),
}


@dataclass
class PipelineState:
    """Serializable pipeline state for checkpointing."""

    job_id: str
    topic: str
    current_step_index: int = 0
    completed_steps: list[str] = field(default_factory=list)
    failed_steps: list[str] = field(default_factory=list)
    step_outputs: dict[str, Any] = field(default_factory=dict)
    metadata: dict[str, Any] = field(default_factory=dict)
    checkpoint_path: Path | None = None

    def to_dict(self) -> dict[str, Any]:
        return {
            "job_id": self.job_id,
            "topic": self.topic,
            "current_step_index": self.current_step_index,
            "completed_steps": self.completed_steps,
            "failed_steps": self.failed_steps,
            "step_outputs": self.step_outputs,
            "metadata": self.metadata,
        }

    def save(self) -> None:
        if self.checkpoint_path:
            self.checkpoint_path.write_text(
                __import__("json").dumps(self.to_dict(), default=str, indent=2)
            )

    @classmethod
    def load(cls, path: Path) -> PipelineState:
        data = __import__("json").loads(path.read_text())
        return cls(
            job_id=data["job_id"],
            topic=data["topic"],
            current_step_index=data.get("current_step_index", 0),
            completed_steps=data.get("completed_steps", []),
            failed_steps=data.get("failed_steps", []),
            step_outputs=data.get("step_outputs", {}),
            metadata=data.get("metadata", {}),
            checkpoint_path=path,
        )


class PipelineOrchestrator:
    """Main pipeline orchestrator."""

    def __init__(self, queue: PipelineQueue | None = None) -> None:
        self.queue = queue or PipelineQueue()
        self.state: PipelineState | None = None
        self.cost_tracker: CostTracker | None = None

    async def run_job(self, job: Job) -> dict[str, Any]:
        """Execute a complete pipeline job."""
        self.cost_tracker = CostTracker(job.id)
        record_pipeline_start(job.id, job.topic)

        checkpoint_dir = settings.data_dir / "checkpoints"
        checkpoint_dir.mkdir(parents=True, exist_ok=True)

        self.state = PipelineState(
            job_id=job.id,
            topic=job.topic,
            checkpoint_path=checkpoint_dir / f"{job.id}.json",
        )

        # Try to resume from checkpoint
        if self.state.checkpoint_path.exists():
            self.state = PipelineState.load(self.state.checkpoint_path)
            print(f"[orchestrator] Resumed job {job.id} from step {self.state.current_step_index}")

        steps = [s for s in settings.pipeline.enabled_steps if s in STEP_REGISTRY]
        total = len(steps)

        try:
            for idx, step_name in enumerate(steps):
                if step_name in self.state.completed_steps:
                    continue

                self.state.current_step_index = idx
                self.state.save()

                # Update queue progress
                progress = (idx / total) * 100
                self.queue.update_progress(job, step_name, progress)

                # Human review gate before render/upload
                if step_name == "render" and settings.pipeline.human_review_gate:
                    print(f"[orchestrator] Human review gate at step: {step_name}")
                    # In production, this would wait for approval via API/webhook
                    # For now, auto-approve after brief pause
                    await asyncio.sleep(1)

                # Execute step with retry
                result = await self._execute_step_with_retry(step_name, job)

                if result.get("ok"):
                    self.state.completed_steps.append(step_name)
                    self.state.step_outputs[step_name] = result
                    self.state.save()
                else:
                    self.state.failed_steps.append(step_name)
                    raise StepFailureError(step_name, result.get("error", "unknown"))

            # Finalize
            cost_summary = self.cost_tracker.finalize()
            record_pipeline_complete(job.id, job.topic, success=True)
            self.queue.complete(job, {"cost": cost_summary, "state": self.state.to_dict()})

            return {
                "ok": True,
                "job_id": job.id,
                "topic": job.topic,
                "completed_steps": self.state.completed_steps,
                "cost": cost_summary,
            }

        except Exception as e:
            error_msg = f"{type(e).__name__}: {str(e)}"
            traceback.print_exc()
            record_pipeline_complete(job.id, job.topic, success=False)
            self.queue.fail(job, error_msg)
            return {"ok": False, "job_id": job.id, "error": error_msg}

    async def _execute_step_with_retry(self, step_name: str, job: Job) -> dict[str, Any]:
        """Execute a step with exponential backoff retry."""
        module_path, func_name = STEP_REGISTRY[step_name]
        max_retries = settings.pipeline.max_step_retries

        for attempt in range(1, max_retries + 1):
            start = time.time()
            try:
                # Dynamically import and call step function
                module = importlib.import_module(module_path)
                func: Callable = getattr(module, func_name)

                # Prepare context
                ctx = {
                    "job_id": job.id,
                    "topic": job.topic,
                    "state": self.state,
                    "cost_tracker": self.cost_tracker,
                    "previous_outputs": self.state.step_outputs if self.state else {},
                }

                # Call step (sync or async)
                if asyncio.iscoroutinefunction(func):
                    result = await func(ctx)
                else:
                    result = func(ctx)

                duration = time.time() - start
                record_step_duration(step_name, duration, success=True)

                if isinstance(result, dict):
                    return result
                return {"ok": True, "result": result}

            except Exception as e:
                duration = time.time() - start
                record_step_duration(step_name, duration, success=False)

                if attempt < max_retries:
                    wait = 2 ** attempt  # exponential backoff
                    print(f"[orchestrator] Step '{step_name}' failed (attempt {attempt}/{max_retries}), retrying in {wait}s...")
                    await asyncio.sleep(wait)
                else:
                    return {"ok": False, "error": f"{type(e).__name__}: {str(e)}", "attempts": attempt}

        return {"ok": False, "error": "max retries exceeded"}

    async def worker_loop(self) -> None:
        """Main worker loop — processes jobs from the queue."""
        print("[orchestrator] Worker started. Waiting for jobs...")
        while True:
            job = self.queue.dequeue(timeout=5)
            if job is None:
                await asyncio.sleep(1)
                continue

            print(f"[orchestrator] Processing job {job.id}: {job.topic}")
            await self.run_job(job)


class StepFailureError(Exception):
    """Raised when a pipeline step fails after all retries."""

    def __init__(self, step: str, reason: str) -> None:
        self.step = step
        self.reason = reason
        super().__init__(f"Step '{step}' failed: {reason}")
