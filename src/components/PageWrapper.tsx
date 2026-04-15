import Navbar from "./Navbar";

interface PageWrapperProps {
  children: React.ReactNode;
  showGrid?: boolean;
}

export default function PageWrapper({
  children,
  showGrid = true,
}: PageWrapperProps) {
  return (
    <div
      className="relative min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, #1a0a0a 0%, #0a0505 45%, #000000 100%)",
      }}
    >
      {/* Grid background */}
      {showGrid && <div className="section-grid" />}

      {/* Glow orbs */}
      <div className="pointer-events-none absolute top-[10%] left-[30%] h-[400px] w-[400px] rounded-full bg-[#c0392b]/[0.06] blur-[150px]" />
      <div className="pointer-events-none absolute bottom-[20%] right-[20%] h-[300px] w-[300px] rounded-full bg-[#d4a017]/[0.05] blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Navbar />
        {children}
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#c0392b]/10 py-8 text-center">
        <p className="text-xs text-zinc-600">
          Built by Dan &middot; Powered by{" "}
          <span className="text-[#c0392b]">OpenClaw</span> &middot;
          Orchestrated by David
        </p>
      </footer>
    </div>
  );
}
