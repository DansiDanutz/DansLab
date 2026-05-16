"""Prometheus-compatible metrics for the video pipeline.

Exposes cost, latency, success rates, and queue depth metrics
for Grafana integration.
"""

from __future__ import annotations

import time
from contextlib import contextmanager
from typing import Any, Generator

from core.settings import settings


class MetricsCollector:
    """In-memory metrics collector with Prometheus exposition format."""

    def __init__(self) -> None:
        self._counters: dict[str, float] = {}
        self._gauges: dict[str, float] = {}
        self._histograms: dict[str, list[float]] = {}
        self._labels: dict[str, dict[str, str]] = {}

    def inc(self, name: str, value: float = 1.0, labels: dict[str, str] | None = None) -> None:
        key = self._key(name, labels)
        self._counters[key] = self._counters.get(key, 0.0) + value

    def set(self, name: str, value: float, labels: dict[str, str] | None = None) -> None:
        key = self._key(name, labels)
        self._gauges[key] = value

    def observe(self, name: str, value: float, labels: dict[str, str] | None = None) -> None:
        key = self._key(name, labels)
        if key not in self._histograms:
            self._histograms[key] = []
        self._histograms[key].append(value)

    @contextmanager
    def timer(self, name: str, labels: dict[str, str] | None = None) -> Generator[None, None, None]:
        start = time.time()
        try:
            yield
        finally:
            self.observe(name, time.time() - start, labels)

    def render_prometheus(self) -> str:
        """Render metrics in Prometheus exposition format."""
        lines: list[str] = []

        # Counters
        for key, value in self._counters.items():
            name, label_str = self._split_key(key)
            lines.append(f"# HELP {name} Total count")
            lines.append(f"# TYPE {name} counter")
            lines.append(f'{name}{label_str} {value}')

        # Gauges
        for key, value in self._gauges.items():
            name, label_str = self._split_key(key)
            lines.append(f"# HELP {name} Current value")
            lines.append(f"# TYPE {name} gauge")
            lines.append(f'{name}{label_str} {value}')

        # Histograms (simple bucket summary)
        for key, values in self._histograms.items():
            name, label_str = self._split_key(key)
            lines.append(f"# HELP {name} Duration/latency histogram")
            lines.append(f"# TYPE {name} histogram")
            for bucket in [0.1, 0.5, 1.0, 2.5, 5.0, 10.0, 30.0, 60.0, 300.0]:
                count = sum(1 for v in values if v <= bucket)
                bucket_labels = self._merge_label(label_str, "le", str(bucket))
                lines.append(f'{name}_bucket{bucket_labels} {count}')
            lines.append(f'{name}_sum{label_str} {sum(values)}')
            lines.append(f'{name}_count{label_str} {len(values)}')

        return "\n".join(lines)

    def _merge_label(self, label_str: str, key: str, value: str) -> str:
        extra = f'{key}="{value}"'
        if not label_str:
            return "{" + extra + "}"
        return label_str[:-1] + "," + extra + "}"

    def _key(self, name: str, labels: dict[str, str] | None) -> str:
        if not labels:
            return name
        label_str = ",".join(f'{k}="{v}"' for k, v in sorted(labels.items()))
        return f"{name}|{label_str}"

    def _split_key(self, key: str) -> tuple[str, str]:
        if "|" not in key:
            return key, ""
        name, label_str = key.split("|", 1)
        return name, "{" + label_str + "}"


# Singleton
metrics = MetricsCollector()


# Pipeline-specific metric helpers
def record_pipeline_start(job_id: str, topic: str) -> None:
    metrics.inc("danslab_pipeline_runs_total", labels={"topic": topic})
    metrics.set("danslab_pipeline_active_jobs", 1)


def record_pipeline_complete(job_id: str, topic: str, success: bool) -> None:
    status = "success" if success else "failure"
    metrics.inc("danslab_pipeline_completions_total", labels={"status": status, "topic": topic})
    metrics.set("danslab_pipeline_active_jobs", -1)


def record_step_duration(step: str, duration: float, success: bool) -> None:
    status = "success" if success else "failure"
    metrics.observe("danslab_step_duration_seconds", duration, labels={"step": step, "status": status})


def record_cost(job_id: str, cost_usd: float, stage: str) -> None:
    metrics.observe("danslab_cost_usd", cost_usd, labels={"stage": stage})


def record_render(engine: str, duration: float, success: bool) -> None:
    status = "success" if success else "failure"
    metrics.inc("danslab_renders_total", labels={"engine": engine, "status": status})
    metrics.observe("danslab_render_duration_seconds", duration, labels={"engine": engine})


def record_queue_depth(queued: int, processing: int) -> None:
    metrics.set("danslab_queue_depth", queued, labels={"type": "queued"})
    metrics.set("danslab_queue_depth", processing, labels={"type": "processing"})
