# Video Build Mesh

This pipeline now has one connected video build mesh for every build:

1. **Design intelligence**: `video-design-stack`, `ui-ux-pro-max`, CKM design skills, and Open Design skills shape the brief, visual system, layout, typography, accessibility, and interaction/motion direction.
2. **Scene production**: Step 4 attaches the mesh to the scene manifest and keeps both lanes visible: HyperFrames as the preferred new-video engine, Remotion as the existing legacy renderer.
3. **Render handoff**: Step 7 attaches a HyperFrames handoff plan to the render spec while preserving the current Remotion execution path for StoryV3/ZmartyBitcoin.
4. **Concrete HyperFrames output**: Step 7 writes a runnable `out/hyperframes-handoff/index.html`, sidecar `mesh-manifest.json`, and lint evidence for the current scene manifest.
5. **QA**: Step 8 checks that scene/render artifacts carry mesh metadata, a HyperFrames handoff path, and scene coverage.
6. **Learning loop**: Existing `skill_db` and `learnings` keep successful patterns available for later runs.

## Runtime Policy

- New HTML-native videos, product walkthroughs, reels, motion graphics, website-to-video promos, captions, and audio-reactive work prefer HyperFrames.
- Existing Remotion compositions continue to render through Remotion until a specific run is ported.
- Open Design and UI/UX Pro Max are used upstream to make the video look intentional before render time.
- Every completed video should have proof from technical QA plus design/motion QA.

## Check The Mesh

```bash
python3.13 - <<'PY'
from dashboard.engines.video_build_mesh import status_json
print(status_json())
PY
```

Useful render checks:

```bash
npx hyperframes doctor
npx hyperframes lint out/hyperframes-handoff
npx hyperframes inspect out/hyperframes-handoff --json
npm run build
python3.13 tools/pipeline_doctor.py
```
