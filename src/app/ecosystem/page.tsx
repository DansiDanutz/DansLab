import type { Metadata } from "next";
import EcosystemCanvas from "@/components/ecosystem/EcosystemCanvas";

export const metadata: Metadata = {
  title: "DansLab Ecosystem — How It Works",
  description:
    "Interactive visualization of DansLab's expanded AI ecosystem — from Dan and David to the OpenClaw mesh, channels, infrastructure, and revenue systems.",
};

export default function EcosystemPage() {
  return <EcosystemCanvas />;
}
