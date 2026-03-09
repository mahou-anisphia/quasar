"use client";

import { useEffect, useRef } from "react";

type Spark = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  maxOp: number;
  op: number;
  hue: number;
  trail: boolean;
  px: number;
  py: number;
};

export function SparkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0,
      H = 0;
    let sparks: Spark[] = [];
    let animId: number;
    let t = 0;

    function resize() {
      W = canvas!.width = window.innerWidth;
      H = canvas!.height = window.innerHeight;
    }

    function spawn(rand = false) {
      const hues = [0, 15, 35, 280, 310, 330];
      const h = hues[Math.floor(Math.random() * hues.length)]!;
      sparks.push({
        x: Math.random() * W,
        y: rand ? Math.random() * H : H + 8,
        r: Math.random() * 2.4 + 0.4,
        vx: (Math.random() - 0.5) * 0.75,
        vy: -(Math.random() * 1.1 + 0.25),
        life: 0,
        maxLife: Math.random() * 190 + 80,
        maxOp: Math.random() * 0.42 + 0.1,
        op: 0,
        hue: h,
        trail: Math.random() < 0.28,
        px: 0,
        py: 0,
      });
    }

    function init() {
      sparks = [];
      for (let i = 0; i < 70; i++) spawn(true);
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      t += 0.016;

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]!;
        s.px = s.x;
        s.py = s.y;
        s.x += s.vx + Math.sin(t * 2 + s.y * 0.018) * 0.012;
        s.y += s.vy;
        s.life++;

        const f0 = s.maxLife * 0.14;
        const f1 = s.maxLife * 0.72;
        if (s.life < f0) s.op = (s.life / f0) * s.maxOp;
        else if (s.life > f1)
          s.op = ((s.maxLife - s.life) / (s.maxLife - f1)) * s.maxOp;
        else s.op = s.maxOp;

        if (s.life >= s.maxLife) {
          sparks.splice(i, 1);
          spawn();
          continue;
        }

        if (s.trail && s.life > 2) {
          ctx!.beginPath();
          ctx!.moveTo(s.px, s.py);
          ctx!.lineTo(s.x, s.y);
          ctx!.strokeStyle = `hsla(${s.hue},88%,62%,${s.op * 0.45})`;
          ctx!.lineWidth = s.r * 0.55;
          ctx!.stroke();
        }

        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${s.hue},88%,65%,${s.op})`;
        ctx!.fill();

        if (s.r > 1.4 && s.op > 0.18) {
          const g = ctx!.createRadialGradient(
            s.x,
            s.y,
            0,
            s.x,
            s.y,
            s.r * 5,
          );
          g.addColorStop(0, `hsla(${s.hue},90%,72%,${s.op * 0.22})`);
          g.addColorStop(1, "transparent");
          ctx!.beginPath();
          ctx!.arc(s.x, s.y, s.r * 5, 0, Math.PI * 2);
          ctx!.fillStyle = g;
          ctx!.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();

    function handleResize() {
      resize();
      init();
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
