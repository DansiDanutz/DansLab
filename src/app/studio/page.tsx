"use client";

import { useState, useEffect } from "react";
import PageWrapper from "@/components/PageWrapper";
import {
  Play,
  Pause,
  Film,
  Settings,
  Activity,
  CheckCircle2,
  Clock,
  AlertCircle,
  Video,
  Wand2,
  Sparkles,
  RefreshCw,
} from "lucide-react";

interface PipelineStatus {
  healthy: boolean;
  engines: Record<string, boolean>;
  lastRun: string | null;
  queueLength: number;
}

interface VideoProject {
  id: string;
  title: string;
  status: "idle" | "running" | "completed" | "failed";
  progress: number;
  createdAt: string;
  engine: string;
}

const MOCK_PROJECTS: VideoProject[] = [
  {
    id: "proj-001",
    title: "Meet the Team — DansLab Intro",
    status: "completed",
    progress: 100,
    createdAt: "2026-05-16",
    engine: "HyperFrames",
  },
  {
    id: "proj-002",
    title: "Crypto Daily News — May 16",
    status: "running",
    progress: 62,
    createdAt: "2026-05-16",
    engine: "HyperFrames",
  },
];

const PIPELINE_STEPS = [
  { id: 1, name: "Research", desc: "Topic discovery & source aggregation" },
  { id: 2, name: "Script", desc: "Narration draft & polish" },
  { id: 3, name: "Visual Design", desc: "Design brief & asset generation" },
  { id: 4, name: "Scenes", desc: "Scene manifest & composition" },
  { id: 5, name: "Audio", desc: "TTS narration & music" },
  { id: 6, name: "Subtitles", desc: "Caption generation & sync" },
  { id: 7, name: "Render", desc: "Dual-track HF + Remotion" },
  { id: 8, name: "QA", desc: "Technical validation" },
  { id: 9, name: "Final", desc: "Assembly & delivery" },
  { id: 10, name: "Addons", desc: "Thumbnails, tags, upload" },
];

export default function StudioPage() {
  const [status, setStatus] = useState<PipelineStatus>({
    healthy: true,
    engines: {
      HyperFrames: true,
      ComfyUI: true,
      Remotion: false,
      Kokoro: true,
    },
    lastRun: "2026-05-16T02:15:00Z",
    queueLength: 1,
  });

  const [projects, setProjects] = useState<VideoProject[]>(MOCK_PROJECTS);
  const [activeTab, setActiveTab] = useState<"projects" | "pipeline" | "config">("projects");

  useEffect(() => {
    const interval = setInterval(() => {
      setProjects((prev) =>
        prev.map((p) =>
          p.status === "running"
            ? { ...p, progress: Math.min(p.progress + 2, 100) }
            : p
        )
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const runPipeline = async () => {
    const newProject: VideoProject = {
      id: `proj-${Date.now()}`,
      title: `New Video — ${new Date().toLocaleDateString()}`,
      status: "running",
      progress: 0,
      createdAt: new Date().toISOString().split("T")[0],
      engine: "HyperFrames",
    };
    setProjects((prev) => [newProject, ...prev]);
  };

  return (
    <PageWrapper>
      {/* Header */}
      <section className="pb-8 pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#c0392b]/25 bg-[#c0392b]/10 px-3 py-1 text-xs text-[#e74c3c]">
              <Sparkles size={12} />
              AI Video Production
            </div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              DansLab Studio
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              10-step autonomous video pipeline — research to render
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400">
              <Activity size={12} className="animate-pulse" />
              Pipeline Online
            </div>
            <button
              onClick={runPipeline}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Play size={14} />
              New Video
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {[
          { label: "Videos Rendered", value: "12", icon: Film },
          { label: "This Month", value: "4", icon: Video },
          { label: "Avg Duration", value: "2m 14s", icon: Clock },
          { label: "Success Rate", value: "92%", icon: CheckCircle2 },
        ].map((stat) => (
          <div key={stat.label} className="card-base p-4">
            <div className="mb-2 flex items-center gap-2 text-zinc-500">
              <stat.icon size={14} />
              <span className="text-xs">{stat.label}</span>
            </div>
            <div className="text-xl font-bold text-white sm:text-2xl">
              {stat.value}
            </div>
          </div>
        ))}
      </section>

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-1 border-b border-[#c0392b]/10">
        {[
          { id: "projects" as const, label: "Projects", icon: Film },
          { id: "pipeline" as const, label: "Pipeline", icon: Wand2 },
          { id: "config" as const, label: "Config", icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === tab.id
                ? "border-[#c0392b] text-[#e74c3c]"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projects Tab */}
      {activeTab === "projects" && (
        <section className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="card-base flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    project.status === "completed"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : project.status === "running"
                      ? "bg-[#c0392b]/10 text-[#e74c3c]"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {project.status === "completed" ? (
                    <CheckCircle2 size={20} />
                  ) : project.status === "running" ? (
                    <RefreshCw size={20} className="animate-spin" />
                  ) : (
                    <Pause size={20} />
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {project.title}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span>{project.createdAt}</span>
                    <span>·</span>
                    <span>{project.engine}</span>
                    {project.status === "running" && (
                      <>
                        <span>·</span>
                        <span className="text-[#e74c3c]">
                          {project.progress}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {project.status === "running" && (
                <div className="w-full sm:w-48">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-[#c0392b] transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              )}
              {project.status === "completed" && (
                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#c0392b]/20 bg-[#c0392b]/10 px-3 py-1.5 text-xs font-medium text-[#e74c3c] transition hover:bg-[#c0392b]/20"
                >
                  <Play size={12} />
                  Preview
                </a>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Pipeline Tab */}
      {activeTab === "pipeline" && (
        <section>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(status.engines).map(([name, healthy]) => (
              <div
                key={name}
                className={`card-base p-4 ${
                  healthy ? "border-emerald-500/20" : "border-amber-500/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{name}</span>
                  {healthy ? (
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  ) : (
                    <AlertCircle size={16} className="text-amber-400" />
                  )}
                </div>
                <div className="mt-1 text-xs text-zinc-500">
                  {healthy ? "Operational" : "Unavailable"}
                </div>
              </div>
            ))}
          </div>

          <div className="card-base p-6">
            <h3 className="mb-4 text-sm font-semibold text-white">
              10-Step Pipeline
            </h3>
            <div className="space-y-3">
              {PIPELINE_STEPS.map((step) => (
                <div
                  key={step.id}
                  className="flex items-center gap-4 rounded-lg bg-zinc-900/50 p-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#c0392b]/10 text-xs font-bold text-[#e74c3c]">
                    {step.id}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">
                      {step.name}
                    </div>
                    <div className="text-xs text-zinc-500">{step.desc}</div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    Ready
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Config Tab */}
      {activeTab === "config" && (
        <section className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Sources",
              desc: "RSS feeds, internal signals, manual topics",
              file: "config/sources.yaml",
            },
            {
              title: "Model Routing",
              desc: "LLM fallback chain & budget limits",
              file: "config/model_routing.yaml",
            },
            {
              title: "Prompts",
              desc: "System prompts for each pipeline stage",
              file: "config/prompts.yaml",
            },
            {
              title: "Channels",
              desc: "YouTube channel configuration",
              file: "config/channels.yaml",
            },
            {
              title: "ComfyUI Workflows",
              desc: "Image generation pipeline definitions",
              file: "config/comfyui_workflow.json",
            },
            {
              title: "Manual Topics",
              desc: "Override topics for forced coverage",
              file: "config/manual_topics.yaml",
            },
          ].map((cfg) => (
            <div key={cfg.title} className="card-base p-5">
              <div className="mb-2 text-sm font-semibold text-white">
                {cfg.title}
              </div>
              <div className="mb-3 text-xs text-zinc-500">{cfg.desc}</div>
              <div className="rounded-md bg-zinc-900/50 px-3 py-2 font-mono text-[10px] text-zinc-400">
                packages/video-pipeline/{cfg.file}
              </div>
            </div>
          ))}
        </section>
      )}
    </PageWrapper>
  );
}
