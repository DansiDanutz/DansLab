import { ReactNode } from "react";

interface DocHeroProps {
  title: string;
  description?: string;
  badge?: string;
  icon?: string;
}

export function DocHero({ title, description, badge, icon }: DocHeroProps) {
  return (
    <div className="mb-8">
      {badge && (
        <span className="mb-4 inline-block rounded-full border border-zinc-700 bg-zinc-900/50 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-zinc-400">
          {badge}
        </span>
      )}

      <div className="flex items-center gap-3">
        {icon && <span className="text-3xl">{icon}</span>}
        <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
          {title}
        </h1>
      </div>

      {description && (
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
          {description}
        </p>
      )}
    </div>
  );
}

interface GradientTextProps {
  children: ReactNode;
  from?: string;
  via?: string;
  to?: string;
}

export function GradientText({
  children,
  from = "from-blue-400",
  via = "via-cyan-300",
  to = "to-orange-300",
}: GradientTextProps) {
  return (
    <span
      className={`bg-gradient-to-r ${from} ${via} ${to} bg-clip-text text-transparent`}
    >
      {children}
    </span>
  );
}
