"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface DocCardProps {
  title: string;
  description: string;
  icon?: string;
  href: string;
  external?: boolean;
  badge?: string;
  children?: ReactNode;
  delay?: number;
  gradient?: string;
}

export function DocCard({
  title,
  description,
  icon,
  href,
  external = false,
  badge,
  children,
  delay = 0,
  gradient = "from-blue-400 via-cyan-400 to-purple-400",
}: DocCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  const content = (
    <>
      {/* Icon */}
      {icon && (
        <motion.span
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="mb-3 block text-3xl"
        >
          {icon}
        </motion.span>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-white transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-2 text-sm leading-6 text-zinc-400 group-hover:text-zinc-300 transition-colors">
        {description}
      </p>

      {/* Children */}
      {children && <div className="mt-4">{children}</div>}

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        {/* Badge */}
        {badge && (
          <span className="inline-block rounded-full border border-zinc-700 bg-zinc-900/50 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            {badge}
          </span>
        )}

        {/* Arrow */}
        {external ? (
          <ExternalLink
            size={16}
            className="flex-shrink-0 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-1 transition-all"
          />
        ) : (
          <ArrowRight
            size={16}
            className="flex-shrink-0 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-1 transition-all"
          />
        )}
      </div>

      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
        initial={false}
      />
    </>
  );

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4 }}
      className="group relative"
    >
      {/* Glow Effect */}
      <motion.div
        className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-20 blur transition-opacity duration-500 rounded-2xl"
        style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops)))` }}
      />

      {/* Card */}
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/65 p-5 shadow-[0_0_40px_rgba(59,130,246,0.06)] backdrop-blur-xl transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-950/75 hover:shadow-[0_0_60px_rgba(59,130,246,0.15)]"
        >
          {content}
        </a>
      ) : (
        <Link
          href={href}
          className="relative block overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/65 p-5 shadow-[0_0_40px_rgba(59,130,246,0.06)] backdrop-blur-xl transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-950/75 hover:shadow-[0_0_60px_rgba(59,130,246,0.15)]"
        >
          {content}
        </Link>
      )}
    </motion.div>
  );
}

interface DocCardGridProps {
  children: ReactNode;
}

export function DocCardGrid({ children }: DocCardGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  );
}
