"""Redis-backed job queue for the video pipeline.

Lightweight durable queue without requiring Celery. Uses Redis lists
for queueing and JSON for job serialization.
"""

from __future__ import annotations

import json
import time
import uuid
from dataclasses import asdict, dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any

import redis


class JobStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    RETRYING = "retrying"
    CANCELLED = "cancelled"


@dataclass
class Job:
    """A pipeline job."""

    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    topic: str = ""
    engine: str = "hyperframes"
    status: JobStatus = JobStatus.PENDING
    progress: float = 0.0
    current_step: str = ""
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    started_at: str | None = None
    completed_at: str | None = None
    error: str | None = None
    result: dict[str, Any] = field(default_factory=dict)
    retries: int = 0
    max_retries: int = 3
    cost_usd: float = 0.0
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_json(self) -> str:
        return json.dumps(asdict(self), default=str)

    @classmethod
    def from_json(cls, raw: str) -> Job:
        return cls(**json.loads(raw))

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


class PipelineQueue:
    """Redis-backed pipeline job queue."""

    QUEUE_KEY = "danslab:pipeline:queue"
    PROCESSING_KEY = "danslab:pipeline:processing"
    DEAD_LETTER_KEY = "danslab:pipeline:dead"
    JOB_PREFIX = "danslab:pipeline:job:"

    def __init__(self, redis_url: str = "redis://localhost:6379/0") -> None:
        self.r = redis.from_url(redis_url, decode_responses=True)

    def enqueue(self, job: Job) -> Job:
        """Add a job to the queue."""
        self.r.set(f"{self.JOB_PREFIX}{job.id}", job.to_json())
        self.r.lpush(self.QUEUE_KEY, job.id)
        return job

    def dequeue(self, timeout: int = 5) -> Job | None:
        """Get the next job from the queue."""
        result = self.r.brpop(self.QUEUE_KEY, timeout=timeout)
        if not result:
            return None
        job_id = result[1]
        raw = self.r.get(f"{self.JOB_PREFIX}{job_id}")
        if not raw:
            return None
        job = Job.from_json(raw)
        job.status = JobStatus.RUNNING
        job.started_at = datetime.utcnow().isoformat()
        self.r.set(f"{self.JOB_PREFIX}{job.id}", job.to_json())
        self.r.lpush(self.PROCESSING_KEY, job.id)
        return job

    def complete(self, job: Job, result: dict[str, Any] | None = None) -> None:
        """Mark a job as completed."""
        job.status = JobStatus.COMPLETED
        job.completed_at = datetime.utcnow().isoformat()
        job.progress = 100.0
        if result:
            job.result = result
        self.r.set(f"{self.JOB_PREFIX}{job.id}", job.to_json())
        self.r.lrem(self.PROCESSING_KEY, 0, job.id)

    def fail(self, job: Job, error: str) -> None:
        """Mark a job as failed or retrying."""
        if job.retries < job.max_retries:
            job.status = JobStatus.RETRYING
            job.retries += 1
            job.error = error
            job.progress = 0.0
            self.r.set(f"{self.JOB_PREFIX}{job.id}", job.to_json())
            self.r.lrem(self.PROCESSING_KEY, 0, job.id)
            self.r.lpush(self.QUEUE_KEY, job.id)
        else:
            job.status = JobStatus.FAILED
            job.error = error
            job.completed_at = datetime.utcnow().isoformat()
            self.r.set(f"{self.JOB_PREFIX}{job.id}", job.to_json())
            self.r.lrem(self.PROCESSING_KEY, 0, job.id)
            self.r.lpush(self.DEAD_LETTER_KEY, job.id)

    def update_progress(self, job: Job, step: str, progress: float, cost_delta: float = 0.0) -> None:
        """Update job progress and accumulated cost."""
        job.current_step = step
        job.progress = progress
        job.cost_usd += cost_delta
        self.r.set(f"{self.JOB_PREFIX}{job.id}", job.to_json())

    def get_job(self, job_id: str) -> Job | None:
        """Get a job by ID."""
        raw = self.r.get(f"{self.JOB_PREFIX}{job_id}")
        return Job.from_json(raw) if raw else None

    def list_jobs(self, status: JobStatus | None = None, limit: int = 50) -> list[Job]:
        """List recent jobs, optionally filtered by status."""
        jobs: list[Job] = []
        for key in self.r.scan_iter(match=f"{self.JOB_PREFIX}*", count=100):
            raw = self.r.get(key)
            if raw:
                job = Job.from_json(raw)
                if status is None or job.status == status:
                    jobs.append(job)
        jobs.sort(key=lambda j: j.created_at, reverse=True)
        return jobs[:limit]

    def queue_length(self) -> int:
        return self.r.llen(self.QUEUE_KEY)

    def processing_length(self) -> int:
        return self.r.llen(self.PROCESSING_KEY)

    def health_check(self) -> dict[str, Any]:
        """Return queue health metrics."""
        return {
            "healthy": self.r.ping(),
            "queued": self.queue_length(),
            "processing": self.processing_length(),
            "dead_letter": self.r.llen(self.DEAD_LETTER_KEY),
            "total_jobs": sum(1 for _ in self.r.scan_iter(match=f"{self.JOB_PREFIX}*", count=1000)),
        }
