import React, { useEffect, useMemo, useRef } from "react";
import "./SkillsRain.css";

const DEFAULT_SKILLS = [
  "TypeScript",
  "JavaScript",
  "React",
  "Python",
  "Go",
  "SQL",
  "PostgreSQL",
  "WebSockets",
  "Zustand",
  "Docker",
  "Flask",
  "Vite",
  "C++",
  "Jest",
  "Playwright",
];

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function cssVar(name, fallback) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
  );
}

export default function SkillsRain({
  containerRef,
  targetRef,
  skills = DEFAULT_SKILLS,
  count = 24,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const roRef = useRef(null);
  const lastTsRef = useRef(0);
  const particlesRef = useRef([]);
  const dragRef = useRef({
    idx: -1,
    active: false,
    pointerId: null,
    offsetX: 0,
    offsetY: 0,
    lastX: 0,
    lastY: 0,
    lastTs: 0,
  });
  const dimsRef = useRef({ w: 0, h: 0, dpr: 1 });
  const styleCacheRef = useRef({
    lastStyleUpdateMs: 0,
    chipFill: "#111827",
    chipStroke: "rgba(255,255,255,0.18)",
    chipText: "#ffffff",
    accent: "#6366f1",
    fontFamily:
      "system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif",
  });

  const skillPool = useMemo(() => {
    const unique = Array.from(new Set(skills.filter(Boolean)));
    return unique.length ? unique : DEFAULT_SKILLS;
  }, [skills]);

  useEffect(() => {
    if (!containerRef?.current || !targetRef?.current) return;
    if (prefersReducedMotion()) return;

    const canvas = canvasRef.current;
    const containerEl = containerRef.current;
    const imgEl = targetRef.current;
    if (!canvas || !containerEl || !imgEl) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateStyles = (nowMs) => {
      if (nowMs - styleCacheRef.current.lastStyleUpdateMs < 750) return;
      styleCacheRef.current.lastStyleUpdateMs = nowMs;
      styleCacheRef.current.accent = cssVar("--theme-primary", "#6366f1");
      styleCacheRef.current.chipFill = cssVar(
        "--theme-cardBackground",
        "#111827",
      );
      styleCacheRef.current.chipText = cssVar("--theme-text", "#ffffff");
      styleCacheRef.current.chipStroke = cssVar(
        "--theme-border",
        "rgba(255,255,255,0.18)",
      );
      styleCacheRef.current.fontFamily = (
        cssVar("--font-primary", "") ||
        "system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif"
      ).trim();
    };

    const resize = () => {
      const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
      const w = Math.max(1, Math.floor(containerEl.clientWidth));
      const h = Math.max(1, Math.floor(containerEl.clientHeight));
      dimsRef.current = { w, h, dpr };
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const measureChip = (label) => {
      const { fontFamily } = styleCacheRef.current;
      ctx.font = `600 13px ${fontFamily}`;
      const textW = Math.ceil(ctx.measureText(label).width);
      const padX = 12;
      const padY = 7;
      return { w: textW + padX * 2, h: 13 + padY * 2 };
    };

    const spawnParticle = (
      i,
      { x, y, spawnAt = performance.now(), active = true } = {},
    ) => {
      const label = skillPool[i % skillPool.length];
      const chip = measureChip(label);
      const r = Math.max(chip.w, chip.h) * 0.5;
      const w = dimsRef.current.w;
      const cx = w * 0.5;
      const startX =
        typeof x === "number"
          ? x
          : clamp(cx + (Math.random() - 0.5) * w * 0.18, 24, w - 24);
      const startY = typeof y === "number" ? y : -40 - Math.random() * 220;
      return {
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 110,
        vy: 120 + Math.random() * 220,
        w: chip.w,
        h: chip.h,
        r,
        label,
        rot: (Math.random() - 0.5) * 0.25,
        omega: (Math.random() - 0.5) * 1.65,
        spawnAt,
        active,
      };
    };

    const init = () => {
      const now = performance.now();
      updateStyles(now);
      resize();
      const w = dimsRef.current.w;
      const cx = w * 0.5;

      // Spawn in "rounds of two" down the center.
      particlesRef.current = Array.from({ length: count }, (_, i) => {
        const pairIndex = Math.floor(i / 2);
        const side = i % 2 === 0 ? -1 : 1;
        const baseX =
          cx + side * (18 + Math.random() * 18) + (Math.random() - 0.5) * 10;
        const delayMs = pairIndex * 260 + Math.random() * 40;
        return spawnParticle(i, {
          x: clamp(baseX, 24, w - 24),
          y: -70 - Math.random() * 220,
          spawnAt: now + delayMs,
          active: delayMs === 0,
        });
      });

      lastTsRef.current = now;
    };

    const getImageCollider = () => {
      const cRect = containerEl.getBoundingClientRect();
      const iRect = imgEl.getBoundingClientRect();
      const x = iRect.left - cRect.left + iRect.width / 2;
      const y = iRect.top - cRect.top + iRect.height / 2;
      // Slightly smaller than the image so it feels like "bouncing off" the face.
      const r = Math.max(18, Math.min(iRect.width, iRect.height) * 0.44);
      return { x, y, r };
    };

    const drawChip = (p) => {
      const { chipFill, chipStroke, chipText, accent, fontFamily } =
        styleCacheRef.current;
      const x = p.x;
      const y = p.y;
      const w = p.w;
      const h = p.h;
      const radius = 10;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(p.rot);
      ctx.beginPath();
      const left = -w / 2;
      const top = -h / 2;
      const right = w / 2;
      const bottom = h / 2;
      ctx.moveTo(left + radius, top);
      ctx.arcTo(right, top, right, bottom, radius);
      ctx.arcTo(right, bottom, left, bottom, radius);
      ctx.arcTo(left, bottom, left, top, radius);
      ctx.arcTo(left, top, right, top, radius);
      ctx.closePath();

      ctx.fillStyle = chipFill;
      ctx.globalAlpha = 0.92;
      ctx.fill();

      ctx.strokeStyle = chipStroke;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.85;
      ctx.stroke();

      // Accent dot
      ctx.globalAlpha = 1;
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(left + 12, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = chipText;
      ctx.font = `600 13px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(p.label, 8, 0);

      ctx.restore();
    };

    const pointerPos = (evt) => {
      const rect = containerEl.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
      };
    };

    const pickParticle = (x, y) => {
      const ps = particlesRef.current;
      let best = { idx: -1, d: Infinity };
      for (let i = ps.length - 1; i >= 0; i -= 1) {
        const p = ps[i];
        if (!p?.active) continue;
        const dx = x - p.x;
        const dy = y - p.y;
        const d = Math.hypot(dx, dy);
        if (d <= p.r && d < best.d) best = { idx: i, d };
      }
      return best.idx;
    };

    const onPointerDown = (evt) => {
      // Only left-click / primary touch
      if (evt.button != null && evt.button !== 0) return;
      const { x, y } = pointerPos(evt);
      const idx = pickParticle(x, y);
      if (idx < 0) return;

      const p = particlesRef.current[idx];
      dragRef.current = {
        idx,
        active: true,
        pointerId: evt.pointerId ?? null,
        offsetX: p.x - x,
        offsetY: p.y - y,
        lastX: x,
        lastY: y,
        lastTs: performance.now(),
      };

      containerEl.style.cursor = "grabbing";
      try {
        containerEl.setPointerCapture?.(evt.pointerId);
      } catch {
        // ignore
      }
    };

    const onPointerMove = (evt) => {
      const d = dragRef.current;
      if (!d.active) return;
      if (
        d.pointerId != null &&
        evt.pointerId != null &&
        d.pointerId !== evt.pointerId
      )
        return;

      const now = performance.now();
      const { x, y } = pointerPos(evt);
      const ps = particlesRef.current;
      const p = ps[d.idx];
      if (!p) return;

      const dt = clamp((now - d.lastTs) / 1000, 0.001, 0.03);
      const nx = x + d.offsetX;
      const ny = y + d.offsetY;

      // Move particle to pointer; compute a "throw" velocity.
      p.vx = (nx - p.x) / dt;
      p.vy = (ny - p.y) / dt;
      p.x = nx;
      p.y = ny;
      p.omega *= 0.92;

      d.lastX = x;
      d.lastY = y;
      d.lastTs = now;
    };

    const endDrag = () => {
      if (!dragRef.current.active) return;
      dragRef.current.active = false;
      dragRef.current.idx = -1;
      dragRef.current.pointerId = null;
      containerEl.style.cursor = "";
    };

    const onPointerUp = () => endDrag();
    const onPointerCancel = () => endDrag();

    const step = (ts) => {
      updateStyles(ts);
      const { w, h } = dimsRef.current;
      if (!w || !h) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      const dt = clamp((ts - lastTsRef.current) / 1000, 0.001, 0.03);
      lastTsRef.current = ts;

      const gravity = 1250;
      const air = 0.995;
      const floorRestitution = 0.55;
      const wallRestitution = 0.62;
      const imgRestitution = 0.78;
      const imgFriction = 0.02;

      const collider = getImageCollider();

      ctx.clearRect(0, 0, w, h);

      const ps = particlesRef.current;
      for (let i = 0; i < ps.length; i += 1) {
        const p = ps[i];
        if (!p.active) {
          if (ts >= p.spawnAt) p.active = true;
          else continue;
        }
        if (dragRef.current.active && dragRef.current.idx === i) {
          // Still draw while dragging, but skip physics integration.
          drawChip(p);
          continue;
        }

        // Integrate
        p.vy += gravity * dt;
        p.vx *= air;
        p.vy *= air;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.omega * dt;

        // Walls
        if (p.x - p.r < 0) {
          p.x = p.r;
          p.vx = Math.abs(p.vx) * wallRestitution;
          p.omega *= 0.85;
        } else if (p.x + p.r > w) {
          p.x = w - p.r;
          p.vx = -Math.abs(p.vx) * wallRestitution;
          p.omega *= 0.85;
        }

        // Floor
        if (p.y + p.r > h) {
          p.y = h - p.r;
          p.vy = -Math.abs(p.vy) * floorRestitution;
          p.vx *= 0.92;
          p.omega *= 0.75;
        }

        // Bounce off image collider (circle)
        const dx = p.x - collider.x;
        const dy = p.y - collider.y;
        const dist = Math.hypot(dx, dy) || 0.0001;
        const minDist = p.r + collider.r;
        if (dist < minDist) {
          const nx = dx / dist;
          const ny = dy / dist;

          // Push out
          const overlap = minDist - dist;
          p.x += nx * overlap;
          p.y += ny * overlap;

          // Reflect velocity
          const vn = p.vx * nx + p.vy * ny;
          if (vn < 0) {
            p.vx -= (1 + imgRestitution) * vn * nx;
            p.vy -= (1 + imgRestitution) * vn * ny;
            // Tangential friction to make it feel like "scraping" off the photo
            p.vx *= 1 - imgFriction;
            p.vy *= 1 - imgFriction;
            p.omega += (Math.random() - 0.5) * 0.6;
          }
        }

        // Respawn if far below
        if (p.y - p.r > h + 220) {
          const pairIndex = Math.floor(i / 2);
          const side = i % 2 === 0 ? -1 : 1;
          const cx = w * 0.5;
          const baseX =
            cx + side * (18 + Math.random() * 18) + (Math.random() - 0.5) * 10;
          const delayMs = pairIndex % 2 === 0 ? 0 : 140;
          ps[i] = spawnParticle(i, {
            x: clamp(baseX, 24, w - 24),
            y: -70 - Math.random() * 220,
            spawnAt: ts + delayMs,
            active: delayMs === 0,
          });
        }

        drawChip(ps[i]);
      }

      rafRef.current = requestAnimationFrame(step);
    };

    init();

    roRef.current = new ResizeObserver(() => {
      resize();
    });
    roRef.current.observe(containerEl);

    containerEl.addEventListener("pointerdown", onPointerDown, {
      passive: true,
    });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerCancel, {
      passive: true,
    });

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (roRef.current) roRef.current.disconnect();
      containerEl.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      rafRef.current = null;
      roRef.current = null;
      particlesRef.current = [];
    };
  }, [containerRef, targetRef, skillPool, count]);

  return (
    <canvas ref={canvasRef} className="skills-rain-canvas" aria-hidden="true" />
  );
}
