"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { slides, type Slide } from "./slides";

export default function PresentPage() {
  const [index, setIndex] = useState(0);
  const [helpOpen, setHelpOpen] = useState(false);
  const total = slides.length;
  const rootRef = useRef<HTMLDivElement>(null);

  // ---------- navigation ----------
  const go = useCallback(
    (delta: number) => {
      setIndex((i) => {
        const next = i + delta;
        if (next < 0) return 0;
        if (next >= total) return total - 1;
        return next;
      });
    },
    [total]
  );

  const goTo = useCallback(
    (n: number) => {
      setIndex(Math.max(0, Math.min(total - 1, n)));
    },
    [total]
  );

  const toggleFullscreen = useCallback(() => {
    const el = rootRef.current ?? document.documentElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  // ---------- keyboard ----------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Home") {
        goTo(0);
      } else if (e.key === "End") {
        goTo(total - 1);
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "?" || e.key === "/") {
        setHelpOpen((v) => !v);
      } else if (e.key === "Escape") {
        setHelpOpen(false);
      } else if (/^[0-9]$/.test(e.key)) {
        // digit jumps to nearest section divider (handy for live demos)
        const digit = parseInt(e.key, 10);
        if (digit === 1) goTo(0);
        else if (digit === 2) {
          const i = slides.findIndex((s, idx) => idx > 0 && s.kind === "section" && s.title.startsWith("The Walkthrough"));
          if (i >= 0) goTo(i);
        } else if (digit === 3) {
          const i = slides.findIndex((s) => s.kind === "section" && s.title.startsWith("The Patterns"));
          if (i >= 0) goTo(i);
        } else if (digit === 4) {
          const i = slides.findIndex((s) => s.kind === "recap");
          if (i >= 0) goTo(i);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, goTo, total, toggleFullscreen]);

  // ---------- prefetch adjacent agent images ----------
  useEffect(() => {
    const targets = [index - 1, index + 1, index + 2].filter((i) => i >= 0 && i < total);
    targets.forEach((i) => {
      const s = slides[i];
      if (s.kind === "agent") {
        const img = new Image();
        img.src = `/screenshots/${s.slug}.png`;
      }
    });
  }, [index, total]);

  const current = slides[index];

  return (
    <div className="present-root" ref={rootRef}>
      <div className="stage">
        {slides.map((s, i) => (
          <SlideView key={i} slide={s} active={i === index} />
        ))}
      </div>

      {/* Touch zones for mobile */}
      <button className="touchzone prev" aria-label="Previous slide" onClick={() => go(-1)} style={{ background: "transparent", border: "none" }} />
      <button className="touchzone next" aria-label="Next slide" onClick={() => go(1)} style={{ background: "transparent", border: "none" }} />

      {/* HUD */}
      <div className="hud">
        <div className="left">
          <span className="hud-counter">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <div className="hud-progress" aria-hidden>
            <span style={{ width: `${((index + 1) / total) * 100}%` }} />
          </div>
        </div>
        <div className="right">
          <button onClick={() => go(-1)} aria-label="Previous">← Prev</button>
          <button onClick={() => go(1)} aria-label="Next">Next →</button>
          <button onClick={toggleFullscreen} aria-label="Toggle fullscreen">⛶ Full</button>
          <button onClick={() => setHelpOpen((v) => !v)} aria-label="Toggle help">?</button>
          <a href="/" style={{ pointerEvents: "auto" }}>
            <button>Exit</button>
          </a>
        </div>
      </div>

      {/* Help overlay */}
      <div className="help-overlay" data-open={helpOpen} onClick={() => setHelpOpen(false)}>
        <div className="card" onClick={(e) => e.stopPropagation()}>
          <h3>Keyboard shortcuts</h3>
          <dl>
            <dt>→ / Space</dt><dd>Next slide</dd>
            <dt>←</dt><dd>Previous slide</dd>
            <dt>Home / End</dt><dd>Jump to first / last</dd>
            <dt>1 – 4</dt><dd>Jump to title / walkthrough / patterns / recap</dd>
            <dt>F</dt><dd>Toggle fullscreen</dd>
            <dt>?</dt><dd>Toggle this help</dd>
            <dt>Esc</dt><dd>Exit fullscreen / close help</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}

// =================================================================
// Slide renderers
// =================================================================

function SlideView({ slide, active }: { slide: Slide; active: boolean }) {
  if (slide.kind === "title") return <TitleSlide slide={slide} active={active} />;
  if (slide.kind === "section") return <SectionSlide slide={slide} active={active} />;
  if (slide.kind === "agent") return <AgentSlide slide={slide} active={active} />;
  if (slide.kind === "dimension") return <DimensionSlide slide={slide} active={active} />;
  if (slide.kind === "recap") return <RecapSlide slide={slide} active={active} />;
  return <OutroSlide slide={slide} active={active} />;
}

function TitleSlide({ slide, active }: { slide: Extract<Slide, { kind: "title" }>; active: boolean }) {
  return (
    <section className="slide slide-title" data-active={active}>
      <div className="slide-inner">
        <div className="eyebrow">{slide.eyebrow}</div>
        <h1>{slide.title}</h1>
        <p className="subtitle">{slide.subtitle}</p>
        <div className="meta">
          <span>{slide.date}</span>
          <span>{slide.author}</span>
        </div>
      </div>
    </section>
  );
}

function SectionSlide({ slide, active }: { slide: Extract<Slide, { kind: "section" }>; active: boolean }) {
  return (
    <section className="slide slide-section" data-active={active}>
      <div className="slide-inner">
        <div className="index">{slide.index}</div>
        <h2>{slide.title}</h2>
        <p className="subtitle">{slide.subtitle}</p>
      </div>
    </section>
  );
}

function AgentSlide({ slide, active }: { slide: Extract<Slide, { kind: "agent" }>; active: boolean }) {
  const src = `/screenshots/${slide.slug}.png`;
  return (
    <section className="slide slide-agent" data-active={active}>
      <div className="slide-inner">
        <div className="lhs">
          <div className="agent-eyebrow">
            <span className="dot" />
            <span>{slide.tier}</span>
          </div>
          <h2>{slide.name}</h2>
          <div className="vendor">{slide.vendor}</div>
          <p className="tldr">{slide.tldr}</p>
          <dl>
            <dt>Surface</dt>
            <dd>{slide.surface}</dd>
            <dt>Lifecycle</dt>
            <dd>{slide.lifecycle}</dd>
            <dt>Approvals</dt>
            <dd>{slide.approvals}</dd>
            <dt>Artifacts</dt>
            <dd>{slide.artifacts}</dd>
          </dl>
        </div>
        <div className="rhs">
          <div className="frame">
            {slide.slug === "perplexity-computer" ? (
              <div className="placeholder">
                Perplexity Computer — task-centric sidebar with live browser canvas.
                <br /><br />
                Screenshot blocked by Cloudflare; see live product at perplexity.ai/computer
              </div>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={src} alt={`${slide.name} interface`} loading={active ? "eager" : "lazy"} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function DimensionSlide({ slide, active }: { slide: Extract<Slide, { kind: "dimension" }>; active: boolean }) {
  return (
    <section className="slide slide-dimension" data-active={active}>
      <div className="slide-inner">
        <div className="index">{slide.index}</div>
        <h2>{slide.title}</h2>
        <p className="subtitle">{slide.subtitle}</p>
        <div className="patterns">
          {slide.patterns.map((p, i) => (
            <div className="pattern" key={i}>
              <div className="name">{p.name}</div>
              <div className="agents">{p.agents}</div>
              <div className="tradeoff">{p.tradeoff}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecapSlide({ slide, active }: { slide: Extract<Slide, { kind: "recap" }>; active: boolean }) {
  return (
    <section className="slide slide-recap" data-active={active}>
      <div className="slide-inner">
        <h2>{slide.title}</h2>
        <p className="subtitle">{slide.subtitle}</p>
        <div className="items">
          {slide.items.map((it, i) => (
            <div className="item" key={i}>
              <div className="label">{it.label}</div>
              <div className="body">{it.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OutroSlide({ slide, active }: { slide: Extract<Slide, { kind: "outro" }>; active: boolean }) {
  return (
    <section className="slide slide-outro" data-active={active}>
      <div className="slide-inner">
        <h2>{slide.title}</h2>
        <p className="body">{slide.body}</p>
        <div className="cta">{slide.cta}</div>
      </div>
    </section>
  );
}
