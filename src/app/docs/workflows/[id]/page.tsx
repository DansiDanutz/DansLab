"use client";

import { notFound } from "next/navigation";
import { useState, useEffect, use } from "react";
import { DocHero } from "@/components/docs/DocHero";
import { scenarios } from "@/components/ecosystem/scenarios/scenarioData";
import { agentMap } from "@/components/ecosystem/data/agents";
import Link from "next/link";
import { ArrowLeft, Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { getScenarioAgents } from "@/lib/docs-data";

export default function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Unwrap params promise
  const resolvedParams = use(params);
  const scenario = scenarios.find((s) => s.id === resolvedParams.id);

  if (!scenario) {
    notFound();
  }

  const step = scenario.steps[currentStep];
  const participatingAgents = getScenarioAgents(scenario.id);

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentStep < scenario.steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsPlaying(false);
      }
    }, step.duration);

    return () => clearTimeout(timer);
  }, [currentStep, isPlaying, step.duration, scenario.steps.length]);

  const handleNext = () => {
    if (currentStep < scenario.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return (
    <div>
      {/* Back Button */}
      <Link
        href="/docs/workflows"
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-200"
      >
        <ArrowLeft size={16} />
        <span>Back to Workflows</span>
      </Link>

      {/* Header */}
      <DocHero
        title={scenario.name}
        description={scenario.description}
        icon={scenario.icon}
      />

      {/* Workflow Visualization */}
      <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950/65 p-6 backdrop-blur-xl">
        {/* Step Progress */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-zinc-400">
              Step {currentStep + 1} of {scenario.steps.length}
            </span>
            <span className="text-xs text-zinc-500">
              {Math.round((step.duration / 1000) * 10) / 10}s
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / scenario.steps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Narration */}
        <div className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-base leading-7 text-zinc-300">{step.narration}</p>
        </div>

        {/* Active Agents */}
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold text-zinc-100">
            Active Agents
          </h3>
          <div className="flex flex-wrap gap-2">
            {step.activeAgents.map((agentId) => {
              const agent = agentMap.get(agentId);
              if (!agent) return null;

              const isActive = step.activeAgents.includes(agent.id);

              return (
                <Link
                  key={agent.id}
                  href={`/docs/agents/${agent.id}`}
                  className="group"
                >
                  <div
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 pr-4 transition-all ${
                      isActive
                        ? "scale-105 border-zinc-600 bg-zinc-800 shadow-lg"
                        : "border-zinc-800 bg-zinc-900/50 opacity-60"
                    }`}
                    style={{
                      borderColor: isActive ? agent.color : undefined,
                      boxShadow: isActive ? `0 0 20px ${agent.glow}` : undefined,
                    }}
                  >
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold"
                      style={{
                        backgroundColor: agent.color,
                        color: agent.type === "main" ? "#000" : "#fff",
                      }}
                    >
                      {agent.initials}
                    </div>
                    <span className="text-xs font-medium text-zinc-200">
                      {agent.name}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Active Connections */}
        {step.activeConnections.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-zinc-100">
              Active Connections
            </h3>
            <div className="flex flex-wrap gap-2">
              {step.activeConnections.map((connId) => {
                // This would show connection details if needed
                return (
                  <span
                    key={connId}
                    className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-400"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    {connId}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/50 text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-200 disabled:opacity-30 disabled:hover:border-zinc-700 disabled:hover:text-zinc-400"
            >
              <SkipBack size={16} />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/50 text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-200"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep === scenario.steps.length - 1}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/50 text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-200 disabled:opacity-30 disabled:hover:border-zinc-700 disabled:hover:text-zinc-400"
            >
              <SkipForward size={16} />
            </button>
          </div>

          <button
            onClick={handleReset}
            className="rounded-full border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-xs text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-200"
          >
            Reset
          </button>
        </div>
      </div>

      {/* All Participants */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">
          All Participants
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {participatingAgents.map((agent) => {
            if (!agent) return null;
            return (
              <Link
                key={agent.id}
                href={`/docs/agents/${agent.id}`}
                className="group rounded-xl border border-zinc-800 bg-zinc-950/65 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-950/75"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold shadow-lg"
                    style={{
                      backgroundColor: agent.color,
                      color: agent.type === "main" ? "#000" : "#fff",
                    }}
                  >
                    {agent.initials}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-200">
                      {agent.name}
                    </p>
                    <p className="text-xs text-zinc-500">{agent.role}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
