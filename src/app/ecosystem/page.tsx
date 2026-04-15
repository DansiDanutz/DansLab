import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import EcosystemCanvas from "@/components/ecosystem/EcosystemCanvas";

export const metadata: Metadata = {
  title: "DansLab Ecosystem — How It Works",
  description:
    "Interactive visualization of DansLab's expanded AI ecosystem — from Dan and David to the OpenClaw mesh, channels, infrastructure, and revenue systems.",
};

export default function EcosystemPage() {
  return (
    <div
      className="relative min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, #1a0a0a 0%, #0a0505 45%, #000000 100%)",
      }}
    >
      <div className="section-grid" />
      <div className="pointer-events-none absolute top-[10%] left-[30%] h-[400px] w-[400px] rounded-full bg-[#c0392b]/[0.06] blur-[150px]" />
      <div className="pointer-events-none absolute bottom-[20%] right-[20%] h-[300px] w-[300px] rounded-full bg-[#d4a017]/[0.05] blur-[120px]" />
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <div className="relative z-10 -mt-12">
        <EcosystemCanvas />
      </div>
      <footer className="relative z-20 border-t border-[#c0392b]/10 py-6 text-center">
        <p className="text-xs text-zinc-600">
          Built by Dan &middot; Powered by{" "}
          <span className="text-[#c0392b]">OpenClaw</span> &middot;
          Orchestrated by David
        </p>
      </footer>
    </div>
  );
}
