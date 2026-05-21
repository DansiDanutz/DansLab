"use client";

import { useEffect, useRef } from "react";

// Animated starfield + comets canvas, fixed full-viewport, behind content.
// Performant: pauses when tab hidden, caps DPR at 2.
export function SpaceBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, DPR = 1;
    const stars: {
      x: number; y: number; r: number;
      baseA: number; phase: number; speed: number; color: string;
    }[] = [];
    const comets: {
      x: number; y: number; vx: number; vy: number;
      len: number; life: number; ttl: number; hue: string;
    }[] = [];
    let lastComet = 0;
    let last = 0;
    let raf: ReturnType<typeof setInterval> | null = null;

    const resize = () => {
      DPR = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      c.width = Math.floor(W * DPR);
      c.height = Math.floor(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    const seed = () => {
      stars.length = 0;
      const N = Math.min(280, Math.floor((W * H) / 6500));
      for (let i = 0; i < N; i++) {
        const tier = Math.random();
        const r = tier < 0.78 ? 0.4 + Math.random() * 0.5
                : tier < 0.96 ? 0.9 + Math.random() * 0.7
                :              1.6 + Math.random() * 0.9;
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r,
          baseA: 0.18 + Math.random() * 0.55,
          phase: Math.random() * Math.PI * 2,
          speed: 0.3 + Math.random() * 1.3,
          color: Math.random() < 0.92 ? "#ffffff"
               : Math.random() < 0.6 ? "#f4c15c"
               :                       "#e74c3c",
        });
      }
    };

    const spawnComet = () => {
      const fromTop = Math.random() < 0.75;
      let startX: number, startY: number, angle: number;
      if (fromTop) {
        startX = Math.random() * W * 1.2 - W * 0.1;
        startY = -30;
        angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
      } else {
        startX = -40;
        startY = Math.random() * H * 0.5;
        angle = 0.15 + Math.random() * 0.45;
      }
      const speed = 420 + Math.random() * 380;
      comets.push({
        x: startX, y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: 130 + Math.random() * 200,
        life: 0,
        ttl: 2.4 + Math.random() * 0.8,
        hue: Math.random() < 0.55 ? "244,193,92"
           : Math.random() < 0.65 ? "231,76,60"
           :                        "180,210,255",
      });
    };

    const frame = (t: number) => {
      if (!last) last = t;
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;

      ctx.clearRect(0, 0, W, H);

      // stars
      for (const s of stars) {
        s.phase += dt * s.speed;
        const a = Math.max(0.05, Math.min(1, s.baseA + Math.sin(s.phase) * 0.3));
        ctx.globalAlpha = a;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (s.r > 1.1) {
          ctx.globalAlpha = a * 0.18;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // comets
      lastComet += dt;
      const interval = 3.5 + Math.random() * 6;
      if (lastComet > interval && comets.length < 2) {
        spawnComet();
        lastComet = 0;
      }
      for (let i = comets.length - 1; i >= 0; i--) {
        const k = comets[i];
        k.life += dt;
        k.x += k.vx * dt;
        k.y += k.vy * dt;
        const speed = Math.hypot(k.vx, k.vy);
        const len = Math.min(k.len, k.life * speed * 0.6);
        const dx = k.vx / speed;
        const dy = k.vy / speed;
        const tx = k.x - dx * len;
        const ty = k.y - dy * len;
        let alpha = 1;
        if (k.life < 0.25) alpha = k.life / 0.25;
        else if (k.life > k.ttl - 0.6) alpha = Math.max(0, (k.ttl - k.life) / 0.6);
        const grad = ctx.createLinearGradient(k.x, k.y, tx, ty);
        grad.addColorStop(0, `rgba(${k.hue},${0.95 * alpha})`);
        grad.addColorStop(0.35, `rgba(${k.hue},${0.38 * alpha})`);
        grad.addColorStop(1, `rgba(${k.hue},0)`);
        ctx.strokeStyle = grad;
        ctx.lineCap = "round";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(k.x, k.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(k.x, k.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = alpha * 0.35;
        ctx.beginPath();
        ctx.arc(k.x, k.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        if (k.life >= k.ttl || k.x > W + 200 || k.y > H + 200 || k.x < -200) {
          comets.splice(i, 1);
        }
      }
    };

    const start = () => {
      if (raf) return;
      last = 0;
      raf = setInterval(() => frame(performance.now()), 1000 / 60);
    };
    const stop = () => {
      if (!raf) return;
      clearInterval(raf);
      raf = null;
    };

    resize();
    seed();
    start();

    const onResize = () => { resize(); seed(); };
    const onVis = () => { document.hidden ? stop() : start(); };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas id="dl-space" ref={ref} aria-hidden />;
}
