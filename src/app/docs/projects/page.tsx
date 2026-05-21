import { DocHero } from "@/components/docs/DocHero";
import { DocCard, DocCardGrid } from "@/components/docs/DocCard";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    id: "danslab",
    name: "DansLab",
    description: "Architecture visualization and system map - explains the lab, ecosystem, and team topology.",
    url: "https://danslab.vercel.app",
    type: "Architecture",
    tech: ["Next.js", "TypeScript", "Tailwind", "Framer Motion"],
    status: "Live",
  },
  {
    id: "crawdbot",
    name: "CrawdBot",
    description: "Autonomous agent workspace - monitored execution, security boundaries, telemetry, and reporting.",
    type: "Operations",
    tech: ["Python", "Supabase", "Next.js", "psutil"],
    status: "Active",
  },
  {
    id: "nervix",
    name: "Nervix",
    description: "Agent orchestration platform - where specialized agents are enrolled, coordinated, and monetized.",
    url: "https://nervix.ai",
    type: "Platform",
    tech: ["Platform", "Orchestration", "Agent Management"],
    status: "Core",
  },
  {
    id: "mywork-ai",
    name: "MyWork-ai",
    description: "Framework and AI development platform - templates, generation, review, and deployment commands.",
    type: "Framework",
    tech: ["Next.js", "AI Tools", "Workflow Automation"],
    status: "Development",
  },
  {
    id: "marketplace",
    name: "Marketplace",
    description: "Monetization platform - listings, search, payments, reviews, and subscriptions with platform fees.",
    type: "Business",
    tech: ["Next.js", "FastAPI", "Stripe Connect", "Supabase"],
    status: "Designed",
  },
  {
    id: "the-brain",
    name: "The Brain Platform",
    description: "Installable module platform with 10% commission model - instant-deploy modules for subscribers.",
    type: "Business",
    tech: ["Platform", "Module System", "Revenue Sharing"],
    status: "Vision",
  },
];

export default function ProjectsPage() {
  return (
    <div>
      <DocHero
        title="Projects & Repositories"
        description="The complete DansLab ecosystem - from architecture visualization to autonomous agents and revenue platforms."
        badge="Ecosystem"
        icon="📦"
      />

      {/* Overview */}
      <section className="mb-10">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/65 p-6 backdrop-blur-xl">
          <p className="text-base leading-7 text-zinc-400">
            The DansLab workspace spans multiple repositories, each serving a
            specific purpose in the AI-first company architecture. Some are
            fully implemented, some are in development, and some represent the
            future-state vision.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-zinc-100">
          All Projects
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl border border-zinc-800 bg-zinc-950/65 p-6 backdrop-blur-xl transition-all hover:border-zinc-700 hover:bg-zinc-950/75"
            >
              {/* Header */}
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-zinc-100">
                      {project.name}
                    </h3>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] ${
                        project.status === "Live"
                          ? "border-emerald-700 bg-emerald-950/50 text-emerald-400"
                          : project.status === "Active"
                          ? "border-blue-700 bg-blue-950/50 text-blue-400"
                          : "border-zinc-700 bg-zinc-900/50 text-zinc-500"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">{project.type}</p>
                </div>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/50 text-zinc-500 transition-colors hover:border-zinc-600 hover:text-zinc-300"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>

              {/* Description */}
              <p className="mb-4 text-sm leading-6 text-zinc-400">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-zinc-800 bg-zinc-900/50 px-2 py-0.5 text-[10px] text-zinc-500"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Repository Categories */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">
          Repository Types
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-4">
            <span className="mb-2 block text-2xl">🗺️</span>
            <h3 className="text-sm font-semibold text-zinc-100">Architecture</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Visual representation of company structure
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-4">
            <span className="mb-2 block text-2xl">⚙️</span>
            <h3 className="text-sm font-semibold text-zinc-100">Operations</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Autonomous agents and monitoring
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-4">
            <span className="mb-2 block text-2xl">🛠️</span>
            <h3 className="text-sm font-semibold text-zinc-100">Framework</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Development tools and workflows
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-4">
            <span className="mb-2 block text-2xl">💰</span>
            <h3 className="text-sm font-semibold text-zinc-100">Business</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Revenue and monetization platforms
            </p>
          </div>
        </div>
      </section>

      {/* Implementation Status */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">
          Implementation Status
        </h2>
        <div className="space-y-3">
          <div className="rounded-xl border border-emerald-900/30 bg-emerald-950/20 p-4">
            <div className="mb-1 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-sm font-semibold text-zinc-100">Fully Implemented</span>
            </div>
            <p className="text-xs text-zinc-500">
              DansLab (architecture), CrawdBot (autonomous operations)
            </p>
          </div>
          <div className="rounded-xl border border-blue-900/30 bg-blue-950/20 p-4">
            <div className="mb-1 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-blue-400" />
              <span className="text-sm font-semibold text-zinc-100">In Development</span>
            </div>
            <p className="text-xs text-zinc-500">
              MyWork-ai framework, Nervix platform
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
            <div className="mb-1 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-zinc-500" />
              <span className="text-sm font-semibold text-zinc-100">Architectural Vision</span>
            </div>
            <p className="text-xs text-zinc-500">
              Marketplace, The Brain Platform - documented as design targets
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
