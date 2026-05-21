import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Lab — DansLab",
  description:
    "The workshop. Seven benches (Foundry / Product Line / Trading Desk / Automation Rig / War Room / Kiln / Mission Control), 10 builds in flight, 9-step recipe, 8 live instruments, 8-person team dossier, 4 live ships.",
};

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
