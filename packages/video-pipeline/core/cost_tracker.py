"""Per-video cost tracking across all API providers.

Tracks LLM tokens, image generations, video renders, TTS, and external APIs.
Emits Prometheus-compatible metrics.
"""

from __future__ import annotations

import json
import time
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any

from core.settings import settings


# Approximate cost per 1K tokens (USD) — update as pricing changes
LLM_PRICING = {
    "gpt-4o": {"input": 0.0025, "output": 0.0100},
    "gpt-4o-mini": {"input": 0.00015, "output": 0.00060},
    "claude-sonnet-4": {"input": 0.0030, "output": 0.0150},
    "claude-haiku": {"input": 0.00025, "output": 0.00125},
    "gemini-2.5-pro": {"input": 0.00125, "output": 0.0100},
    "gemini-2.5-flash": {"input": 0.00015, "output": 0.00060},
    "glm-4.7-flash": {"input": 0.0001, "output": 0.0001},
    "deepseek-chat": {"input": 0.00014, "output": 0.00028},
    "ollama": {"input": 0.0, "output": 0.0},  # Local = free
}

# Approximate cost per operation (USD)
OPERATION_COSTS = {
    "image_gen_flux": 0.003,
    "image_gen_sdxl": 0.002,
    "image_gen_local": 0.0001,  # electricity
    "video_render_hyperframes": 0.005,
    "video_render_revideo": 0.005,
    "video_render_remotion": 0.0,  # local
    "tts_kokoro": 0.0,  # local
    "tts_elevenlabs": 0.018,  # per 1K chars
    "tts_edge": 0.0,  # free
    "subtitle_whisper": 0.0,  # local
    "youtube_upload": 0.0,
}


@dataclass
class CostBreakdown:
    """Cost breakdown for a single video."""

    llm_input_tokens: int = 0
    llm_output_tokens: int = 0
    llm_cost: float = 0.0
    image_generations: int = 0
    image_cost: float = 0.0
    video_renders: int = 0
    video_cost: float = 0.0
    tts_characters: int = 0
    tts_cost: float = 0.0
    external_api_calls: int = 0
    external_api_cost: float = 0.0
    operations: dict[str, int] = field(default_factory=dict)
    metadata: dict[str, Any] = field(default_factory=dict)

    @property
    def total_cost(self) -> float:
        return self.llm_cost + self.image_cost + self.video_cost + self.tts_cost + self.external_api_cost

    def to_dict(self) -> dict[str, Any]:
        return {
            "llm": {
                "input_tokens": self.llm_input_tokens,
                "output_tokens": self.llm_output_tokens,
                "cost_usd": round(self.llm_cost, 4),
            },
            "images": {
                "generations": self.image_generations,
                "cost_usd": round(self.image_cost, 4),
            },
            "video": {
                "renders": self.video_renders,
                "cost_usd": round(self.video_cost, 4),
            },
            "tts": {
                "characters": self.tts_characters,
                "cost_usd": round(self.tts_cost, 4),
            },
            "external_api": {
                "calls": self.external_api_calls,
                "cost_usd": round(self.external_api_cost, 4),
            },
            "total_cost_usd": round(self.total_cost, 4),
            "operations": self.operations,
        }


class CostTracker:
    """Tracks costs for pipeline runs."""

    def __init__(self, job_id: str) -> None:
        self.job_id = job_id
        self.breakdown = CostBreakdown()
        self._start_time = time.time()
        self._ledger_path = settings.logs_dir / f"cost-{job_id}.jsonl"

    def log_llm_call(self, provider: str, model: str, input_tokens: int, output_tokens: int) -> None:
        """Log an LLM API call."""
        pricing = LLM_PRICING.get(model, LLM_PRICING.get("gpt-4o-mini", {"input": 0.0, "output": 0.0}))
        cost = (input_tokens / 1000) * pricing["input"] + (output_tokens / 1000) * pricing["output"]
        self.breakdown.llm_input_tokens += input_tokens
        self.breakdown.llm_output_tokens += output_tokens
        self.breakdown.llm_cost += cost
        self._write({
            "ts": datetime.utcnow().isoformat(),
            "type": "llm",
            "provider": provider,
            "model": model,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "cost_usd": round(cost, 6),
        })

    def log_image_gen(self, engine: str, count: int = 1) -> None:
        """Log image generation."""
        key = f"image_gen_{engine}"
        cost = OPERATION_COSTS.get(key, 0.002) * count
        self.breakdown.image_generations += count
        self.breakdown.image_cost += cost
        self.breakdown.operations[key] = self.breakdown.operations.get(key, 0) + count
        self._write({
            "ts": datetime.utcnow().isoformat(),
            "type": "image",
            "engine": engine,
            "count": count,
            "cost_usd": round(cost, 6),
        })

    def log_video_render(self, engine: str, duration_sec: float = 60.0) -> None:
        """Log video render."""
        key = f"video_render_{engine}"
        cost = OPERATION_COSTS.get(key, 0.005)
        self.breakdown.video_renders += 1
        self.breakdown.video_cost += cost
        self.breakdown.operations[key] = self.breakdown.operations.get(key, 0) + 1
        self._write({
            "ts": datetime.utcnow().isoformat(),
            "type": "video",
            "engine": engine,
            "duration_sec": duration_sec,
            "cost_usd": round(cost, 6),
        })

    def log_tts(self, engine: str, characters: int) -> None:
        """Log TTS generation."""
        key = f"tts_{engine}"
        cost_per_1k = OPERATION_COSTS.get(key, 0.0)
        cost = (characters / 1000) * cost_per_1k
        self.breakdown.tts_characters += characters
        self.breakdown.tts_cost += cost
        self.breakdown.operations[key] = self.breakdown.operations.get(key, 0) + characters
        self._write({
            "ts": datetime.utcnow().isoformat(),
            "type": "tts",
            "engine": engine,
            "characters": characters,
            "cost_usd": round(cost, 6),
        })

    def log_external_api(self, service: str, cost_usd: float = 0.0) -> None:
        """Log external API call."""
        self.breakdown.external_api_calls += 1
        self.breakdown.external_api_cost += cost_usd
        self._write({
            "ts": datetime.utcnow().isoformat(),
            "type": "external_api",
            "service": service,
            "cost_usd": round(cost_usd, 6),
        })

    def finalize(self) -> dict[str, Any]:
        """Finalize cost tracking and return summary."""
        elapsed = time.time() - self._start_time
        summary = self.breakdown.to_dict()
        summary["job_id"] = self.job_id
        summary["elapsed_sec"] = round(elapsed, 2)
        summary["timestamp"] = datetime.utcnow().isoformat()
        self._write({"type": "finalize", **summary})
        return summary

    def _write(self, entry: dict[str, Any]) -> None:
        """Append to cost ledger."""
        if not settings.observability.cost_tracking:
            return
        settings.logs_dir.mkdir(parents=True, exist_ok=True)
        with open(self._ledger_path, "a") as f:
            f.write(json.dumps(entry, default=str) + "\n")
