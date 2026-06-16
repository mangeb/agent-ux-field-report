"use client";

import { useState, useMemo } from "react";
import { dimensions, principles, antiPatterns, flowSteps } from "./content";
import agentsData from "../data/agents.json";

type Agent = {
  entity: string;
  agent_name: string;
  vendor: string;
  audience: string;
  primary_surface: string;
  task_lifecycle: string;
  approval_model: string;
  artifacts: string;
  multi_agent: string;
  notifications: string;
  ui_patterns: string[] | string;
  visual_description: string;
  sources: string[] | string;
};

const agents = agentsData as unknown as Agent[];

function cleanSurface(s: string): string {
  if (!s) return "";
  let out = s
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")  // unwrap markdown links to plain text
    .replace(/\*\*/g, "")
    // remove citation-like parens that mention docs, blog, .com, etc
    .replace(/\(\s*[^)]*?(?:Docs|Documentation|Blog|Website|Help|\.com|\.io|\.dev|\.ai|\.org)[^)]*\)/gi, "")
    .replace(/\(\s*\)/g, "")  // empty parens
    .replace(/\s*,\s*,/g, ",")  // double commas
    .replace(/\s*,\s*and\s*\./gi, ".")  // ", and."
    .replace(/\s*,\s*\./g, ".")  // ", ."
    .replace(/\s*\.\s*\./g, ".")  // ".."
    .replace(/^\s*[,\.]\s*/, "")  // leading punctuation
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;])/g, "$1")
    .trim();
  if (out.length > 170) out = out.slice(0, 170).trim().replace(/[,;]\s*$/, "") + "…";
  return out;
}

// Tier classification — pick the *primary* (first-mentioned, most consumer-leaning) audience.
function tierOf(a: Agent): "consumer" | "prosumer" | "enterprise" | "developer" {
  // Manual mapping based on actual positioning of each agent
  const map: Record<string, "consumer" | "prosumer" | "enterprise" | "developer"> = {
    "Cursor background agents and composer UI": "developer",
    "OpenAI ChatGPT Agent and Operator interface": "consumer",
    "Microsoft Copilot Studio Scout agent management": "enterprise",
    "Perplexity Computer agent task interface": "consumer",
    "Devin AI by Cognition Labs interface": "developer",
    "Manus AI agent dashboard": "prosumer",
    "Genspark AI Super Agent interface": "consumer",
    "Claude Code by Anthropic management UI": "developer",
    "Replit Agent interface": "prosumer",
    "Bolt.new agent interface by StackBlitz": "consumer",
    "v0 by Vercel agent interface": "prosumer",
    "Lovable.dev agent interface": "consumer",
    "Google Jules coding agent interface": "developer",
    "Amazon Q Developer agent interface": "developer",
    "OpenHands (formerly OpenDevin) UI": "developer",
    "Aider terminal coding agent UI": "developer",
    "Cline VS Code agent extension UI": "developer",
    "Continue.dev agent interface": "developer",
    "AutoGPT platform interface": "prosumer",
    "CrewAI Studio interface": "enterprise",
    "LangGraph Studio interface": "developer",
    "AutoGen Studio Microsoft interface": "developer",
    "Block Goose agent interface": "developer",
    "SWE-agent Princeton interface": "developer",
  };
  return map[a.entity] || "developer";
}

// Strip markdown links — render as plain HTML below
function renderMd(text: string): string {
  if (!text) return "";
  // bold
  let s = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // links
  s = s.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>'
  );
  return s;
}

export default function Home() {
  const [filter, setFilter] = useState<string>("all");
  const [openAgent, setOpenAgent] = useState<Agent | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return agents;
    return agents.filter((a) => tierOf(a) === filter);
  }, [filter]);

  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <div className="nav-inner">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Logo />
            <span className="mono" style={{ color: "var(--ink-dim)" }}>
              field report №1
            </span>
          </div>
          <div className="nav-links">
            <a href="#taxonomy">Taxonomy</a>
            <a href="#agents">Agents</a>
            <a href="#proposal">Chrome</a>
            <a href="#flow">Flow</a>
            <a href="/present" className="nav-cta">Present ▸</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <p className="eyebrow">
            June 2026 · Field report · Agent management interfaces
          </p>
          <h1
            className="h1 display"
            style={{ marginTop: 28, maxWidth: "12ch" }}
          >
            How agents <span style={{ color: "var(--accent)", fontStyle: "italic" }}>surface</span>,
            <br />
            <span style={{ color: "var(--ink-dim)" }}>approve, and</span>
            <br />
            bubble up.
          </h1>
          <p className="lede" style={{ marginTop: 40 }}>
            A teardown of <strong>24 AI agent management interfaces</strong> —
            from Claude Code to AutoGPT, from Microsoft Scout to a kid building
            in Bolt — organized by the five dimensions of design that decide
            whether an agent feels like a colleague or a black box. And a
            concrete proposal for what this should look like when it arrives,
            uninvited, in a consumer's Chrome browser.
          </p>

          <div className="hero-meta">
            <div>
              <div className="stat-n">24</div>
              <div className="stat-l">Agents surveyed</div>
            </div>
            <div>
              <div className="stat-n">05</div>
              <div className="stat-l">Design dimensions</div>
            </div>
            <div>
              <div className="stat-n">25</div>
              <div className="stat-l">Named patterns</div>
            </div>
            <div>
              <div className="stat-n">01</div>
              <div className="stat-l">Chrome proposal</div>
            </div>
          </div>

          <div className="index-nav">
            <a href="#taxonomy">
              <span className="ix-n">01</span>
              <span className="ix-t">The Taxonomy</span>
            </a>
            <a href="#agents">
              <span className="ix-n">02</span>
              <span className="ix-t">All 24 Agents</span>
            </a>
            <a href="#principles">
              <span className="ix-n">03</span>
              <span className="ix-t">Principles</span>
            </a>
            <a href="#proposal">
              <span className="ix-n">04</span>
              <span className="ix-t">Chrome Surfaces</span>
            </a>
            <a href="#flow">
              <span className="ix-n">05</span>
              <span className="ix-t">A Concrete Flow</span>
            </a>
          </div>
        </div>
      </section>

      {/* TAXONOMY */}
      <section id="taxonomy" className="section">
        <div className="container">
          <p className="kicker">Part one</p>
          <h2 className="h2" style={{ marginTop: 16, maxWidth: "16ch" }}>
            Five dimensions that decide everything.
          </h2>
          <p className="lede" style={{ marginTop: 32 }}>
            Every agent interface — no matter how its makers talk about it —
            answers the same five questions. How is the task lifecycle
            visualized? When does the agent ask permission? How does it hand
            you its work? How are many agents managed at once? And how does an
            urgent thing reach you when you are not looking? Across 24 tools
            we found 25 distinct, nameable patterns.
          </p>

          {dimensions.map((dim) => (
            <div className="dim-block" key={dim.id}>
              <div className="dim-header">
                <p className="kicker">{dim.number}</p>
                <h3 className="h3">{dim.title}</h3>
                <p className="small">{dim.intro}</p>
              </div>
              <div className="grid g-2">
                {dim.patterns.map((p, i) => (
                  <div
                    className={`pattern-card ${i === 2 ? "featured" : ""}`}
                    key={p.number}
                  >
                    <div className="p-number">{p.number}</div>
                    <div className="p-title">{p.title}</div>
                    <div className="p-desc">{p.desc}</div>
                    <div className="p-agents">
                      {p.agents.join(" · ")}
                    </div>
                    <div className="p-tradeoff">{p.tradeoff}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AGENTS GRID */}
      <section id="agents" className="section">
        <div className="container">
          <p className="kicker">Part two</p>
          <h2 className="h2" style={{ marginTop: 16, maxWidth: "16ch" }}>
            The 24 we read.
          </h2>
          <p className="lede" style={{ marginTop: 32 }}>
            Each tile opens a detailed teardown — the audience it serves, how
            its lifecycle is visualized, what approval model it uses, how it
            surfaces artifacts, and how urgency reaches the user. Sources
            inline.
          </p>

          <div className="chip-row">
            {(["all", "consumer", "prosumer", "enterprise", "developer"] as const).map(
              (f) => (
                <button
                  key={f}
                  className={`chip ${filter === f ? "active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f === "all" ? "All 24" : f}
                </button>
              )
            )}
          </div>

          <div className="grid g-3">
            {filtered.map((a) => {
              const tier = tierOf(a);
              return (
                <button
                  className="agent-tile"
                  key={a.entity}
                  onClick={() => setOpenAgent(a)}
                  type="button"
                >
                  <div className="a-vendor">
                    {(a.vendor || "—").replace(/\[(.*?)\]\(.*?\)/g, "$1")}
                  </div>
                  <div className="a-name">
                    {(a.agent_name || a.entity).replace(/\([^)]*\)/g, "").trim()}
                  </div>
                  <span className={`a-tier ${tier}`}>{tier}</span>
                  <div className="a-surface">
                    {cleanSurface(a.primary_surface)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section id="principles" className="section">
        <div className="container">
          <p className="kicker">Part three</p>
          <h2 className="h2" style={{ marginTop: 16, maxWidth: "18ch" }}>
            What a consumer Chrome needs, in six lines.
          </h2>
          <p className="lede" style={{ marginTop: 32, marginBottom: 60 }}>
            The research across 24 interfaces reveals a clear fault line:
            everything built for developers is wrong for consumers, and most
            products sit firmly on the developer side. These principles are
            derived from what works — and what fails — in the real world.
          </p>
          {principles.map((p) => (
            <div className="principle" key={p.n}>
              <div className="p-num">{p.n}</div>
              <div className="p-content">
                <h4>{p.title}</h4>
                <p>{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CHROME PROPOSAL */}
      <section id="proposal" className="section">
        <div className="container">
          <p className="kicker">Part four</p>
          <h2 className="h2" style={{ marginTop: 16, maxWidth: "18ch" }}>
            Five surfaces for agents <span style={{ color: "var(--ink-dim)" }}>inside Chrome.</span>
          </h2>

          <div
            className="proposal-grid"
            style={{ marginTop: 60, alignItems: "start" }}
          >
            <div className="body">
              <p>
                A consumer Chrome agent layer needs five surfaces — not one. Each
                does one job well. None overlap. Together they handle the entire
                interaction from intent to outcome.
              </p>

              <h3 className="h3" style={{ marginTop: 40, marginBottom: 12 }}>
                01 — The omnibox
              </h3>
              <p>
                Intent capture starts where the user already types. The address
                bar is the universal Chrome entry point; it should also be the
                entry point for agents. A small pulsing indicator inside the
                omnibox communicates state — neutral, working, needs you, done.
                One pixel; four meanings.
              </p>

              <h3 className="h3" style={{ marginTop: 40, marginBottom: 12 }}>
                02 — The side panel
              </h3>
              <p>
                Chrome already has a side panel for reading lists, bookmarks,
                and history. Agents get the same. Active runs as cards, sorted
                by status (needs input first, then complete, then running). Each
                card shows the user's own task description, not a UUID. Click
                to expand.
              </p>

              <h3 className="h3" style={{ marginTop: 40, marginBottom: 12 }}>
                03 — The new-tab inbox
              </h3>
              <p>
                The new-tab page becomes a quiet agent inbox. Completed tasks
                from the last few days, pinned ones at the top, archive
                accessible. Borrowed wholesale from Devin's insight that{" "}
                <a
                  className="inline-link"
                  href="https://tianpan.co/blog/2026-04-23-async-agents-inbox-not-chat"
                  target="_blank"
                  rel="noopener"
                >
                  async agents are inbox, not chat
                </a>
                .
              </p>

              <h3 className="h3" style={{ marginTop: 40, marginBottom: 12 }}>
                04 — In-page overlays
              </h3>
              <p>
                When the agent needs a decision while the user is browsing, a
                bottom-sheet slides up over the current page — not a modal,
                never a blocking dialog. Two choices, three at most. Dismissing
                routes the request to the side panel.
              </p>

              <h3 className="h3" style={{ marginTop: 40, marginBottom: 12 }}>
                05 — System notifications
              </h3>
              <p>
                Outside Chrome, the OS speaks — once. For completion. For a
                blocked task that needs input. Never for status updates. The
                difference between ChatGPT Agent's well-tuned approval gates
                and Cline's per-action confirmation is the difference between
                notification trust and notification fatigue.
              </p>
            </div>

            <ChromeMock />
          </div>

          {/* Anti patterns */}
          <div style={{ marginTop: 100 }}>
            <h3 className="h3" style={{ marginBottom: 8 }}>
              Six things to refuse.
            </h3>
            <p className="small" style={{ marginBottom: 32, maxWidth: "60ch" }}>
              The anti-patterns observed across the 24 tools. Each one is right
              for the audience it serves and exactly wrong for a consumer in a
              browser.
            </p>
            <div className="anti-grid">
              {antiPatterns.map((a, i) => (
                <div className="anti-cell" key={i}>
                  <div className="anti-label">{a.label}</div>
                  <h4>{a.title}</h4>
                  <p>{a.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FLOW */}
      <section id="flow" className="section">
        <div className="container">
          <p className="kicker">Part five</p>
          <h2 className="h2" style={{ marginTop: 16, maxWidth: "18ch" }}>
            Magnus books a detailing appointment.
          </h2>
          <p className="lede" style={{ marginTop: 32, marginBottom: 60 }}>
            A walkthrough of the proposed Chrome design end-to-end. Two user
            decisions. Zero log streams. Zero tool-call summaries. Zero dev
            jargon. The agent does the work; Chrome shows the decisions only
            Magnus can make.
          </p>
          {flowSteps.map((s, i) => (
            <div className="flow-step" key={i}>
              <div className="fs-tag">{s.tag}</div>
              <div className="fs-content">
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-row">
            <div>
              <Logo small />
              <div style={{ marginTop: 12 }}>
                Field report №1 · Agent UX · June 2026
              </div>
            </div>
            <div style={{ textAlign: "right", color: "var(--ink-dim)" }}>
              Research conducted across 24 product pages, docs, and reviews.
              <br />
              All claims linked to primary sources inside each agent teardown.
            </div>
          </div>
        </div>
      </footer>

      {/* MODAL */}
      {openAgent && (
        <AgentModal agent={openAgent} onClose={() => setOpenAgent(null)} />
      )}
    </>
  );
}

function Logo({ small = false }: { small?: boolean }) {
  const size = small ? 24 : 28;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 32 32" aria-label="logo">
        <rect x="2" y="2" width="28" height="28" stroke="currentColor" strokeWidth="1.6" fill="none" />
        <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1.6" fill="none" />
        <circle cx="16" cy="16" r="2.4" fill="var(--accent)" />
      </svg>
      <span
        style={{
          fontFamily: "var(--f-display)",
          fontSize: small ? 17 : 19,
          letterSpacing: "-0.02em",
        }}
      >
        Field<span style={{ color: "var(--accent)" }}>.</span>Report
      </span>
    </div>
  );
}

function ChromeMock() {
  return (
    <div className="chrome-mock">
      <div className="chrome-bar">
        <div className="chrome-dots">
          <span /> <span /> <span />
        </div>
        <div className="chrome-omni">
          <span className="chrome-pulse" />
          <span>Booking car detailing — needs your input</span>
        </div>
      </div>
      <div className="chrome-body">
        <div className="chrome-content">
          ↓ bottom-sheet appears here<br />when a decision is needed
        </div>
        <div className="chrome-side">
          <div className="side-eyebrow">Your agents · 3</div>
          <div className="side-card active">
            <div className="sc-status">● Needs input</div>
            <div className="sc-title">Find car detailing appointment</div>
          </div>
          <div className="side-card">
            <div className="sc-status">Running · 2 min</div>
            <div className="sc-title">Compile flight options to Stockholm</div>
          </div>
          <div className="side-card done">
            <div className="sc-status">Done · 4 min ago</div>
            <div className="sc-title">Draft reply to Anna about Friday</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentModal({
  agent,
  onClose,
}: {
  agent: Agent;
  onClose: () => void;
}) {
  const fields: Array<[string, string]> = [
    ["Audience", agent.audience],
    ["Primary surface", agent.primary_surface],
    ["Task lifecycle", agent.task_lifecycle],
    ["Approval model", agent.approval_model],
    ["Artifact surfacing", agent.artifacts],
    ["Many agents", agent.multi_agent],
    ["Bubble-up", agent.notifications],
    ["Visual notes", agent.visual_description],
  ];
  const patterns = Array.isArray(agent.ui_patterns)
    ? agent.ui_patterns
    : agent.ui_patterns
    ? [String(agent.ui_patterns)]
    : [];
  const sources = Array.isArray(agent.sources)
    ? agent.sources
    : agent.sources
    ? [String(agent.sources)]
    : [];

  return (
    <div
      className="modal-bg"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <p className="eyebrow">
          {(agent.vendor || "—").replace(/\[(.*?)\]\(.*?\)/g, "$1")}
        </p>
        <h3 style={{ marginTop: 8 }}>
          {(agent.agent_name || agent.entity).replace(/\([^)]*\)/g, "").trim()}
        </h3>
        {fields.map(([label, value]) =>
          value ? (
            <div className="modal-row" key={label}>
              <div className="label">{label}</div>
              <div
                className="value"
                dangerouslySetInnerHTML={{ __html: renderMd(value) }}
              />
            </div>
          ) : null
        )}
        {patterns.length > 0 && (
          <div className="modal-row">
            <div className="label">Key UI patterns</div>
            <div className="value">
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {patterns.map((p, i) => (
                  <li
                    key={i}
                    style={{ marginBottom: 6 }}
                    dangerouslySetInnerHTML={{ __html: renderMd(p) }}
                  />
                ))}
              </ul>
            </div>
          </div>
        )}
        {sources.length > 0 && (
          <div className="modal-row">
            <div className="label">Sources</div>
            <div
              className="value"
              style={{ fontSize: 13, color: "var(--ink-dim)" }}
            >
              {sources.map((s, i) => {
                const url = s.match(/https?:\/\/[^\s)]+/)?.[0];
                const text = s
                  .replace(/https?:\/\/[^\s)]+/, "")
                  .replace(/^\s*[-(]\s*/, "")
                  .replace(/[)]\s*$/, "")
                  .replace(/^\s*\(/, "")
                  .trim();
                return (
                  <div key={i} style={{ marginBottom: 4 }}>
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener"
                        style={{ color: "var(--accent)" }}
                      >
                        {text || url}
                      </a>
                    ) : (
                      s
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
