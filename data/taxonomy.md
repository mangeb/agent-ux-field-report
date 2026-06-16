# Agent UX Design Pattern Taxonomy

*A cross-cutting analysis of 24 AI agent interfaces, organized by five dimensions of interaction design. Patterns are named for their dominant visual/behavioral metaphor and evaluated honestly — including tradeoffs.*

---

## 1. Task Lifecycle Visualization

How an agent communicates "what it's doing right now" is where most design decisions compound. Five distinct patterns have emerged across the 24 tools surveyed.

### 1.1 Live Activity Stream

The most common pattern. Every tool call, file read, search query, and model response is appended to a scrolling, chronological log. The stream is honest but unsparing — you see everything, including noise.

**Agents using it:** [Cursor](https://llmversus.com/coding-tools/cursor/background-agents) (their "Output Stream" logs "Searching codebase", "Running grep", "Applying edits" in sequence), [Cline](https://docs.cline.bot/core-workflows/plan-and-act) (vertical chat timeline of reasoning "thoughts" interspersed with tool execution blocks), [Aider](https://aider.chat/docs/usage/modes.html) (linear chat-to-commit timeline with real-time streaming text), [SWE-agent](https://princeton-nlp.github.io/SWE-agent/usage/web_ui/) (Trajectory Viewer showing Thought → Action → Observation in sequence), [AutoGen Studio](https://microsoft.github.io/autogen/dev/user-guide/autogenstudio-user-guide/usage.html) (live message streaming with control transition graph).

**Tradeoff:** Maximum transparency at the cost of signal-to-noise. Power users love it; anyone who isn't familiar with tool calls finds it overwhelming. Good for debugging, bad for trust-building with non-technical users.

---

### 1.2 Plan-Then-Execute Card

Before running anything, the agent generates and surfaces a structured plan — a numbered list of intended steps — and either waits for approval or launches into execution with the plan visible. This pattern separates "what will happen" from "what is happening."

**Agents using it:** [Google Jules](https://jules.google/docs/review-plan/) (mandatory plan review step before any code runs), [Lovable](https://docs.lovable.dev/features/plan-mode) (explicit "Plan Mode" that produces a structured markdown document the user can edit before flipping to "Build Mode"), [Claude Code](https://www.anthropic.com/product/claude-code) (generates a hierarchical implementation plan users can browse), [Perplexity Computer](https://www.perplexity.ai/changelog/improved-computer-models-and-enterprise-updates---may-4-2026) (Plan View before execution with proposed roadmap), [Amazon Q Developer](https://aws.amazon.com/blogs/aws/amazon-q-developer-now-generally-available-includes-new-capabilities-to-reimagine-developer-experience/) (generates a logical sequence of implementation steps users must sign off on).

**Tradeoff:** High trust for consequential tasks. The plan creates a shared mental model and a natural intervention point. Tradeoff is latency: adding a plan step before every execution slows down quick, well-understood tasks and trains users to click "approve" reflexively without reading.

---

### 1.3 Timeline Scrubber / State Replay

The most powerful pattern for debugging: every state checkpoint is saved, and users can scroll backward through time to inspect, replay, or branch from any prior moment.

**Agents using it:** [Cursor](https://cursor101.com/tutorial/learn-cursor-composer) (Snapshots allow rolling back the entire project state to any prior point), [Devin](https://ppaolo.substack.com/p/in-depth-product-analysis-devin-cognition-labs) (Timeline Slider at the bottom of the workspace for historical playback), [Manus](https://open.manus.ai/docs/v2/task-lifecycle) ("Time-Travel" scroll bar to jump back to any previous state of the agent's browser or terminal), [LangGraph Studio](https://www.langchain.com/blog/langgraph-studio-the-first-agent-ide) (History Panel listing every checkpoint; clicking any past step inspects or modifies state at that moment).

**Tradeoff:** Transformative for power users who think in diffs and state mutations. Irrelevant and confusing for consumers who just want the thing done. The pattern presupposes a mental model of the agent as a stateful machine — an abstraction that doesn't travel well outside developer contexts.

---

### 1.4 Three-Pane Workspace

A spatial layout that separates concerns: one pane for conversation, one for live agent environment (browser, terminal, code), and one for context, reasoning, or files. The user watches the agent "work" in the center while narrating in the left and providing materials on the right.

**Agents using it:** [Devin](https://docs.devin.ai/work-with-devin/devin-session-tools) (Chat / Session / multi-tab Workspace with Shell, Editor, Browser, Planner, Desktop), [Claude Code](https://www.youtube.com/watch?v=X4cFPdzcK7E) (three-pane Desktop/Web app with project list sidebar, central chat, and right-hand file preview), [Perplexity Computer](https://www.youreverydayai.com/ep-726-perplexity-computer-what-it-is-how-to-use-it-and-is-it-better-than-openclaw/) (left sidebar for navigation, central Task Console, right-side Chain of Thought panel), [v0 by Vercel](https://v0.app/docs/agentic-features#user-interface) (sidebar navigation, central chat, large right-side Live Preview panel).

**Tradeoff:** The right pattern for sustained collaboration on a complex artifact. Fails when there is no persistent artifact to inspect — you can't meaningfully "watch" a research or booking agent in a browser pane.

---

### 1.5 Kanban / Task Board

Tasks are cards in columns (Draft → Active → Ready → Done). The agent advances cards rather than appending to a stream. This pattern externalizes progress as position, not prose.

**Agents using it:** [Replit Agent](https://docs.replit.com/references/agent/task-lifecycle.md) (Task Board with Drafts, Active, Ready, and Done columns; each card shows title, status, and timestamp), [ChatGPT Agent](https://whop.com/blog/chatgpt-scheduling-tasks/) (Schedules dashboard at chatgpt.com/schedules tracking up to 10 active parallel tasks), [CrewAI Studio](https://docs.crewai.com/en/enterprise/features/traces) (Gantt-style Execution Timeline showing task durations visually).

**Tradeoff:** Excellent for tracking parallelism and completion status at a glance. Loses granularity — you can see that a task is "Active" but not what the agent just ran into. Better for project managers than for engineers who need to intervene in the middle of a run.

---

## 2. Human-in-the-Loop / Approval Models

No decision in agent UX is more consequential than when to interrupt the user. The patterns below represent fundamentally different philosophical bets about the cost of interruption vs. the cost of mistakes.

### 2.1 Per-Action Confirmation

Every tool use — every file write, every shell command, every API call — requires a human click before execution. The agent is essentially a very smart cursor controlled by the user.

**Agents using it:** [Cline](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev) (default: explicit manual confirmation for every file write, terminal command, and browser action), [Claude Code](https://www.anthropic.com/product/claude-code) ("cautious" default permission model, asks before any file edit or shell command), [Continue.dev](https://docs.continue.dev/ide-extensions/agent/how-to-customize) ("Ask First" default requiring manual confirmation for each tool call).

**Tradeoff:** Maximum safety; minimum throughput. Appropriate when the cost of an incorrect action is high and irreversible. Makes agents feel like spell-check rather than autonomy — the user stays in the loop so tightly they might as well be doing it themselves.

---

### 2.2 Checkpoint Approval

The agent operates autonomously within a phase and surfaces a single approval gate between major phases — plan-to-execute, code-to-commit, build-to-deploy. The user approves outcomes, not individual actions.

**Agents using it:** [Cursor](https://docs.cursor.com/en/composer) (every file change presented as a diff for "Accept" or "Reject"), [Google Jules](https://jules.google/docs/review-plan/) (checkpoint approval requiring plan sign-off before coding, then confirmation to publish PR/branch), [Amazon Q Developer](https://aws.amazon.com/blogs/aws/new-amazon-q-developer-agent-capabilities-include-generating-documentation-code-reviews-and-unit-tests/) ("/dev" generates a plan the user clicks "Generate Code" to proceed; "/test" offers View Diff → Accept/Reject), [Lovable](https://docs.lovable.dev/features/plan-mode) (Plan Mode approval before Build Mode execution).

**Tradeoff:** The right balance for most professional contexts. Fast enough to be useful; transparent enough to catch mistakes before they compound. The risk: approval fatigue. If every checkpoint looks the same, users rubber-stamp without reading.

---

### 2.3 Risk-Tiered Gates

The agent classifies actions by risk level and only interrupts for high-risk or irreversible ones. Routine, reversible actions run silently; sensitive actions (payments, deletes, external sends) surface a confirmation modal.

**Agents using it:** [ChatGPT Agent](https://help.openai.com/en/articles/11752874-chatgpt-agent) (auto-executes safe browsing/research; "Approval Gates" for payments, form submissions, sensitive data), [Microsoft Scout](https://learn.microsoft.com/en-us/microsoft-scout/microsoft-scout-responsible-ai-faq) (three-tier system: Auto-approve, Prompt, Deny; users can set "Always allow" for specific patterns), [Perplexity Computer](https://github.com/asgeirtj/system_prompts_leaks/blob/main/Perplexity/perplexity-computer.md) (mandatory confirm_action tool for financial transactions, deletes, sends, and public publishing; user-configurable risk thresholds), [v0 by Vercel](https://v0.app/docs/terminal-commands#permission-modes) (three-tier terminal permission system: Ask, Auto, Full).

**Tradeoff:** The most consumer-friendly model. Interruptions feel purposeful rather than compulsive. The difficulty is classifying risk correctly — an agent that misjudges a "safe" action can do real damage silently.

---

### 2.4 Full Autonomy with Interrupt

The agent runs without interruption by default. The user can break in at any time, but the default is to let the agent finish. Some systems let users "take over" input for specific blockers (CAPTCHAs, 2FA) and then hand back control.

**Agents using it:** [Manus](https://manus.im/docs/features/cloud-browser) (autonomous execution with "Take Over" for CAPTCHAs/SMS/2FA), [Devin](https://docs.devin.ai/work-with-devin/devin-session-tools) (autonomous planning with user able to take over Shell, Editor, or Browser at any time), [SWE-agent](https://princeton-nlp.github.io/SWE-agent/usage/web_ui/) (largely autonomous, loops until submission or fatal error; "Interactive Mode" enables gdb-style debugging), [Aider](https://aider.chat/docs/usage/modes.html) (auto-commits every successful edit; user can /undo immediately).

**Tradeoff:** Highest throughput; lowest user burden during the run. Appropriate for long-running tasks where interrupting every step would defeat the purpose. Requires trust that the agent's autonomous judgment is correct — a bet that often fails in edge cases and novel contexts.

---

### 2.5 Email-First / Async Approval

Approvals do not require the user to be present in the product. The system sends an email or Slack message summarizing the pending decision; the user can reply inline or click a link to approve without loading the full interface.

**Agents using it:** [CrewAI Studio](https://docs.crewai.com/en/enterprise/guides/human-in-the-loop) (email-first HITL: responders reply directly to notification emails to provide feedback or approve actions), [Devin](https://docs.devin.ai/release-notes/2024) (email alerts for successes/failures; Slack in-thread updates for status and feedback requests), [Microsoft Scout](https://www.2tolead.com/insights/what-is-microsoft-scout-the-always-on-autopilot-agent-for-microsoft-365) (proactively joins Teams chats or Outlook threads as a direct participant to signal status or request input).

**Tradeoff:** The right model for background, hours-long tasks where the user is not watching a screen. Removes the assumption that "agent running" means "user present." The risk is decision latency — an approval that takes 4 hours to come through may block work that could have been parallelized.

---

## 3. Artifact Surfacing

When an agent produces something — a file, a diff, a deployed URL, a report — how and when it appears determines whether users trust and use the output.

### 3.1 Inline Diff Gallery

Code changes are presented as a grouped, syntax-highlighted diff view — green for additions, red for deletions — attached to the conversation. Multiple files are organized into a gallery or accordion that the user steps through.

**Agents using it:** [Cursor](https://docs.cursor.com/en/composer) (Diff Gallery grouping changes by New, Modified, Deleted with AI-generated explanations), [Amazon Q Developer](https://aws.amazon.com/blogs/aws/new-amazon-q-developer-now-generally-available-includes-new-capabilities-to-reimagine-developer-experience/) (inline diff views and dedicated side tabs; Accept/Reject for individual parts), [Cline](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev) (native VS Code diff editor for review, modify, or revert before saving), [Google Jules](https://jules.google/docs/code/) (mini-diffs in activity feed; expanded full-screen diff editor with "Stacked Diff" layout).

**Tradeoff:** The right artifact model for code. Diffs speak the language developers already use. Completely wrong for consumer contexts where "here's what changed in the codebase" means nothing.

---

### 3.2 Live Preview + Code Tabs

Artifacts are surfaced in a split or tabbed view with an interactive preview running alongside the source. Users can see the output as a functioning thing — a rendered page, a live app — rather than as text.

**Agents using it:** [v0 by Vercel](https://v0.app/docs/agentic-features#real-time-feedback) (Live Preview in an isolated Vercel Sandbox VM, side-by-side with a Code Editor), [Bolt.new](https://support.bolt.new/building/intro-bolt) (integrated Code View with file explorer and real-time live preview window), [Lovable](https://docs.lovable.dev/features/agent-mode) (dual-pane view: conversation on one side, live preview/editor on the other with Project Comment Pins anchored to specific UI elements), [Replit Agent](https://docs.replit.com/references/design/canvas) (Infinite Design Canvas, a Figma-like board where interactive previews live side-by-side with design mockups).

**Tradeoff:** Transforms the artifact from abstract code into something concrete and reviewable. Requires a runnable artifact — this pattern only works when the output is a web app or interface.

---

### 3.3 Deliverable Card at End

The agent completes its run, then surfaces the output as a downloadable file, structured report, or summary card at the close of the conversation. No inline preview, no streaming artifact — just a clean endpoint.

**Agents using it:** [ChatGPT Agent](https://www.youreverydayai.com/chatgpt-agent-mode-overview-real-use-cases-and-3-worthwhile-tips/) (spreadsheets, presentations, and PDFs appear as downloadable files at the end of a task or within the chat transcript), [Genspark](https://www.genspark.ai/blog/genspark-multiagent-orchestration) (Deep Research results as comprehensive reports with mind maps and data tables at completion), [Perplexity Computer](https://marketingagent.blog/2026/03/12/tutorial-5-marketing-workflows-with-perplexity-computer/) (structured files — PDF, Excel, Python scripts — appear as downloadable tiles within the thread at task end).

**Tradeoff:** Clean and consumer-friendly. Removes the anxiety of watching the agent work. Tradeoff is that users can't intervene during generation if the output is going in the wrong direction.

---

### 3.4 Auto-PR / Auto-Branch

The agent pushes its work to version control and creates a pull request or branch automatically. The artifact surfaces in the developer's existing workflow — GitHub, GitLab — rather than inside the agent tool.

**Agents using it:** [Claude Code](https://www.anthropic.com/product/claude-code) (automates GitHub PR and commit creation), [Devin](https://cognition.ai/blog/devin-101-automatic-pr-reviews-with-the-devin-api) (PRs pushed to GitHub/GitLab; Devin Review does automated quality passes on PRs before human review), [Google Jules](https://jules.google/docs/code/) (direct GitHub PR/branch creation with visual verification via rendered UI screenshots), [Continue.dev](https://betterstack.com/community/guides/ai/continue-dev-ai/) (background agents surface artifacts as GitHub Pull Requests).

**Tradeoff:** Integrates seamlessly with existing engineering workflow. Has zero relevance for consumer use cases and requires users to treat GitHub as the primary artifact surface, which many developers don't consistently do.

---

### 3.5 Specialized Canvas / Hub

Different artifact types get their own dedicated surface — a presentation in a slide viewer, a dataset in a spreadsheet-like interface, a generated app deployed to a permanent URL. The artifact lives in a purpose-built environment rather than a generic preview pane.

**Agents using it:** [Genspark](https://www.genspark.ai/blog/genspark-ai-workspace-4) (AI Slides in a presentation viewer, AI Sheets in a spreadsheet interface, AI Docs in a document editor, AI Inbox for email artifacts), [Manus](https://manus.im/features/webapp) (deployed websites at permanent public URLs; clean codebase exports; live analytics dashboards), [AutoGPT](https://agpt.co/docs/platform/using-the-platform/agent-library) (dedicated "Agent Outputs" pane consolidating structured results with rich cards or inline previews).

**Tradeoff:** The right model for multi-modal, multi-output agents. Requires significant design investment to create coherent specialized views. Risk: fragmentation — the user's attention is split across multiple canvases, and it's unclear where to look first.

---

## 4. Multi-Agent / Parallelism Management

As agents become capable of running long background tasks, the question shifts from "how do I control this agent?" to "how do I manage a portfolio of agents running concurrently?"

### 4.1 Agent Inbox

Multiple agents are managed like an email inbox: each run is a thread, each thread has a status, and unread/pending items rise to the top. The metaphor borrows from the most universal async workflow people already understand.

**Agents using it:** [Cursor](https://docs.cursor.com/en/background-agent) (Background Agent Sidebar: list view where each agent is a row showing prompt, elapsed time, step count, cost, and live status indicator), [Devin](https://tianpan.co/blog/2026-04-23-async-agents-inbox-not-chat) (Agent Inbox for managing multiple async runs), [Continue.dev](https://blog.continue.dev/introducing-mission-control-your-ai-dashboard/) (Mission Control Inbox as a unified queue for Sentry alerts, Snyk vulnerabilities, CI failures, and agent runs), [Claude Code](https://www.youtube.com/watch?v=3Oc9W37-qAM) (hybrid interface managing sessions like email/task threads).

**Tradeoff:** The most consumer-transferable pattern. The inbox metaphor normalizes async agents — tasks go in, results come back, you deal with them when ready. Fails when agents need real-time oversight, since an inbox implies you're not watching.

---

### 4.2 Sidebar List / Status Rail

Active agents are surfaced as a persistent sidebar or panel that shows status at a glance without navigating away. The user can monitor multiple agents while working in the main interface.

**Agents using it:** [Cursor](https://llmversus.com/coding-tools/cursor/background-agents) (dashboard-style list view with status badges and timers in the sidebar), [Lovable](https://docs.lovable.dev/features/agent-mode) (visible Prompt Queue showing pending, processing, and completed tasks), [Amazon Q Developer](https://dev.to/dmitriy_trunov_9a09a497b1/begin-your-journey-with-amazon-q-developer-4dp) (tabbed layout in IDE sidebar; up to 10 concurrent tabs each preserving context), [Goose](https://goose-docs.ai/docs/guides/desktop-navigation) (customizable sidebar with Tile or List styles that can be positioned on any edge).

**Tradeoff:** Works well in the IDE context where the sidebar is already the user's peripheral vision. Degrades on mobile or in narrow-window contexts. Shows status but doesn't help users understand what to do with it.

---

### 4.3 Dashboard Grid / Monitoring Board

A dedicated full-page view showing all agents, their execution state, resource usage, and outcomes — modeled on ops dashboards or Kubernetes pod views. Designed for oversight of many concurrent agents.

**Agents using it:** [ChatGPT Agent](https://whop.com/blog/chatgpt-scheduling-tasks/) (Schedules dashboard at chatgpt.com/schedules tracking up to 10 parallel tasks), [AutoGPT](https://pyshine.com/2026/04/20/autogpt-platform-continuous-ai-agents/) (Monitoring Dashboard providing bird's-eye view of active executions, latency, and resource consumption), [Microsoft Scout](https://www.microsoft.com/en-us/dynamics-365/blog/it-professional/2025/10/08/try-the-ai-agent-activity-feed-in-dynamics-365-customer-service/) (Agent Activity Feed: inbox-style UX with vertical timelines and activity maps; three-column portal showing Workforce Agents, Responses, and RPI Scores), [CrewAI Studio](https://docs.crewai.com/en/enterprise/features/agent-control-plane/monitoring) (Sankey diagram in monitoring dashboard highlighting automation health; Gantt-chart Execution Timeline).

**Tradeoff:** Right for enterprise and DevOps contexts where agents are infrastructure to be managed. Wrong for consumers. A dashboard implies a user role — "supervisor" — that most individuals don't inhabit when running personal agents.

---

### 4.4 Graph / DAG Visualization

Parallel agents and their dependencies are visualized as a directed acyclic graph — nodes for agents/tasks, edges for data flow. Active nodes pulse; completed ones go gray.

**Agents using it:** [LangGraph Studio](https://www.langchain.com/blog/langgraph-studio-the-first-agent-ide) (live-updating graph topology where the active node pulses; branching paths for fan-out/fan-in parallelism), [AutoGPT](https://www.datacamp.com/tutorial/autogpt-guide) (canvas-based graph editor with nodes as "blocks" connected by "wires"; active blocks pulse or change color by state), [Perplexity Computer](https://aiagentskit.com/blog/perplexity-computer-guide/) (Task Graph showing execution sequences and model dependencies as interactive nodes), [CrewAI Studio](https://docs.crewai.com/en/enterprise/features/crew-studio) (node-and-edge visual canvas; AI Thoughts, Canvas, and Resources panels).

**Tradeoff:** Provides the most accurate mental model for how multi-agent systems actually work. Requires the user to think in graphs, which is a developer skill. Beautiful to look at in demos; not what a consumer needs when their grocery-shopping agent hits a CAPTCHA.

---

### 4.5 Schedules Page

A calendar or table of recurring and scheduled agent tasks — closer to a cron interface than a chat interface. Tasks appear as entries with recurrence, next-run time, and last-result.

**Agents using it:** [ChatGPT Agent](https://www.linkedin.com/posts/alliekmiller_breaking-openai-has-officially-released-activity-7351658369767620608-VJC_) (Schedules dashboard allowing multiple "workers" in separate chat threads to run concurrently), [Claude Code](https://www.buildfastwithai.com/blogs/claude-code-desktop-redesign-2026) (Routines for scheduled recurring agentic tasks, e.g., daily summaries, security audits), [Genspark](https://note.com/deep_weasel3376/n/n36070c03b9e3) (Daily Dashboard summarizing unread emails and upcoming meetings; completion notifications for long-running tasks).

**Tradeoff:** Consumer-legible if the task is recurring and predictable (daily summary, weekly report). Entirely wrong for ad hoc, one-shot tasks. Works best when agents are configured as habits rather than commands.

---

## 5. Notification Bubble-Up

The hardest problem in agent UX: when should an agent interrupt a human who is busy doing something else? The patterns here span from zero-interruption to constant nagging.

### 5.1 OS / Native Notifications

The agent uses the operating system's notification system — macOS banners, Windows toast notifications, Android/iOS push — to signal completion or required input. The user's phone or desktop speaks.

**Agents using it:** [Aider](https://aider.chat/docs/usage/notifications.html) (OS-native notifications via `--notifications` flag; `terminal-notifier` on macOS, `notify-send` on Linux, PowerShell on Windows; supports custom `--notifications-command` including text-to-speech), [Claude Code](https://www.linkedin.com/posts/evan-king-40072280_how-i-stopped-getting-distracted-while-claude-activity-7354182135668240384-7Mp1) (macOS/Windows native OS notifications; browser notifications; desktop app badges), [Cline](https://www.deployhq.com/guides/cline) (native system notification toasts when a long-running task completes or requires approval), [ChatGPT Agent](https://www.linos.ai/technology/chatgpt-agent-mode-guide-2026-how-to-use-setup/) (push notifications on mobile/desktop; email alerts; in-app badges).

**Tradeoff:** The most universal notification channel — reaches users regardless of what app is in focus. Risk is notification fatigue. An agent that fires OS notifications for every step trains the user to dismiss without reading.

---

### 5.2 Slack / Chat Handoff

Completions, blockers, and approval requests route to a Slack channel or Teams thread. The agent participates in the team's existing communication surface.

**Agents using it:** [Cursor](https://docs.cursor.com/en/background-agent) (Background Agent completions and blockers mirrored to Slack), [Devin](https://docs.devin.ai/release-notes/2024) (Slack notifications in-thread; email alerts for successes/failures), [Continue.dev](https://docs.continue.dev/changelog) (real-time alerts via Slack and GitHub mentions; agents triggered directly from conversation threads via @Continue), [Microsoft Scout](https://www.2tolead.com/insights/what-is-microsoft-scout-the-always-on-autopilot-agent-for-microsoft-365) (proactively joins Teams chats as a direct participant).

**Tradeoff:** Right for team workflows where the agent's output affects multiple people. Creates a natural audit trail in Slack. Fails for personal/consumer use cases where there is no team Slack, and clutters shared channels when agents are noisy.

---

### 5.3 Status Dots / In-App Color Signal

Urgency is communicated through color changes and animated indicators within the product rather than through external channels. Orange dot = needs input. Red = failed. Pulsing green = running.

**Agents using it:** [Cursor](https://llmversus.com/coding-tools/cursor/background-agents) (orange/red for "needs input" or "failed" in the agent panel), [Claude Code](https://github.com/KyleAMathews/claude-code-ui/blob/main/spec.md) (animated status dots: pulsing yellow for thinking, breathing blue for input), [Replit Agent](https://gln75.com/no/blog/replit-agent-hands-four-new-features-explained) (dynamic icons on the task board — blue spinning state for active tasks), [Amazon Q Developer](https://pkg.go.dev/github.com/izll/agent-session-manager@v0.7.8) (orange activity indicators for processing, cyan for waiting on user input).

**Tradeoff:** Low-interruption, always-present context for users who have the agent's panel in peripheral view. Completely useless for background tasks — if the agent is running while the user is in another app, a color change in a tab they're not looking at communicates nothing.

---

### 5.4 Email Digest / Async Summary

Rather than interrupting immediately, the system batches notifications into a periodic summary — daily digest, run-completion email, weekly report. The user gets one coherent summary instead of a stream of pings.

**Agents using it:** [Google Jules](https://jules.google/docs/suggested-tasks/) (periodic email summaries for suggested tasks), [CrewAI Studio](https://docs.crewai.com/en/enterprise/guides/human-in-the-loop) (email-first HITL with direct-reply approval; Alert Configuration Panel for deadline-based notifications), [AutoGPT](https://github.com/Significant-Gravitas/AutoGPT/releases) (email notifications for failed tasks or run completions configurable in agent settings), [Genspark](https://note.com/deep_weasel3376/n/n36070c03b9e3) (completion notifications via email and in-app alerts for long-running Deep Research tasks).

**Tradeoff:** Respects the user's attention. The right model for scheduled/background tasks. Completely wrong when the agent is blocked and waiting for input — an approval that waits for tomorrow's email digest has destroyed the task's utility.

---

### 5.5 Decision-Time Nudges

Rather than notifying on completion or failure, the agent surfaces lightweight contextual alerts exactly when the user's input changes the outcome — at decision points, not at status changes.

**Agents using it:** [Replit Agent](https://replit.com/blog/decision-time-guidance) ("Decision-time guidance" — lightweight situational notifications that appear when the agent detects errors, "doom loops," or high-risk changes), [Perplexity Computer](https://www.perplexity.ai/help-center/en/articles/11521526-perplexity-tasks) (banners/modals when human input is required; high-risk approval checkpoints), [Goose](https://goose-docs.ai/docs/guides/logs/#system-logs) (in-app security alerts labeled `SEC-{uuid}` requiring explicit allow/deny when adversary detection fires).

**Tradeoff:** The most precise interruption model — only fires when a human decision actually matters. Hard to implement correctly. An agent that misjudges what constitutes a "decision point" either over-notifies (training users to ignore) or under-notifies (letting bad actions proceed silently).
