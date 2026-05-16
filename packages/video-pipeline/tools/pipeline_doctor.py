#!/usr/bin/env python3
"""Pipeline health gate for local YouTubePipeline + ComfyUI integration."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_ROOT = ROOT / "out" / "maintenance"

sys.path.insert(0, str(ROOT))


def run(cmd: list[str], timeout: int = 300) -> tuple[int, str, str]:
    proc = subprocess.run(
        cmd,
        cwd=str(ROOT),
        text=True,
        capture_output=True,
        timeout=timeout,
        check=False,
    )
    return proc.returncode, proc.stdout, proc.stderr


def fetch_json(base: str, path: str) -> object:
    b = base.rstrip("/")
    with urllib.request.urlopen(f"{b}{path}", timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def ffprobe(path: Path) -> dict:
    code, stdout, stderr = run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration,format_name",
            "-show_entries",
            "stream=codec_name,width,height,sample_rate,channels",
            "-of",
            "json",
            str(path),
        ],
        timeout=30,
    )
    if code != 0:
        return {"ok": False, "error": stderr.strip()}
    return {"ok": True, "data": json.loads(stdout or "{}")}


def sips_probe(path: Path) -> dict:
    code, stdout, stderr = run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(path)], timeout=30)
    if code != 0:
        return {"ok": False, "error": stderr.strip() or stdout.strip()}
    data: dict[str, int] = {}
    for line in stdout.splitlines():
        line = line.strip()
        if line.startswith("pixelWidth:"):
            data["width"] = int(line.split(":", 1)[1].strip())
        elif line.startswith("pixelHeight:"):
            data["height"] = int(line.split(":", 1)[1].strip())
    return {"ok": bool(data.get("width") and data.get("height")), "data": data, "stdout": stdout}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--no-smoke", action="store_true", help="Skip image/audio smoke generation")
    parser.add_argument("--no-audio", action="store_true", help="Skip VibeVoice audio smoke")
    parser.add_argument(
        "--require-vibevoice",
        action="store_true",
        help="Fail when VibeVoice nodes/models are unavailable (default: optional)",
    )
    parser.add_argument("--wan-smoke", action="store_true", help="Run a tiny local Wan video smoke")
    parser.add_argument("--timestamp", default=time.strftime("%Y%m%d-%H%M%S"))
    args = parser.parse_args()

    run_dir = OUT_ROOT / args.timestamp
    run_dir.mkdir(parents=True, exist_ok=False)
    failures: list[str] = []
    warnings: list[str] = []

    evidence: dict[str, object] = {
        "timestamp": args.timestamp,
        "root": str(ROOT),
        "run_dir": str(run_dir),
    }

    try:
        from dashboard.engines import kokoro_client, vibevoice_client, wan_client
        from dashboard.engines.comfyui_paths import comfyui_models_dir, find_comfy_doctor_script
        from dashboard.engines.local_runtime import command_works, ensure_local_tools_on_path, which
        from dashboard.engines.step5_audio import harvest_piper_voices, harvest_tts_tools
        from dashboard.engines.step6_subtitles import harvest_subtitle_tools, harvest_whisper_models
        from dashboard.engines.step_image_gen import (
            COMFYUI_HOST,
            COMFYUI_WORKFLOW_PATH,
            fetch_comfyui,
            image_provider_status,
            video_provider_status,
        )
    except Exception as exc:
        failures.append(f"pipeline imports failed: {type(exc).__name__}: {exc}")
        write(run_dir / "evidence.json", json.dumps(evidence, indent=2, sort_keys=True) + "\n")
        print(f"RESULT=FAIL {failures[-1]}")
        return 1

    ensure_local_tools_on_path()

    comfy_base = COMFYUI_HOST.rstrip("/")

    code, stdout, stderr = run([sys.executable, "-m", "py_compile",
                                "dashboard/engines/local_runtime.py",
                                "dashboard/engines/comfyui_paths.py",
                                "dashboard/engines/step_image_gen.py",
                                "dashboard/engines/vibevoice_client.py",
                                "dashboard/engines/wan_client.py",
                                "dashboard/engines/step5_audio.py",
                                "dashboard/engines/step6_subtitles.py",
                                "dashboard/server.py"])
    evidence["py_compile"] = {"ok": code == 0, "stdout": stdout, "stderr": stderr}
    if code != 0:
        failures.append("py_compile failed")

    comfy_doc = find_comfy_doctor_script()
    if comfy_doc and comfy_doc.exists():
        code, stdout, stderr = run([sys.executable, str(comfy_doc)], timeout=180)
        evidence["comfy_doctor"] = {
            "ran": True,
            "path": str(comfy_doc),
            "ok": code == 0,
            "stdout": stdout,
            "stderr": stderr,
        }
        if code != 0:
            failures.append(f"Comfy doctor failed ({comfy_doc})")
    else:
        evidence["comfy_doctor"] = {
            "ran": False,
            "skipped": True,
            "note": (
                "comfy-doctor.py not found under Comfy install roots "
                "(set COMFYUI_MODEL_BASE parent or use standard ~/Documents/ComfyUI)."
            ),
            "models_dir_hint": str(comfyui_models_dir()),
        }

    try:
        evidence["comfy_queue"] = fetch_json(comfy_base, "/queue")
        evidence["comfy_system_stats"] = fetch_json(comfy_base, "/system_stats")
    except Exception as exc:
        failures.append(f"Comfy API check failed: {exc}")

    tools = {
        "ffmpeg": which("ffmpeg"),
        "ffprobe": which("ffprobe"),
        "sox": which("sox"),
        "espeak-ng": which("espeak-ng"),
        "piper": which("piper"),
        "whisper-cli": which("whisper-cli"),
    }
    tool_args = {
        "ffmpeg": ("-version",),
        "ffprobe": ("-version",),
        "sox": ("--version",),
        "espeak-ng": ("--version",),
        "piper": ("--help",),
        "whisper-cli": ("--help",),
    }
    evidence["tools"] = {
        name: {"path": path, "works": command_works(path, *tool_args[name]) if path else False}
        for name, path in tools.items()
    }
    if not evidence["tools"]["ffmpeg"]["works"]:
        failures.append("ffmpeg not runnable")
    if not evidence["tools"]["ffprobe"]["works"]:
        failures.append("ffprobe not runnable")
    if not evidence["tools"]["whisper-cli"]["works"]:
        failures.append("bundled whisper-cli not runnable")

    evidence["providers"] = {
        "comfy_host": COMFYUI_HOST,
        "comfy_workflow": COMFYUI_WORKFLOW_PATH,
        "image": image_provider_status(),
        "video": video_provider_status(),
        "kokoro": kokoro_client.status(),
        "vibevoice": vibevoice_client.status(),
        "wan": wan_client.status(),
        "tts_tools": harvest_tts_tools(),
        "piper_voices": harvest_piper_voices(),
        "subtitle_tools": harvest_subtitle_tools(),
        "whisper_models": harvest_whisper_models(),
    }
    if not evidence["providers"]["image"]["comfyui"]["available"]:
        failures.append("local Comfy image provider unavailable")
    vv_status = evidence["providers"]["vibevoice"]
    if not vv_status.get("available"):
        msg = (
            "VibeVoice unavailable (optional) — Piper/eSpeak fallback still OK; "
            "install ComfyUI + VibeVoice-ComfyUI + model under "
            "models/vibevoice/, or pass --require-vibevoice to fail fast."
        )
        warnings.append(msg)
        evidence["vibevoice_warning"] = msg
        if args.require_vibevoice:
            failures.append("VibeVoice unavailable (--require-vibevoice)")
    elif args.require_vibevoice:
        evidence["vibevoice_warning"] = "VibeVoice available (required check satisfied)"

    evidence["warnings"] = warnings

    smoke: dict[str, object] = {}
    if not args.no_smoke and not failures:
        image_path = run_dir / "pipeline_comfy_smoke.png"
        ok = fetch_comfyui(
            "local YouTube pipeline smoke test image, dark studio, polished glass sphere, no text",
            str(image_path),
            width=256,
            height=256,
            timeout=180,
        )
        probe = ffprobe(image_path) if image_path.exists() else None
        smoke["image"] = {"ok": ok, "path": str(image_path), "probe": probe}
        if not ok or not image_path.exists():
            failures.append("pipeline Comfy image smoke failed")

        # HyperFrames render smoke test
        try:
            sys.path.insert(0, str(ROOT / "dashboard" / "engines"))
            from hyperframes_render_engine import hyperframes_available, render_composition, lint_composition
            if hyperframes_available():
                hf_smoke_dir = run_dir / "hf_smoke"
                hf_smoke_dir.mkdir(parents=True, exist_ok=True)
                hf_index = hf_smoke_dir / "index.html"
                hf_index.write_text(
                    '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Smoke</title></head>'
                    '<body style="margin:0;background:#0a0a0c;display:flex;align-items:center;justify-content:center;">'
                    '<div style="color:#3b82f6;font-family:Inter,sans-serif;font-size:4rem;font-weight:800;">HF OK</div>'
                    '</body></html>',
                    encoding='utf-8',
                )
                lint = lint_composition(hf_smoke_dir, timeout=30)
                hf_result = render_composition(
                    hf_smoke_dir,
                    output_path=hf_smoke_dir / "smoke.mp4",
                    width=256,
                    height=256,
                    fps=30,
                    timeout=120,
                )
                smoke["hyperframes"] = {
                    "ok": hf_result.get("ok") and lint.get("ok"),
                    "lint": lint,
                    "render": hf_result,
                    "path": str(hf_smoke_dir / "smoke.mp4"),
                    "probe": ffprobe(hf_smoke_dir / "smoke.mp4") if (hf_smoke_dir / "smoke.mp4").exists() else None,
                }
                if not smoke["hyperframes"]["ok"]:
                    failures.append("pipeline HyperFrames render smoke failed")
            else:
                smoke["hyperframes"] = {"skipped": True, "reason": "HyperFrames CLI not available"}
        except Exception as exc:
            smoke["hyperframes"] = {"ok": False, "error": f"{type(exc).__name__}: {exc}"}
            failures.append(f"pipeline HyperFrames render smoke error: {exc}")

        if not args.no_audio and vv_status.get("available"):
            audio_path = run_dir / "pipeline_vibevoice_smoke.wav"
            result = vibevoice_client.synthesize(
                "Pipeline audio smoke test.",
                audio_path,
                diffusion_steps=1,
                cfg_scale=1.0,
                seed=7,
                timeout_s=600,
            )
            smoke["audio"] = {
                "result": result,
                "path": str(audio_path),
                "probe": ffprobe(audio_path) if audio_path.exists() else None,
            }
            if not result.get("ok") or not audio_path.exists():
                failures.append("pipeline VibeVoice audio smoke failed")
        elif not args.no_audio and not vv_status.get("available"):
            smoke["audio"] = {"skipped": True, "reason": "VibeVoice not configured"}

        if args.wan_smoke:
            wan_path = run_dir / "pipeline_wan_smoke.webp"
            result = wan_client.text_to_video(
                "Pipeline Wan smoke test, cinematic glowing coin, subtle motion",
                wan_path,
                width=320,
                height=192,
                length=5,
                steps=4,
                cfg=3.0,
                seed=17,
                timeout_s=900,
            )
            smoke["wan"] = {
                "result": result,
                "path": str(wan_path),
                "probe": sips_probe(wan_path) if wan_path.exists() else None,
            }
            if not result.get("ok") or not wan_path.exists():
                failures.append("pipeline Wan smoke failed")

    evidence["smoke"] = smoke
    try:
        evidence["comfy_queue_after"] = fetch_json(comfy_base, "/queue")
    except Exception:
        pass

    write(run_dir / "evidence.json", json.dumps(evidence, indent=2, sort_keys=True) + "\n")
    summary = [
        f"# Pipeline Doctor {args.timestamp}",
        "",
        f"- Result: {'FAIL' if failures else 'OK'}",
        f"- Warnings: {len(warnings)}",
        f"- Run folder: `{run_dir}`",
        f"- Image smoke: `{smoke.get('image', {}).get('path', '')}`",
        f"- HyperFrames smoke: `{smoke.get('hyperframes', {}).get('path', '')}`",
        f"- Audio smoke: `{smoke.get('audio', {}).get('path', '')}`",
        f"- Wan smoke: `{smoke.get('wan', {}).get('path', '')}`",
        "",
    ]
    if failures:
        summary += ["## Failures", "", *[f"- {item}" for item in failures], ""]
    if warnings:
        summary += ["## Warnings", "", *[f"- {item}" for item in warnings], ""]
    summary += ["## Evidence", "", "- `evidence.json`", ""]
    write(run_dir / "summary.md", "\n".join(summary))

    print(run_dir)
    print("RESULT=" + ("FAIL" if failures else "OK"))
    for item in failures:
        print("FAIL", item)
    for item in warnings:
        print("WARN", item[:500])
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
