import { DocNavigation } from "@/components/docs/DocNavigation";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="relative min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at 50% 35%, #0c1222 0%, #050a14 52%, #000000 100%)",
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #3b82f6 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          animation: "gridDrift 20s linear infinite",
        }}
      />

      <div className="relative flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden w-64 flex-shrink-0 border-r border-zinc-800/50 bg-zinc-950/30 backdrop-blur-sm lg:block">
          <DocNavigation />
        </aside>

        {/* Main content */}
        <div className="flex-1">
          <div className="mx-auto max-w-4xl px-6 py-8 sm:px-8 lg:max-w-5xl">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
