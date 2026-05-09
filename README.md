# DansLab Dashboard

A modern team management dashboard built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Beautiful, accessible component library
- **Lucide Icons** - Modern icon set

## Getting Started

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Deployment

This project is deployed on Vercel: [danslab.vercel.app](https://danslab.vercel.app)

## Project Structure

```
DansLab/
├── src/
│   ├── app/           # Next.js app directory
│   ├── components/    # shadcn/ui components
│   └── lib/           # Utility functions
├── public/            # Static assets
└── components.json    # shadcn/ui configuration
```

## Adding shadcn/ui Components

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
# ... add more components as needed
```

## Hyperframes (Claude Code skills)

[Hyperframes](https://github.com/heygen-com/hyperframes) is an open-source toolkit
that teaches your coding agent (Claude Code, Cursor, Gemini CLI, Codex) how to
author HTML compositions, GSAP timelines, and Tailwind v4 browser-runtime styles
that render to video.

It is installed per-developer as a set of Claude Code **skills** — it is not a
runtime dependency of this project, so it is not added to `dependencies`.

### Install

```bash
npm run hyperframes:install
# equivalent to: npx skills add heygen-com/hyperframes
```

### Available slash commands (after install)

Inside a Claude Code session you can invoke:

- `/hyperframes` — main composition workflow
- `/hyperframes-cli` — CLI helpers
- `/hyperframes-registry` — registry operations
- `/tailwind` — Tailwind v4 browser-runtime styles
- `/gsap` — GSAP timeline authoring

See the [HyperFrames Claude Design guide](https://hyperframes.mintlify.app/guides/claude-design)
for usage details.

## License

MIT
