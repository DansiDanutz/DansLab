"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SectionLabel } from "@/components/danslab/atoms";
import { AGENT_MAP, CONNECTIONS, SCENARIOS, TIERS } from "./data";
import { AgentCard, EcoEdges, EcoNode, Legend, ScenarioList, type ScenarioState } from "./components";
import { computeLayout } from "./map-layout";

const STEP_MS = 2800;
const LAST_STEP_HOLD_MS = 3200;
// One scenario plays by itself if the visitor has not touched the map yet.
const AUTOPLAY_DELAY_MS = 9000;

const EMPTY_STATE: ScenarioState = { playing: false, id: null, step: 0, line: "", agents: new Set(), conns: new Set() };

function useScenarioPlayer() {
  const [state, setState] = useState<ScenarioState>(EMPTY_STATE);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    setState(EMPTY_STATE);
  }, []);

  const play = useCallback((id: string) => {
    const sc = SCENARIOS.find((s) => s.id === id);
    if (!sc) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    const runStep = (i: number) => {
      const step = sc.steps[i];
      setState({ playing: true, id, step: i, line: step.line, agents: new Set(step.agents), conns: new Set(step.conns) });
      const last = i === sc.steps.length - 1;
      timerRef.current = setTimeout(() => (last ? stop() : runStep(i + 1)), last ? LAST_STEP_HOLD_MS : STEP_MS);
    };
    runStep(0);
  }, [stop]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);
  return { state, play, stop };
}

function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, width };
}

export default function EcosystemPage() {
  const { ref: mapRef, width } = useElementWidth<HTMLDivElement>();
  const { state: scenario, play, stop } = useScenarioPlayer();
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const touchedRef = useRef(false);

  const layout = useMemo(() => (width > 0 ? computeLayout(TIERS, width) : null), [width]);

  useEffect(() => {
    if (touchedRef.current || scenario.playing || selected) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const t = setTimeout(() => {
      if (!touchedRef.current && !document.hidden) play(SCENARIOS[0].id);
    }, AUTOPLAY_DELAY_MS);
    return () => clearTimeout(t);
  }, [scenario.playing, selected, play]);

  const select = (id: string) => {
    touchedRef.current = true;
    if (scenario.playing) stop();
    setSelected((cur) => (cur === id ? null : id));
  };
  const playScenario = (id: string) => {
    touchedRef.current = true;
    setSelected(null);
    play(id);
  };

  const focusId = hovered ?? selected;
  const { litEdges, litNodes } = useMemo(() => {
    if (scenario.playing) return { litEdges: scenario.conns, litNodes: scenario.agents };
    if (!focusId) return { litEdges: new Set<string>(), litNodes: new Set<string>() };
    const edges = CONNECTIONS.filter((c) => c.from === focusId || c.to === focusId);
    return {
      litEdges: new Set(edges.map((c) => c.id)),
      litNodes: new Set(edges.flatMap((c) => [c.from, c.to])),
    };
  }, [scenario, focusId]);
  const focusing = scenario.playing || !!focusId;

  const nodeState = (id: string) => {
    if (!focusing) return "idle" as const;
    if (id === focusId || (scenario.playing && litNodes.has(id))) return "focus" as const;
    return litNodes.has(id) ? ("linked" as const) : ("dim" as const);
  };

  const nodeCount = TIERS.reduce((n, t) => n + t.nodes.length, 0);

  return (
    <article className="eco-page">
      <header className="eco-hero">
        <SectionLabel n={2} title="ECOSYSTEM // HOW THE LAB IS WIRED" />
        <h1 className="eco-title">
          One human, {nodeCount - 1} machines,<br />
          <em>{CONNECTIONS.length} working relationships.</em>
        </h1>
        <p className="eco-dek">
          Every agent, channel and service in DansLab, from Dan&rsquo;s Telegram down to the infrastructure that ships code
          and takes payments. Hover or tap any node to trace who it talks to, or play a workflow to watch work move through the fleet.
        </p>
        <dl className="eco-stats">
          <div><dt>Nodes</dt><dd>{nodeCount}</dd></div>
          <div><dt>Connections</dt><dd>{CONNECTIONS.length}</dd></div>
          <div><dt>Tiers</dt><dd>{TIERS.length}</dd></div>
          <div><dt>Workflows</dt><dd>{SCENARIOS.length}</dd></div>
        </dl>
      </header>

      <div className="eco-body">
        <section className="eco-map-card" aria-label="Ecosystem map">
          <div className="eco-map-toolbar">
            <Legend />
            <span className="eco-map-hint">{focusing ? (scenario.playing ? "Playing workflow" : "Tracing connections") : "Hover or tap a node"}</span>
          </div>
          <div className="eco-map" ref={mapRef} style={{ height: layout?.height ?? 900 }}>
            {layout && (
              <>
                {layout.tiers.map((t, i) => (
                  <div key={t.id} className="eco-tier" style={{ top: t.top, height: t.height }}>
                    <span className="eco-tier-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="eco-tier-label">{t.label}</span>
                    <span className="eco-tier-caption">{t.caption}</span>
                  </div>
                ))}
                <EcoEdges width={layout.width} height={layout.height} nodes={layout.nodes} lit={litEdges} dimOthers={focusing} />
                {TIERS.flatMap((t) => t.nodes).map((id) => {
                  const agent = AGENT_MAP.get(id);
                  const at = layout.nodes[id];
                  if (!agent || !at) return null;
                  return <EcoNode key={id} agent={agent} at={at} state={nodeState(id)} onSelect={select} onHover={setHovered} />;
                })}
              </>
            )}
          </div>
        </section>

        <aside className="eco-rail">
          {selected && <AgentCard id={selected} onClose={() => setSelected(null)} />}
          <ScenarioList state={scenario} play={playScenario} stop={stop} />
        </aside>
      </div>
    </article>
  );
}
