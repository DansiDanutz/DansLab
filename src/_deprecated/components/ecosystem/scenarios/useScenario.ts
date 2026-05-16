"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { scenarios, type Scenario } from "./scenarioData";

interface ScenarioState {
  activeScenario: Scenario | null;
  stepIndex: number;
  isPlaying: boolean;
  activeAgents: Set<string>;
  activeConnections: Set<string>;
  narration: string;
}

export function useScenario() {
  const [state, setState] = useState<ScenarioState>({
    activeScenario: null,
    stepIndex: 0,
    isPlaying: false,
    activeAgents: new Set(),
    activeConnections: new Set(),
    narration: "",
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    clearTimer();
    setState({
      activeScenario: null,
      stepIndex: 0,
      isPlaying: false,
      activeAgents: new Set(),
      activeConnections: new Set(),
      narration: "",
    });
  }, [clearTimer]);

  const advanceStep = useCallback(
    (scenario: Scenario, currentStep: number) => {
      if (currentStep >= scenario.steps.length) {
        // Scenario complete — hold last frame for a moment then reset
        timerRef.current = setTimeout(() => {
          stop();
        }, 1500);
        return;
      }

      const step = scenario.steps[currentStep];
      setState({
        activeScenario: scenario,
        stepIndex: currentStep,
        isPlaying: true,
        activeAgents: new Set(step.activeAgents),
        activeConnections: new Set(step.activeConnections),
        narration: step.narration,
      });

      timerRef.current = setTimeout(() => {
        advanceStep(scenario, currentStep + 1);
      }, step.duration);
    },
    [stop]
  );

  const play = useCallback(
    (scenarioId: string) => {
      clearTimer();
      const scenario = scenarios.find((s) => s.id === scenarioId);
      if (!scenario) return;
      advanceStep(scenario, 0);
    },
    [clearTimer, advanceStep]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return { ...state, play, stop, scenarios };
}
