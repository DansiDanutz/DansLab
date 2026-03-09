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

## License

MIT
