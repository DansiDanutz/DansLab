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

    // "Avatar star": every AV_PERIOD one star flies to the hero's right side,
    // morphs into Dan's avatar, holds, then fades back into the field.
    const AV_PERIOD = 60;      // s between appearances
    const AV_FIRST_DELAY = 5;  // s before the first one
    const AV_FLY = 1.6, AV_MORPH = 0.8, AV_HOLD = 4.2, AV_FADE = 0.9;
    const AV_SIZE = 120;       // avatar diameter px
    const avatarImg = new Image();
    avatarImg.src = "/avatars/dan.jpg";
    let avatarReady = false;
    avatarImg.onload = () => { avatarReady = true; };
    let avClock = AV_PERIOD - AV_FIRST_DELAY;
    const av = { active: false, t: 0, sx: 0, sy: 0, tx: 0, ty: 0, star: -1 };
    // morph burst particles: swirl out from the star, settle on the ring
    const avParts: { a: number; sp: number; rr: number; sz: number; gold: boolean }[] = [];
    const seedParts = () => {
      avParts.length = 0;
      for (let i = 0; i < 42; i++) {
        avParts.push({
          a: Math.random() * Math.PI * 2,        // start angle
          sp: 2.2 + Math.random() * 3.4,         // swirl speed
          rr: 0.55 + Math.random() * 0.75,       // final radius vs ring
          sz: 0.7 + Math.random() * 1.5,
          gold: Math.random() < 0.7,
        });
      }
    };

    const easeInOut = (p: number) => p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

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
      for (let si = 0; si < stars.length; si++) {
        if (av.active && si === av.star) continue; // borrowed by the avatar sequence
        const s = stars[si];
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

      // avatar star sequence
      avClock += dt;
      if (!av.active && avatarReady && avClock >= AV_PERIOD && window.scrollY < H * 0.8) {
        avClock = 0;
        // borrow a star from the left/center so the flight reads
        let pick = -1;
        for (let i = 0; i < stars.length; i++) {
          if (stars[i].x < W * 0.55 && stars[i].y < H * 0.7 && (pick < 0 || stars[i].r > stars[pick].r)) pick = i;
        }
        if (pick >= 0) {
          av.active = true; av.t = 0; av.star = pick;
          av.sx = stars[pick].x; av.sy = stars[pick].y;
          // land in open space on the right: below the hero terminal card if
          // it's in view, otherwise upper-right of the viewport
          av.tx = W * 0.82; av.ty = H * 0.24;
          const term = document.querySelector(".dl-terminal");
          if (term) {
            const r = term.getBoundingClientRect();
            if (r.left < W * 0.5) {
              // stacked layout (terminal below the copy): empty sky right of the headline
              av.tx = W * 0.8;
              av.ty = Math.min(H * 0.28, Math.max(AV_SIZE, r.top * 0.4));
            } else if (r.bottom > 0 && r.top < H) {
              const below = H - r.bottom;
              if (below > AV_SIZE * 2.2) { av.tx = r.left + r.width * 0.55; av.ty = r.bottom + Math.min(below * 0.45, 110); }
              else { av.tx = Math.max(AV_SIZE, r.left - AV_SIZE * 0.9); av.ty = H * 0.22; }
            }
          }
        }
      }
      if (av.active) {
        av.t += dt;
        const T = av.t;
        const total = AV_FLY + AV_MORPH + AV_HOLD + AV_FADE;
        let x = av.tx, y = av.ty, starA = 0, imgA = 0, ringA = 0, scale = 1;
        if (T < AV_FLY) {
          const p = easeInOut(T / AV_FLY);
          x = av.sx + (av.tx - av.sx) * p;
          y = av.sy + (av.ty - av.sy) * p;
          starA = 1;
        } else if (T < AV_FLY + AV_MORPH) {
          if (avParts.length === 0) seedParts();
          const p = (T - AV_FLY) / AV_MORPH;
          starA = 1 - p; imgA = p; ringA = p; scale = 0.6 + 0.4 * easeInOut(p);
        } else if (T < AV_FLY + AV_MORPH + AV_HOLD) {
          imgA = 1; ringA = 1;
        } else if (T < total) {
          const p = (T - AV_FLY - AV_MORPH - AV_HOLD) / AV_FADE;
          imgA = 1 - p; ringA = 1 - p; starA = p * 0.8; scale = 1 - 0.35 * p;
        } else {
          // respawn the borrowed star somewhere new
          stars[av.star].x = Math.random() * W;
          stars[av.star].y = Math.random() * H;
          av.active = false;
          avParts.length = 0;
        }
        if (av.active) {
          const R = (AV_SIZE / 2) * scale;
          if (starA > 0) { // travelling / flaring star
            ctx.globalAlpha = starA;
            ctx.fillStyle = "#f4c15c";
            ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = starA * 0.3;
            ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 1;
          }
          // burst particles: alive through the morph and briefly into the hold
          const burstEnd = AV_FLY + AV_MORPH + 0.7;
          if (T >= AV_FLY && T < burstEnd && avParts.length) {
            const bp = (T - AV_FLY) / (burstEnd - AV_FLY); // 0..1
            const pa = bp < 0.15 ? bp / 0.15 : 1 - easeInOut((bp - 0.15) / 0.85);
            const R0 = AV_SIZE / 2;
            for (const pt of avParts) {
              const ang = pt.a + bp * pt.sp;
              const rad = R0 * pt.rr * easeInOut(Math.min(1, bp * 1.6)) * (1 + bp * 0.5);
              const px = x + Math.cos(ang) * rad;
              const py = y + Math.sin(ang) * rad;
              ctx.globalAlpha = Math.max(0, pa) * 0.9;
              ctx.fillStyle = pt.gold ? "#f4c15c" : "#e74c3c";
              ctx.beginPath(); ctx.arc(px, py, pt.sz, 0, Math.PI * 2); ctx.fill();
            }
            ctx.globalAlpha = 1;
          }
          if (imgA > 0) {
            const pulse = 1 + Math.sin(T * 2.2) * 0.04;
            ctx.save();
            ctx.globalAlpha = imgA;
            ctx.shadowColor = "rgba(231,76,60,0.85)";
            ctx.shadowBlur = 26 * ringA;
            ctx.beginPath(); ctx.arc(x, y, R * pulse, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(244,193,92,${0.9 * ringA})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.clip();
            ctx.drawImage(avatarImg, x - R * pulse, y - R * pulse, R * 2 * pulse, R * 2 * pulse);
            ctx.restore();
            if (ringA > 0.5) {
              const capA = (ringA - 0.5) * 1.4;
              ctx.textAlign = "center";
              ctx.globalAlpha = capA;
              ctx.fillStyle = "#f4c15c";
              ctx.font = "700 11px 'JetBrains Mono', monospace";
              ctx.fillText("DAN · FOUNDER", x, y + R + 22);
              ctx.globalAlpha = capA * 0.75;
              ctx.fillStyle = "#e8e3d8";
              ctx.font = "italic 9px Georgia, serif";
              ctx.fillText("the human in the loop", x, y + R + 38);
              ctx.globalAlpha = 1;
            }
          }
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

    // Respect prefers-reduced-motion: render one static starfield frame
    // instead of the twinkle/comet animation loop.
    const drawStatic = () => {
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        ctx.globalAlpha = s.baseA;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const run = () => (motion.matches ? (stop(), drawStatic()) : start());

    resize();
    seed();
    run();

    const onResize = () => { resize(); seed(); if (motion.matches) drawStatic(); };
    const onVis = () => { document.hidden ? stop() : run(); };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    motion.addEventListener("change", run);

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      motion.removeEventListener("change", run);
    };
  }, []);

  return <canvas id="dl-space" ref={ref} aria-hidden />;
}
