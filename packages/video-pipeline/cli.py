#!/usr/bin/env python3
"""DansLab Video Pipeline CLI.

Unified command-line interface for the entire pipeline:
    $ python cli.py run --topic "Crypto News May 2026"
    $ python cli.py queue --topic "AI Agents" --engine hyperframes
    $ python cli.py status
    $ python cli.py render --engine revideo --manifest scenes.json
    $ python cli.py cost --job-id abc123
    $ python cli.py worker
"""

from __future__ import annotations

import argparse
import asyncio
import json
import sys
from pathlib import Path

# Ensure project root is in path
PROJECT_ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(PROJECT_ROOT))

from core.orchestrator import PipelineOrchestrator
from core.queue import Job, PipelineQueue
from core.settings import settings
from core.monitoring import metrics


def cmd_run(args: argparse.Namespace) -> int:
    """Run a single pipeline job synchronously."""
    orchestrator = PipelineOrchestrator()
    job = Job(
        topic=args.topic,
        engine=args.engine,
        metadata={"mode": "cli_direct", "auto_upload": args.upload},
    )
    result = asyncio.run(orchestrator.run_job(job))
    print(json.dumps(result, indent=2, default=str))
    return 0 if result.get("ok") else 1


def cmd_queue(args: argparse.Namespace) -> int:
    """Enqueue a job for the worker."""
    queue = PipelineQueue()
    job = Job(
        topic=args.topic,
        engine=args.engine,
        metadata={"mode": "queued", "auto_upload": args.upload},
    )
    queue.enqueue(job)
    print(f"Queued job {job.id} — topic: {args.topic}")
    return 0


def cmd_status(args: argparse.Namespace) -> int:
    """Show pipeline status."""
    queue = PipelineQueue()
    health = queue.health_check()
    print(json.dumps(health, indent=2))
    return 0


def cmd_worker(args: argparse.Namespace) -> int:
    """Start the pipeline worker."""
    orchestrator = PipelineOrchestrator()
    try:
        asyncio.run(orchestrator.worker_loop())
    except KeyboardInterrupt:
        print("\n[cli] Worker stopped.")
    return 0


def cmd_jobs(args: argparse.Namespace) -> int:
    """List recent jobs."""
    queue = PipelineQueue()
    jobs = queue.list_jobs(status=args.status, limit=args.limit)
    print(json.dumps([j.to_dict() for j in jobs], indent=2, default=str))
    return 0


def cmd_render(args: argparse.Namespace) -> int:
    """Render a scene manifest with specified engine."""
    manifest = json.loads(Path(args.manifest).read_text())
    output = Path(args.output)

    if args.engine == "revideo":
        from renderers.revideo_engine import RevideoEngine
        engine = RevideoEngine()
        result = engine.render(
            manifest,
            output,
            width=args.width,
            height=args.height,
            fps=args.fps,
        )
    elif args.engine == "hyperframes":
        from engines.hyperframes_render_engine import render_composition
        result = render_composition(
            input_dir=args.manifest,
            output_path=output,
            width=args.width,
            height=args.height,
            fps=args.fps,
        )
    else:
        print(f"Unknown engine: {args.engine}")
        return 1

    print(json.dumps(result, indent=2, default=str))
    return 0 if result.get("ok") else 1


def cmd_cost(args: argparse.Namespace) -> int:
    """Show cost breakdown for a job."""
    ledger = settings.logs_dir / f"cost-{args.job_id}.jsonl"
    if not ledger.exists():
        print(f"No cost ledger found for job {args.job_id}")
        return 1

    total = 0.0
    entries = []
    for line in ledger.read_text().strip().split("\n"):
        entry = json.loads(line)
        entries.append(entry)
        if "cost_usd" in entry:
            total += entry["cost_usd"]

    print(f"Job: {args.job_id}")
    print(f"Total cost: ${total:.4f}")
    print(f"Entries: {len(entries)}")
    if args.verbose:
        for e in entries:
            print(json.dumps(e, indent=2, default=str))
    return 0


def cmd_metrics(args: argparse.Namespace) -> int:
    """Output Prometheus metrics."""
    print(metrics.render_prometheus())
    return 0


def cmd_crew(args: argparse.Namespace) -> int:
    """Run CrewAI content crew."""
    from agents.content_crew import ContentCrew

    crew = ContentCrew()
    phase = args.phase

    if phase == "research":
        result = crew.run_research(sources=args.sources.split(",") if args.sources else None)
    elif phase == "script":
        result = crew.run_script(topic=args.topic, style=args.style)
    elif phase == "visual":
        script = Path(args.script).read_text() if args.script else args.topic
        result = crew.run_visual_plan(script=script)
    elif phase == "seo":
        script = Path(args.script).read_text() if args.script else ""
        result = crew.run_seo(script=script, topic=args.topic)
    elif phase == "qa":
        result = crew.run_qa(video_path=args.video, metadata={})
    else:
        print(f"Unknown phase: {phase}")
        return 1

    print(json.dumps(result, indent=2, default=str))
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(
        prog="danslab-pipeline",
        description="DansLab Video Pipeline — research to render",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    # run
    run_p = subparsers.add_parser("run", help="Run pipeline job directly")
    run_p.add_argument("--topic", required=True, help="Video topic")
    run_p.add_argument("--engine", default="hyperframes", help="Render engine")
    run_p.add_argument("--upload", action="store_true", help="Auto-upload to YouTube")
    run_p.set_defaults(func=cmd_run)

    # queue
    queue_p = subparsers.add_parser("queue", help="Enqueue a job")
    queue_p.add_argument("--topic", required=True)
    queue_p.add_argument("--engine", default="hyperframes")
    queue_p.add_argument("--upload", action="store_true")
    queue_p.set_defaults(func=cmd_queue)

    # status
    status_p = subparsers.add_parser("status", help="Show queue status")
    status_p.set_defaults(func=cmd_status)

    # worker
    worker_p = subparsers.add_parser("worker", help="Start worker loop")
    worker_p.set_defaults(func=cmd_worker)

    # jobs
    jobs_p = subparsers.add_parser("jobs", help="List jobs")
    jobs_p.add_argument("--status", default=None)
    jobs_p.add_argument("--limit", type=int, default=20)
    jobs_p.set_defaults(func=cmd_jobs)

    # render
    render_p = subparsers.add_parser("render", help="Render a scene manifest")
    render_p.add_argument("--engine", required=True, choices=["hyperframes", "revideo", "remotion"])
    render_p.add_argument("--manifest", required=True, help="Path to scene manifest JSON")
    render_p.add_argument("--output", required=True, help="Output MP4 path")
    render_p.add_argument("--width", type=int, default=1920)
    render_p.add_argument("--height", type=int, default=1080)
    render_p.add_argument("--fps", type=int, default=30)
    render_p.set_defaults(func=cmd_render)

    # cost
    cost_p = subparsers.add_parser("cost", help="Show cost breakdown")
    cost_p.add_argument("--job-id", required=True)
    cost_p.add_argument("-v", "--verbose", action="store_true")
    cost_p.set_defaults(func=cmd_cost)

    # metrics
    metrics_p = subparsers.add_parser("metrics", help="Prometheus metrics")
    metrics_p.set_defaults(func=cmd_metrics)

    # crew
    crew_p = subparsers.add_parser("crew", help="Run CrewAI content crew")
    crew_p.add_argument("--phase", required=True, choices=["research", "script", "visual", "seo", "qa"])
    crew_p.add_argument("--topic", default="")
    crew_p.add_argument("--style", default="energetic")
    crew_p.add_argument("--sources", default="")
    crew_p.add_argument("--script", default="")
    crew_p.add_argument("--video", default="")
    crew_p.set_defaults(func=cmd_crew)

    args = parser.parse_args()
    settings.ensure_dirs()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
