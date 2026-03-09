"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Square } from "lucide-react";
import type { Scenario } from "../scenarios/scenarioData";

interface ScenarioPanelProps {
  scenarios: Scenario[];
  activeScenario: Scenario | null;
  narration: string;
  isPlaying: boolean;
  onPlay: (id: string) => void;
  onStop: () => void;
}

export default function ScenarioPanel({
  scenarios,
  activeScenario,
  narration,
  isPlaying,
  onPlay,
  onStop,
}: ScenarioPanelProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      {/* Narration bar */}
      <AnimatePresence>
        {isPlaying && narration && (
          <motion.div
            className="mx-auto max-w-2xl mb-3 px-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
          >
            <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-700 rounded-xl px-5 py-3 text-center">
              <p className="text-sm text-zinc-200 font-medium">{narration}</p>
              {activeScenario && (
                <p className="text-xs text-zinc-500 mt-1">
                  {activeScenario.icon} {activeScenario.name}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scenario buttons */}
      <div className="bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-800 px-4 py-3">
        <div className="flex items-center justify-center gap-2 flex-wrap max-w-4xl mx-auto">
          <span className="text-xs text-zinc-600 mr-2 uppercase tracking-wider hidden sm:inline">
            Scenarios
          </span>
          {scenarios.map((scenario) => {
            const isActive = activeScenario?.id === scenario.id;
            return (
              <button
                key={scenario.id}
                onClick={() =>
                  isActive && isPlaying ? onStop() : onPlay(scenario.id)
                }
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                  transition-all duration-200 border
                  ${
                    isActive
                      ? "bg-zinc-800 border-zinc-600 text-zinc-100"
                      : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                  }
                `}
              >
                {isActive && isPlaying ? (
                  <Square size={10} className="fill-current" />
                ) : (
                  <Play size={10} className="fill-current" />
                )}
                <span>{scenario.icon}</span>
                <span className="hidden sm:inline">{scenario.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
