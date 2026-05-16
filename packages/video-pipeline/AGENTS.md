# YouTubePipeline Agent Contract

This repository is the active local video pipeline. Treat it as production-ish:
keep changes small, preserve gates, and verify with syntax/build/doctor checks
before claiming the pipeline is ready.

## Video Build Mesh

- Every video build must route through `dashboard/engines/video_build_mesh.py`.
- Step 3 attaches the mesh to the design system.
- Step 4 attaches the mesh to the scene manifest.
- Step 7 attaches the mesh and HyperFrames handoff plan to the render spec.
- Step 7 also writes `out/hyperframes-handoff/index.html` and lint evidence for the current scene manifest.
- Step 8 checks the mesh as part of QA.
- Prefer HyperFrames for new HTML-native video work. Keep Remotion as the
  compatibility renderer for existing StoryV3/ZmartyBitcoin compositions until
  a run is explicitly ported.

## New Architecture (2026-05-16)

### HyperFrames Primary Render Engine
- `dashboard/engines/hyperframes_render_engine.py` wraps `npx hyperframes render`
- Step 7 auto-renders HF handoff when `STEP7_HYPERFRAMES_AUTO_RENDER` is not `false`
- Parallel render: Remotion + HyperFrames run simultaneously via `execute_parallel_render()`
- `dashboard/engines/render_judge.py` auto-selects best output via ffprobe scoring

### Open Design Integration
- `dashboard/engines/open_design_agent.py` wraps Open Design skill for design system generation
- Step 3 enriches design system with Open Design palette/motion when skill is installed
- Install: `git clone https://github.com/nexu-io/open-design ~/.agents/skills/open-design/`

### Design Agent Orchestrator
- `dashboard/engines/design_agent_orchestrator.py` dispatches design skills automatically
- Skills consumed: design-brief → ui-ux-pro-max → ckm-design-system → ckm-brand → critique → tweaks
- Caches results via skill_db.py Jaccard similarity (≥0.55 short-circuit)
- Enable with `AUTO_DESIGN_AGENTS=1`

### ComfyUI MCP Automation
- `dashboard/engines/comfyui_mcp_client.py` provides workflow generation & execution
- `list_workflows()`, `generate_workflow()`, `run_workflow()`, `swap_model()`
- Falls back to hardcoded JSON when MCP is unavailable
- Set `COMFYUI_MCP_SERVER` to enable MCP workflow generation

### Enhanced QA
- Step 8 includes design critique scoring (≥7 = GREEN)
- Pipeline doctor runs HyperFrames render smoke test

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `STEP7_HYPERFRAMES_AUTO_RENDER` | `true` | Auto-render HF handoff in Step 7 |
| `STEP7_HYPERFRAMES_LINT` | `true` | Run `npx hyperframes lint` after handoff |
| `AUTO_DESIGN_AGENTS` | `false` | Auto-invoke design agent orchestrator |
| `COMFYUI_MCP_SERVER` | (unset) | MCP server URL for ComfyUI automation |
| `HF_RENDER_TIMEOUT` | `600` | HyperFrames render timeout in seconds |
| `HF_RENDER_RETRIES` | `1` | HyperFrames render retry attempts |
| `BYTEPLUS_API_KEY` | (unset) | BytePlus ModelArk API key |
| `ARK_API_KEY` | (unset) | Alias for BytePlus API key |
| `ARK_MODEL` | `seed-2-0-lite-260228` | BytePlus chat model ID |
| `ARK_BASE_URL` | `https://ark.ap-southeast.bytepluses.com/api/v3` | BytePlus API base URL |
| `SEEDANCE_USE_MODELARK` | auto | Force native ModelArk Seedance video tasks; key-only mode also enables it |
| `SEEDANCE_MODEL` | `dreamina-seedance-2-0-260128` | Dreamina Seedance 2.0 model ID |

## BytePlus ModelArk Integration

BytePlus Ark is wired as the **deep-mode fallback** across all step engines:
- Step 2 (script), Step 3 (visual), Step 4 (scenes), Step 5 (audio), Step 6 (subtitles), Step 7 (render)
- Priority: Perplexity → BytePlus Ark → Ollama (local)
- When `mode='deep'` and no `PERPLEXITY_API_KEY`, steps automatically fall back to BytePlus Ark
- Set `BYTEPLUS_API_KEY` in `~/.openclaw/fleet.env` or macOS Keychain (`openclaw.byteplus_ark`)

## Verification

Default verification after edits:

```bash
python3.13 -m py_compile dashboard/server.py dashboard/engines/*.py
npm run build
python3.13 tools/pipeline_doctor.py
```

When only Python metadata/routing changes were made, `py_compile` plus the mesh
status command is the minimum acceptable check.
