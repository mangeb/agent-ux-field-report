// Curated content for the report. All citations link to original sources.

export type Pattern = {
  number: string;
  title: string;
  desc: string;
  agents: string[];
  tradeoff: string;
};

export type Dimension = {
  id: string;
  number: string;
  title: string;
  intro: string;
  patterns: Pattern[];
};

export const dimensions: Dimension[] = [
  {
    id: "lifecycle",
    number: "01",
    title: "Task Lifecycle",
    intro:
      "How an agent communicates 'what it's doing right now' is where most design decisions compound. Five distinct patterns emerged across 24 tools.",
    patterns: [
      {
        number: "01.1",
        title: "Live Activity Stream",
        desc: "Every tool call, file read, search query, and model response appended to a scrolling chronological log. Honest but unsparing — you see everything, including noise.",
        agents: ["Cursor", "Cline", "Aider", "SWE-agent", "AutoGen Studio"],
        tradeoff:
          "Maximum transparency at the cost of signal-to-noise. Power users love it; anyone unfamiliar with tool calls finds it overwhelming.",
      },
      {
        number: "01.2",
        title: "Plan-then-Execute Card",
        desc: "The agent generates a structured plan — a numbered list of intended steps — and waits for approval, or launches with the plan visible. Separates 'what will happen' from 'what is happening.'",
        agents: ["Jules", "Lovable", "Claude Code", "Perplexity Computer", "Amazon Q"],
        tradeoff:
          "High trust for consequential tasks. Tradeoff is latency, and the risk that users rubber-stamp the plan without reading it.",
      },
      {
        number: "01.3",
        title: "Timeline Scrubber",
        desc: "Every state checkpoint is saved; users scroll backward through time to inspect, replay, or branch from any prior moment. Most powerful pattern for debugging.",
        agents: ["Cursor", "Devin", "Manus", "LangGraph Studio"],
        tradeoff:
          "Transformative for power users who think in diffs and state mutations. Irrelevant and confusing for consumers who just want the thing done.",
      },
      {
        number: "01.4",
        title: "Three-Pane Workspace",
        desc: "Spatial layout separating conversation, live agent environment, and context. The user watches the agent 'work' in the center while narrating left and providing materials right.",
        agents: ["Devin", "Claude Code", "Perplexity Computer", "v0"],
        tradeoff:
          "Right for sustained collaboration on a complex artifact. Fails when there is no persistent artifact to inspect.",
      },
      {
        number: "01.5",
        title: "Kanban / Task Board",
        desc: "Tasks are cards in columns — Draft, Active, Ready, Done. The agent advances cards rather than appending to a stream. Progress as position, not prose.",
        agents: ["Replit Agent", "ChatGPT Agent", "CrewAI Studio"],
        tradeoff:
          "Excellent for tracking parallelism at a glance. Loses granularity — you see 'Active' but not what the agent just ran into.",
      },
    ],
  },
  {
    id: "approvals",
    number: "02",
    title: "Approval Models",
    intro:
      "No decision in agent UX is more consequential than when to interrupt the user. These patterns represent fundamentally different bets about the cost of interruption versus the cost of mistakes.",
    patterns: [
      {
        number: "02.1",
        title: "Per-Action Confirmation",
        desc: "Every tool use — every file write, shell command, API call — requires a human click. The agent is essentially a very smart cursor controlled by the user.",
        agents: ["Cline", "Claude Code", "Continue.dev"],
        tradeoff:
          "Maximum safety; minimum throughput. Appropriate when the cost of an incorrect action is high. Makes agents feel like spell-check rather than autonomy.",
      },
      {
        number: "02.2",
        title: "Checkpoint Approval",
        desc: "The agent operates autonomously within a phase and surfaces one gate between major phases — plan-to-execute, code-to-commit. The user approves outcomes, not actions.",
        agents: ["Cursor", "Jules", "Amazon Q", "Lovable"],
        tradeoff:
          "The right balance for most professional contexts. Risk: approval fatigue. If every checkpoint looks the same, users rubber-stamp.",
      },
      {
        number: "02.3",
        title: "Risk-Tiered Gates",
        desc: "The agent classifies actions by risk and interrupts only for high-risk or irreversible ones. Routine actions run silently; sensitive ones surface a confirmation modal.",
        agents: ["ChatGPT Agent", "Microsoft Scout", "Perplexity Computer", "v0"],
        tradeoff:
          "The most consumer-friendly model. Interruptions feel purposeful. Difficulty is classifying risk correctly — misjudging 'safe' can do real damage silently.",
      },
      {
        number: "02.4",
        title: "Full Autonomy + Interrupt",
        desc: "The agent runs without interruption by default. The user can break in at any time. Some systems let users 'take over' for blockers (CAPTCHAs, 2FA) and hand back control.",
        agents: ["Manus", "Devin", "SWE-agent", "Aider"],
        tradeoff:
          "Highest throughput; lowest user burden. Requires trust that the agent's autonomous judgment is correct — a bet that fails in novel edge cases.",
      },
      {
        number: "02.5",
        title: "Async / Email-First",
        desc: "Approvals don't require user presence. The system sends an email or Slack message summarizing the pending decision; the user replies inline or clicks a link to approve.",
        agents: ["CrewAI Studio", "Devin", "Microsoft Scout"],
        tradeoff:
          "Right model for hours-long tasks where the user isn't watching. Risk is decision latency — an approval that takes 4 hours destroys parallelism.",
      },
    ],
  },
  {
    id: "artifacts",
    number: "03",
    title: "Artifact Surfacing",
    intro:
      "When an agent produces something — a file, diff, deployed URL, report — how and when it appears determines whether users trust and use the output.",
    patterns: [
      {
        number: "03.1",
        title: "Inline Diff Gallery",
        desc: "Code changes presented as a grouped, syntax-highlighted diff — green for additions, red for deletions — attached to the conversation. Multiple files in an accordion the user steps through.",
        agents: ["Cursor", "Amazon Q", "Cline", "Jules"],
        tradeoff:
          "Right artifact model for code. Diffs speak the language developers already use. Completely wrong for consumer contexts.",
      },
      {
        number: "03.2",
        title: "Live Preview + Code",
        desc: "Artifacts surfaced in a split view with an interactive preview running alongside source. Output as a functioning thing — a rendered page, a live app — rather than text.",
        agents: ["v0", "Bolt", "Lovable", "Replit Agent"],
        tradeoff:
          "Transforms the artifact from abstract code into something concrete. Only works when the output is a web app or interface.",
      },
      {
        number: "03.3",
        title: "Deliverable Card at End",
        desc: "The agent completes its run, then surfaces the output as a downloadable file or summary card at the close of the conversation. No inline preview — just a clean endpoint.",
        agents: ["ChatGPT Agent", "Genspark", "Perplexity Computer"],
        tradeoff:
          "Clean and consumer-friendly. Removes the anxiety of watching the agent work. Users can't intervene if the output goes wrong direction.",
      },
      {
        number: "03.4",
        title: "Auto-PR / Auto-Branch",
        desc: "The agent pushes work to version control and creates a pull request or branch automatically. The artifact surfaces in the developer's existing workflow — GitHub, GitLab.",
        agents: ["Claude Code", "Devin", "Jules", "Continue.dev"],
        tradeoff:
          "Integrates with existing engineering workflow. Zero relevance for consumer use cases.",
      },
      {
        number: "03.5",
        title: "Specialized Canvas",
        desc: "Different artifact types get their own surface — a presentation in a slide viewer, a dataset in a spreadsheet, a generated app at a permanent URL. The artifact lives in a purpose-built environment.",
        agents: ["Genspark", "Manus", "AutoGPT"],
        tradeoff:
          "Right for multi-modal agents. Risk: fragmentation — attention split across canvases, unclear where to look first.",
      },
    ],
  },
  {
    id: "multi-agent",
    number: "04",
    title: "Many Agents",
    intro:
      "As agents become capable of long background tasks, the question shifts from 'how do I control this agent?' to 'how do I manage a portfolio of agents running concurrently?'",
    patterns: [
      {
        number: "04.1",
        title: "Agent Inbox",
        desc: "Multiple agents managed like email: each run is a thread, each thread has a status, unread/pending items rise to the top. Borrows from the most universal async workflow people understand.",
        agents: ["Cursor", "Devin", "Continue.dev", "Claude Code"],
        tradeoff:
          "The most consumer-transferable pattern. Tasks go in, results come back, you deal with them when ready. Fails when agents need real-time oversight.",
      },
      {
        number: "04.2",
        title: "Sidebar Status Rail",
        desc: "Active agents surfaced as a persistent sidebar showing status at a glance without navigating away. The user monitors multiple agents while working in the main interface.",
        agents: ["Cursor", "Lovable", "Amazon Q", "Goose"],
        tradeoff:
          "Works well where the sidebar is already peripheral vision. Degrades on mobile and narrow windows.",
      },
      {
        number: "04.3",
        title: "Monitoring Dashboard",
        desc: "Full-page view showing all agents, execution state, resource usage, and outcomes — modeled on ops dashboards or Kubernetes pod views. Designed for oversight of many concurrent agents.",
        agents: ["ChatGPT Agent", "AutoGPT", "Microsoft Scout", "CrewAI Studio"],
        tradeoff:
          "Right for enterprise / DevOps contexts. Wrong for consumers. A dashboard implies a 'supervisor' role most individuals don't inhabit.",
      },
      {
        number: "04.4",
        title: "Graph / DAG View",
        desc: "Parallel agents and dependencies visualized as a directed acyclic graph — nodes for agents/tasks, edges for data flow. Active nodes pulse; completed ones gray out.",
        agents: ["LangGraph Studio", "AutoGPT", "Perplexity Computer", "CrewAI Studio"],
        tradeoff:
          "Most accurate mental model for how multi-agent systems actually work. Requires the user to think in graphs — a developer skill.",
      },
      {
        number: "04.5",
        title: "Schedules Page",
        desc: "A calendar or table of recurring and scheduled tasks — closer to cron than to chat. Tasks appear as entries with recurrence, next-run time, last result.",
        agents: ["ChatGPT Agent", "Claude Code", "Genspark"],
        tradeoff:
          "Consumer-legible if recurring and predictable. Wrong for ad hoc, one-shot tasks.",
      },
    ],
  },
  {
    id: "notifications",
    number: "05",
    title: "Bubble Up",
    intro:
      "The hardest problem in agent UX: when should an agent interrupt a human who is busy doing something else? The patterns here span zero-interruption to constant nagging.",
    patterns: [
      {
        number: "05.1",
        title: "OS / Native Push",
        desc: "The agent uses the OS notification system — macOS banners, Windows toasts, mobile push — to signal completion or required input. The user's phone or desktop speaks.",
        agents: ["Aider", "Claude Code", "Cline", "ChatGPT Agent"],
        tradeoff:
          "Most universal channel — reaches users regardless of focus. Risk is notification fatigue.",
      },
      {
        number: "05.2",
        title: "Slack / Chat Handoff",
        desc: "Completions, blockers, and approval requests route to a Slack channel or Teams thread. The agent participates in the team's existing communication surface.",
        agents: ["Cursor", "Devin", "Continue.dev", "Microsoft Scout"],
        tradeoff:
          "Right for team workflows. Creates a natural audit trail. Fails for personal/consumer use, clutters shared channels.",
      },
      {
        number: "05.3",
        title: "Status Dots",
        desc: "Urgency communicated through color and animation within the product — orange dot = needs input, red = failed, pulsing green = running. No external interruption.",
        agents: ["Cursor", "Claude Code", "Replit Agent", "Amazon Q"],
        tradeoff:
          "Low-interruption peripheral context for users with the panel in view. Useless if the user is in another app entirely.",
      },
      {
        number: "05.4",
        title: "Async Digest",
        desc: "Rather than interrupting, the system batches notifications into a periodic summary — daily digest, run-completion email, weekly report. One coherent summary, not a stream of pings.",
        agents: ["Jules", "CrewAI Studio", "AutoGPT", "Genspark"],
        tradeoff:
          "Respects attention. Right for scheduled/background tasks. Wrong when the agent is blocked and waiting for input.",
      },
      {
        number: "05.5",
        title: "Decision-Time Nudges",
        desc: "The agent surfaces lightweight alerts only when the user's input changes the outcome — at decision points, not at status changes. Precision interruption.",
        agents: ["Replit Agent", "Perplexity Computer", "Goose"],
        tradeoff:
          "Most precise model. Hard to implement. Misjudging 'decision point' over-notifies (training to ignore) or under-notifies (silent bad actions).",
      },
    ],
  },
];

export const principles = [
  {
    n: "01",
    title: "Show, don't log.",
    body: "The defining failure mode of developer-facing agent UIs is the activity stream. Aider's terminal log, SWE-agent's Trajectory Viewer, Cline's scrolling tool-call blocks — all accurate, all alienating. Chrome's agent layer should show what was accomplished, not how. 'Found 4 detailers near you, cheapest on Friday' is the right output. The tool calls that produced it are not.",
  },
  {
    n: "02",
    title: "One critical thing at a time.",
    body: "Replit's Decision-Time Guidance and Perplexity Computer's risk-tiered gates point to the same insight: most agent noise is not decision-relevant. When Chrome interrupts, it should surface exactly one thing — a specific action that needs approval, a choice between two options, a piece of information the agent couldn't find. Never a status update for its own sake.",
  },
  {
    n: "03",
    title: "Approvals over status updates.",
    body: "The difference between ChatGPT Agent's payment approval gate and Cursor's status color changes is the difference between 'I need you' and 'I thought you might want to know.' Chrome should interrupt for decisions, not for updates. A consumer doesn't need to know the agent is running; they need to know when it needs something or when it's done.",
  },
  {
    n: "04",
    title: "Trust through predictability, not transparency.",
    body: "Raw tool-call dumps and DAG visualizations (LangGraph Studio, AutoGPT) build trust with engineers by showing everything. They erode trust with consumers by suggesting the agent is out of control. Chrome should build trust through consistent behavior: the agent does what it said it would do, nothing more, at the time it said it would.",
  },
  {
    n: "05",
    title: "Async is the default mode.",
    body: "CrewAI's email-first HITL and Devin's agent inbox correctly assume the user is not watching. Chrome's agent layer should work on the assumption that agents run in the background, results appear when the user checks, and blocking on user presence is a design failure.",
  },
  {
    n: "06",
    title: "Consumer language, always.",
    body: "'Background agent,' 'checkpoint approval,' 'diff review,' 'worktree,' 'context window' — none of these should appear in a consumer interface. Chrome should describe agents in terms of tasks ('booking your appointment') and outcomes ('found 3 options'), never in terms of mechanisms.",
  },
];

export const antiPatterns = [
  {
    label: "Avoid",
    title: "Raw log streams",
    body: "Aider's repo map, SWE-agent's Thought/Action/Observation timeline, Cline's tool-call blocks with cost counters — transparent, accurate, wrong for consumers. Replace logs with narratives.",
  },
  {
    label: "Avoid",
    title: "Terminal aesthetics",
    body: "Dark monospace, ANSI colors, $ prompts, /command syntax. Aider, Claude Code, and Amazon Q's CLI all signal 'for engineers.' Chrome's agent surface should look like it belongs next to the address bar, not next to a code editor.",
  },
  {
    label: "Avoid",
    title: "Tool-call dumps",
    body: "AutoGen Studio's 'inner monologue' debug console and LangGraph's step-by-step graph debug mode are valuable to engineers, toxic to consumers. Calling them 'optional' is insufficient — they should not exist in the consumer surface.",
  },
  {
    label: "Avoid",
    title: "Token / cost counters",
    body: "Perplexity Computer's live credit ticker and Cline's real-time token cost are honest about consumption and right for prosumers managing spend. In a consumer context, displaying cost mid-task trains users to interrupt agents before they're done.",
  },
  {
    label: "Avoid",
    title: "Plan approval for every task",
    body: "Jules' mandatory plan review and Lovable's Plan Mode are right for consequential code changes. Wrong for a consumer asking an agent to 'find a good pizza place nearby' — a task that doesn't need a structured implementation plan reviewed in markdown.",
  },
  {
    label: "Avoid",
    title: "Dev jargon",
    body: "'Checkpoint,' 'diff,' 'worktree,' 'context window,' 'MCP tool,' 'interrupt handler' — none of these belong in consumer UI text. Use 'saved your progress,' 'changes to review,' 'working in parallel,' 'when the agent pauses.'",
  },
];

export const flowSteps = [
  {
    tag: "T+0s",
    title: "Magnus types in the omnibox",
    body: "'Find and book a car detailing appointment for my Mercedes this week.' Chrome's agent layer activates. A small confirmation popover drops below the bar: 'I'll search for Mercedes-certified detailers near you and check availability this week. I'll ask before I book anything.' Magnus taps Go. The popover closes; the omnibox indicator pulses gray.",
  },
  {
    tag: "T+2–90s",
    title: "Running in the background",
    body: "Magnus navigates normally — reads the news, checks email. The omnibox indicator pulses quietly. If he opens the Agent Side Panel, he sees one card: 'Find car detailing — Searching for detailers near Palo Alto.' He closes the panel and keeps working. No notifications, no interruptions.",
  },
  {
    tag: "Interrupt",
    title: "Agent needs input",
    body: "The omnibox indicator turns amber. A bottom-sheet slides up: 'I found 4 detailers. Which do you prefer for Friday afternoon?' Four cards — name, distance, price, earliest slot. Not a list of URLs, not a Google Maps embed, not raw business data. Magnus taps the second card. Sheet dismisses; indicator returns to gray.",
  },
  {
    tag: "Approval",
    title: "The booking gate",
    body: "A minute later, amber again. 'Ready to book at Prestige Auto Detailers — Friday, 2:00 PM, full exterior detail, $180. Book it?' Below: appointment details, a Book it button, a See other options link. Magnus taps Book it. The agent submits the form. Indicator turns green for three seconds, then neutral.",
  },
  {
    tag: "Done",
    title: "Completion lands once",
    body: "If Chrome is in the background, one OS notification arrives: 'Your detailing appointment is confirmed for Friday at 2pm at Prestige Auto Detailers. Added to your calendar.' No follow-up ping. Tapping through opens the Agent Side Panel where the card shows the confirmation number and calendar link.",
  },
  {
    tag: "Later",
    title: "In the new-tab inbox",
    body: "Magnus opens a new tab. The completed task sits at the top of the Agents section, green, with the appointment summary inline. He can tap Add to reminders or Archive. The card disappears from the inbox when he archives it. Two user decisions. Zero log streams. Zero tool-call summaries.",
  },
];
