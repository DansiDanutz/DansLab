"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu, X, Home } from "lucide-react";
import { useState } from "react";
import { docNavigation } from "@/lib/docs-data";
import { motion, AnimatePresence } from "framer-motion";

interface NavItemProps {
  item: {
    id: string;
    title: string;
    description?: string;
    icon?: string;
    path: string;
    children?: { title: string; path: string }[];
  };
  depth?: number;
  delay?: number;
}

function NavItem({ item, depth = 0, delay = 0 }: NavItemProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
  const hasChildren = item.children && item.children.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className={depth > 0 ? "ml-4" : ""}
    >
      <div className="flex items-center">
        {hasChildren ? (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`group flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
              isActive
                ? "bg-zinc-800/80 text-zinc-100 shadow-lg shadow-zinc-900/50"
                : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
            }`}
          >
            {item.icon && (
              <motion.span
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="text-base"
              >
                {item.icon}
              </motion.span>
            )}
            <span className="flex-1 text-left">{item.title}</span>
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="ml-auto"
            >
              <ChevronRight size={14} className="text-zinc-500" />
            </motion.div>
          </button>
        ) : (
          <Link
            href={item.path}
            className={`group relative flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
              isActive
                ? "bg-zinc-800/80 text-zinc-100 shadow-lg shadow-zinc-900/50"
                : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
            }`}
          >
            {item.icon && (
              <motion.span
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="text-base"
              >
                {item.icon}
              </motion.span>
            )}
            <span>{item.title}</span>
            {isActive && (
              <motion.span
                layoutId="activeIndicator"
                className="ml-auto h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Link>
        )}
      </div>

      <AnimatePresence>
        {hasChildren && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-1">
              {item.children?.map((child, index) => (
                <motion.div
                  key={child.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Link
                    href={child.path}
                    className={`block rounded-lg px-3 py-1.5 text-xs transition-all duration-200 ${
                      pathname === child.path
                        ? "bg-zinc-800/50 text-zinc-100 font-medium"
                        : "text-zinc-500 hover:bg-zinc-900/30 hover:text-zinc-300"
                    }`}
                  >
                    {child.title}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function DocNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden h-full flex-col lg:flex">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b border-zinc-800/50 px-4 py-4"
        >
          <Link
            href="/docs"
            className="text-lg font-semibold text-zinc-100 hover:text-zinc-200 transition-colors"
          >
            Documentation
          </Link>
        </motion.div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {docNavigation.map((item, index) => (
              <NavItem key={item.id} item={item} delay={index * 0.05} />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border-t border-zinc-800/50 px-4 py-3"
        >
          <a
            href="https://danslab.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-zinc-500 transition-colors hover:text-zinc-400"
          >
            <span>🌐</span>
            <span>Back to Dashboard</span>
          </a>
        </motion.div>
      </nav>

      {/* Mobile Menu Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80 text-zinc-400 backdrop-blur-sm hover:bg-zinc-900 transition-colors"
      >
        <Menu size={18} />
      </motion.button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-50 h-full w-80 border-l border-zinc-800 bg-zinc-950/95 backdrop-blur-xl"
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-800/50 px-4 py-4">
                  <span className="text-lg font-semibold text-zinc-100">
                    Documentation
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-900/50 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto px-3 py-4">
                  <div className="space-y-1">
                    {docNavigation.map((item) => (
                      <NavItem key={item.id} item={item} delay={0} />
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-zinc-800/50 px-4 py-3">
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-xs text-zinc-500 transition-colors hover:text-zinc-400"
                  >
                    <Home size={14} />
                    <span>Back to Home</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
