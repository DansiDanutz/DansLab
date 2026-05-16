"""Revideo render engine for batch server-side video generation.

Revideo is an MIT-licensed TypeScript framework built on Motion Canvas,
designed specifically for automated pipelines with `renderVideo()` API.
"""

from __future__ import annotations

import json
import shutil
import subprocess
import tempfile
from pathlib import Path
from typing import Any

from core.settings import settings


REVIDEO_TEMPLATE = '''import {makeScene2D, Txt} from '@revideo/2d';
import {createRef, waitFor} from '@revideo/core';

export default makeScene2D(function* (view) {
  const title = __TITLE__;
  const subtitle = __SUBTITLE__;
  const duration = __DURATION__;

  // Background
  view.fill('#0a0505');

  // Title
  const titleRef = createRef<Txt>();
  view.add(
    <Txt
      ref={titleRef}
      text={title}
      fill="#e74c3c"
      fontSize={80}
      fontFamily="Inter, sans-serif"
      fontWeight={700}
      textAlign="center"
      y={0}
    />
  );

  // Subtitle
  if (subtitle) {
    const subRef = createRef<Txt>();
    view.add(
      <Txt
        ref={subRef}
        text={subtitle}
        fill="#d4a017"
        fontSize={40}
        fontFamily="Inter, sans-serif"
        textAlign="center"
        y={100}
      />
    );
  }

  yield* titleRef().opacity(0, 0).to(1, 0.5);
  yield* waitFor(duration);
});
'''


class RevideoEngine:
    """Revideo batch rendering engine."""

    def __init__(self) -> None:
        self.node = shutil.which("node") or shutil.which("bun")
        self.npm = shutil.which("npm") or shutil.which("pnpm")
        self.output_dir = settings.out_dir

    def is_available(self) -> bool:
        """Check if Revideo CLI is installed."""
        if not self.node:
            return False
        try:
            result = subprocess.run(
                [self.node, "-e", "require('@revideo/core')"],
                capture_output=True,
                text=True,
                cwd=str(settings.project_root),
            )
            return result.returncode == 0
        except Exception:
            return False

    def render(
        self,
        scene_manifest: dict[str, Any],
        output_path: Path,
        width: int = 1920,
        height: int = 1080,
        fps: int = 30,
        timeout: int = 600,
    ) -> dict[str, Any]:
        """Render a video from a scene manifest using Revideo."""
        if not self.is_available():
            return {"ok": False, "error": "Revideo not installed. Run: npm install @revideo/core @revideo/2d"}

        with tempfile.TemporaryDirectory() as tmpdir:
            tmp = Path(tmpdir)

            # Write project files
            self._write_project_files(tmp, scene_manifest)

            # Write variables JSON
            variables = self._manifest_to_variables(scene_manifest)
            (tmp / "variables.json").write_text(json.dumps(variables))

            # Run render
            project_file = json.dumps(str(tmp / "project.ts"))
            variables_file = json.dumps(str(tmp / "variables.json"))
            output_file = json.dumps(str(output_path))
            cmd = [
                self.node,
                "-e",
                f"""
                const {{renderVideo}} = require('@revideo/renderer');
                renderVideo({{
                  projectFile: {project_file},
                  variables: require({variables_file}),
                  outputFile: {output_file},
                  settings: {{ width: {width}, height: {height}, fps: {fps} }},
                }}).then(() => process.exit(0)).catch(e => {{ console.error(e); process.exit(1); }});
                """,
            ]

            try:
                result = subprocess.run(
                    cmd,
                    capture_output=True,
                    text=True,
                    timeout=timeout,
                    cwd=str(tmp),
                )
                if result.returncode == 0 and output_path.exists():
                    return {
                        "ok": True,
                        "output_path": str(output_path),
                        "engine": "revideo",
                        "resolution": f"{width}x{height}",
                        "fps": fps,
                    }
                return {"ok": False, "error": result.stderr or "render failed", "stdout": result.stdout}
            except subprocess.TimeoutExpired:
                return {"ok": False, "error": f"render timed out after {timeout}s"}
            except Exception as e:
                return {"ok": False, "error": f"{type(e).__name__}: {e}"}

    def _write_project_files(self, tmp: Path, manifest: dict[str, Any]) -> None:
        """Write minimal Revideo project files."""
        # package.json
        pkg = {
            "name": "danslab-render",
            "version": "1.0.0",
            "dependencies": {
                "@revideo/core": "^0.10",
                "@revideo/2d": "^0.10",
                "@revideo/renderer": "^0.10",
            },
        }
        (tmp / "package.json").write_text(json.dumps(pkg, indent=2))

        # tsconfig.json
        tsconfig = {
            "compilerOptions": {
                "target": "ES2020",
                "module": "commonjs",
                "jsx": "react-jsx",
                "jsxImportSource": "@revideo/2d",
                "esModuleInterop": True,
            },
        }
        (tmp / "tsconfig.json").write_text(json.dumps(tsconfig, indent=2))

        # Project entry
        scenes = manifest.get("scenes") or [
            {
                "title": manifest.get("title", "DansLab Video"),
                "subtitle": manifest.get("subtitle", ""),
                "duration": manifest.get("duration", 5),
            }
        ]
        scene_imports = "\n".join(
            f"import scene{i} from './scene{i}';" for i in range(len(scenes))
        )
        scene_array = ", ".join(f"scene{i}" for i in range(len(scenes)))

        project_ts = f"""
import {{makeProject}} from '@revideo/core';
{scene_imports}

export default makeProject({{
  scenes: [{scene_array}],
}});
"""
        (tmp / "project.ts").write_text(project_ts)

        # Scene files
        for i, scene in enumerate(scenes):
            title = scene.get("title", "Scene")
            subtitle = scene.get("subtitle", "")
            duration = scene.get("duration", 5)
            scene_ts = REVIDEO_TEMPLATE.replace("__TITLE__", json.dumps(title))
            scene_ts = scene_ts.replace("__SUBTITLE__", json.dumps(subtitle))
            scene_ts = scene_ts.replace("__DURATION__", str(duration))
            (tmp / f"scene{i}.ts").write_text(scene_ts)

    def _manifest_to_variables(self, manifest: dict[str, Any]) -> dict[str, Any]:
        """Convert scene manifest to Revideo variables."""
        scenes = manifest.get("scenes", [])
        return {
            "scenes": [
                {
                    "title": s.get("title", ""),
                    "subtitle": s.get("subtitle", ""),
                    "duration": s.get("duration", 5),
                    "bg_color": s.get("bg_color", "#0a0505"),
                    "text_color": s.get("text_color", "#e74c3c"),
                }
                for s in scenes
            ]
        }
