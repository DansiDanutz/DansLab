import type { Metadata } from "next";
import EcosystemCanvas from "@/components/ecosystem/EcosystemCanvas";

export const metadata: Metadata = {
  title: "DansLab Ecosystem — How It Works",
  description:
    "Interactive visualization of DansLab's AI agent ecosystem — see how 20+ agents work together to build, deploy, learn, and earn.",
};

export default function EcosystemPage() {
  return <EcosystemCanvas />;
}
