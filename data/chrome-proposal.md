# Agent Management in Chrome: A Consumer Design Proposal

*A concrete proposal for bringing AI agent management into the Chrome browser for everyday users — not developers, not enterprise ops teams, but people who want things done without learning a new mental model.*

---

## Design Principles

The research across 24 agent interfaces reveals a clear fault line: everything built for developers is wrong for consumers, and most products sit firmly on the developer side. The following principles are derived from what works — and what fails — in the real world.

**1. Show, don't log.**
The defining failure mode of developer-facing agent UIs is the activity stream. [Aider's](https://aider.chat/docs/usage/modes.html) terminal-based linear log, [SWE-agent's](https://princeton-nlp.github.io/SWE-agent/usage/web_ui/) Trajectory Viewer, [Cline's](https://docs.cline.bot/core-workflows/plan-and-act) scrolling tool-call blocks — all accurate, all alienating to non-technical users. Chrome's agent layer should show what was accomplished, not how. "Found 4 detailers near you, cheapest on Friday" is the right output. The tool calls that produced it are not.

**2. One critical thing at a time.**
[Replit's](https://replit.com/blog/decision-time-guidance) Decision-Time Guidance and [Perplexity Computer's](https://github.com/asgeirtj/system_prompts_leaks/blob/main/Perplexity/perplexity-computer.md) risk-tiered confirmation gates point to the same insight: most agent noise is not decision-relevant. When Chrome must interrupt a user, it should surface exactly one thing — a specific action that needs approval, a choice between two options, a piece of information the agent couldn't find — never a status update for its own sake.

**3. Approvals over status updates.**
The difference between [ChatGPT Agent's](https://help.openai.com/en/articles/11752874-chatgpt-agent) "Approval Gate for payments" and [Cursor's](https://llmversus.com/coding-tools/cursor/background-agents) status color changes is the difference between "I need you" and "I thought you might want to know." Chrome should interrupt for decisions, not for updates. A consumer doesn't need to know the agent is running; they need to know when it needs something or when it's done.

**4. Trust through predictability, not transparency.**
Raw tool-call dumps, live terminal windows, and DAG visualizations ([LangGraph Studio](https://www.langchain.com/blog/langgraph-studio-the-first-agent-ide), [AutoGPT](https://www.datacamp.com/tutorial/autogpt-guide)) build trust with engineers by showing everything. They erode trust with consumers by suggesting the agent is out of control. Chrome should build trust through consistent behavior: the agent does what it said it would do, nothing more, at the time it said it would.

**5. Async is the default mode.**
[CrewAI's](https://docs.crewai.com/en/enterprise/guides/human-in-the-loop) email-first HITL and [Devin's](https://tianpan.co/blog/2026-04-23-async-agents-inbox-not-chat) agent inbox model correctly assume the user is not watching. Chrome's agent layer should work on the assumption that agents run in the background, results appear when the user checks, and blocking on user presence is a design failure.

**6. Consumer language, always.**
"Background agent," "checkpoint approval," "diff review," "worktree," "context window" — all of these appear in the tools surveyed and none of them should appear in a consumer interface. Chrome should describe agents in terms of tasks ("booking your appointment") and outcomes ("found 3 options"), never in terms of mechanisms.

---

## Core Surfaces

Five distinct surfaces, each serving a different moment in the user's attention cycle.

### Surface 1: Omnibox Integration

The address bar is the most attended surface in Chrome. When an agent is active, the right end of the omnibox gains a small persistent indicator — a subtle pulse, not a blinking badge — whose color communicates the agent's broad state: neutral gray for running, amber for waiting on the user, green for complete. Tapping or clicking this indicator opens a minimal popover (not a full panel) showing a single sentence: what the agent is currently doing. "Looking up availability at Mercedes-certified detailers near Palo Alto." Nothing else. No tool calls, no sub-steps.

When the agent needs something, the omnibox indicator turns amber and a soft bottom-sheet slides up from the bottom of the Chrome frame — a three-line card: the action the agent wants to take, a plain-language risk description ("This will share your calendar availability"), and two buttons: "Allow" and "Review first." This is the only moment Chrome breaks the user's current task. Everything else happens behind the indicator.

The omnibox approach solves the fundamental consumer problem: the user doesn't need a dedicated agent app, doesn't need to navigate to chatgpt.com/schedules or [Perplexity's](https://www.perplexity.ai/help-center/en/articles/11521526-perplexity-tasks) task console, doesn't need to remember where agents live. The omnibox is already where users look.

---

### Surface 2: Agent Side Panel

Chrome already supports side panels (Reading List, Bookmarks, Google Lens). The Agent panel follows this pattern: a narrow, persistent panel accessible from the toolbar, 360px wide, that shows all active and recent agents. 

The panel uses a card-based list — one card per agent — rather than any developer-derived pattern like the [LangGraph](https://www.langchain.com/blog/langgraph-studio-the-first-agent-ide) DAG or the [CrewAI](https://docs.crewai.com/en/enterprise/features/traces) Gantt chart. Each card shows: the task name the user chose (not a UUID), a one-sentence plain-language status, an elapsed time, and a single action button contextual to the card's state (Review, Allow, See results). Tapping a card expands it to show a brief narrative summary of what the agent has done so far — three to five bullet points in plain English — not a tool log.

Completed agents show their primary artifact or deliverable inline in the card: a list of bookings found, a document ready to download, a form that's been prefilled and is awaiting final submission. The artifact surfaces immediately in context rather than requiring the user to navigate somewhere else. This borrows from [Genspark's](https://www.genspark.ai/blog/genspark-multiagent-orchestration) specialized canvases and [Perplexity Computer's](https://aiagentskit.com/blog/perplexity-computer-guide/) artifact gallery, but simplified to a single expandable card.

The panel should hold a maximum of seven agents in the active or recent list. Beyond that, older completed agents archive automatically — visible via a "See past tasks" link that opens a full history view in a new tab.

---

### Surface 3: New Tab Agent Inbox

The new tab page already functions as a home base. A persistent "Agents" section at the top of the NTP — above the most-visited tiles — shows a brief inbox: tasks needing input appear first, highlighted in amber; completed tasks show green with their primary deliverable; running tasks show a progress indicator. The structure is borrowed directly from the email-inbox model that [Continue.dev's Mission Control](https://blog.continue.dev/introducing-mission-control-your-ai-dashboard/) and [Devin's](https://tianpan.co/blog/2026-04-23-async-agents-inbox-not-chat) agent inbox got right — items rise to the top by urgency, not by recency.

This surface solves the notification problem for ambient, background tasks. Users who check their phone and then open a browser tab naturally glance at the NTP. The inbox doesn't require a notification to be delivered — it's always there when the user looks.

The NTP inbox is read-only for running agents (you can tap to see status) and action-ready for blocked or complete agents (the primary CTA is front and center). It does not show logs, does not show step counts, does not show token usage. It shows outcomes.

---

### Surface 4: In-Page Action Overlays

When an agent is operating on the current page — filling a form, clicking through a booking flow, reading a page's content — Chrome shows a thin, dismissible banner at the top of the page: "Agent is working on this page." A small floating badge at the bottom-right shows real-time status. This is analogous to [ChatGPT Agent's](https://www.aioperator.com/blog/chatgpt-agent-mode-your-new-ai-assistant/) "Live Desktop" view but without the invasive full-screen takeover.

When the agent needs the user to manually handle something on the page — a CAPTCHA, a 2FA prompt, a field it cannot read — the overlay expands to a full-width amber banner with clear instructions: "Agent paused — please complete the verification below, then tap Continue." After the user completes the step, they tap Continue and the agent resumes. This is exactly the "Take Over" / "Hand Control Back" model that [Manus](https://manus.im/docs/features/cloud-browser) and [ChatGPT Agent](https://help.openai.com/en/articles/11752874-chatgpt-agent) pioneered, translated for the Chrome surface.

When the agent finishes a page-level action (successfully submitted a form, completed a booking), the overlay transitions to a completion card with a summary. It auto-dismisses after 5 seconds unless the user taps to keep it open.

---

### Surface 5: System Notifications + Lock Screen

For agents that run while Chrome is in the background or the device is idle, Chrome uses OS-native notifications sparingly — exactly as [Aider](https://aider.chat/docs/usage/notifications.html) and [Claude Code](https://www.linkedin.com/posts/evan-king-40072280_how-i-stopped-getting-distracted-while-claude-activity-7354182135668240384-7Mp1) do for completion and input-needed events, but for consumers. The rule is strict: one notification per agent per event type. "Your detailing appointment is booked for Friday at 2pm" — one notification, complete information, no follow-up pings. If the agent is blocked, one notification: "Magnus, your agent needs your input to finish the booking." Tapping it deep-links directly to the relevant approval card in the Agent Side Panel.

On the lock screen, agent notifications show the outcome or request but not the task details (privacy: another person shouldn't see "Booked appointment at Premium Detailing for your Mercedes S550"). The notification text is generic until the device is unlocked: "Your agent has a result ready" or "Your agent is waiting for you."

---

## What Artifacts Must Be Seen

Agent artifacts divide cleanly by whether the user needs to review them before they take effect, or whether they represent completed, already-done work.

**Always expand immediately (review before finalizing):**
- Form submissions with personal data (name, address, credit card)
- Calendar events being created
- Emails being drafted or sent
- Purchase flows before payment confirmation
- Account settings being changed

These mirror [Perplexity Computer's](https://github.com/asgeirtj/system_prompts_leaks/blob/main/Perplexity/perplexity-computer.md) `confirm_action` mandatory gates and [Microsoft Scout's](https://learn.microsoft.com/en-us/microsoft-scout/microsoft-scout-responsible-ai-faq) Preview-before-sensitive-action model. The user must see and explicitly approve before the artifact takes effect.

**Auto-expand on completion (result, not draft):**
- Lists of options found (3 available detailers, here are the options)
- Research summaries and comparisons
- Downloaded files (always surfaced as a card with a download/preview action)
- Generated documents ready for review

**Stay collapsed until requested:**
- Intermediate results the user didn't ask for (sub-steps, search queries run)
- Technical logs of any kind
- Model attribution ("This step was processed by Gemini 2.5")
- Cost and token usage (available in settings, not in the flow)

This taxonomy directly rejects the [Perplexity Computer](https://www.datacamp.com/tutorial/perplexity-computer) live credit consumption counter visible mid-task — right for prosumers tracking spend, wrong for consumers who should be focused on the outcome.

---

## When to Bubble Up: Decision Tree

The decision tree for interrupting a consumer user is simple. Chrome agents should interrupt when the answer to any of these is yes, in this order:

1. **Is this action irreversible?** (Send email, submit payment, delete data, publish publicly) → Always interrupt, always require explicit approval.
2. **Does the agent lack information only the user has?** (Password, 2FA, CAPTCHA, preference choice between two equal options) → Interrupt, request the specific missing piece, resume immediately after.
3. **Is the task complete?** → Notify once with the result. No follow-up ping.
4. **Did the task fail in a way the user can fix?** (No availability found, login rejected, rate limit hit) → Notify once with a plain-language description and a "Try differently" action.
5. **Is the task still running normally?** → Do not interrupt. Ever.

Rule 5 is the most violated rule in every tool surveyed. [AutoGen Studio](https://microsoft.github.io/autogen/dev/user-guide/autogenstudio-user-guide/usage.html) interrupts in "ALWAYS" mode for every agent turn. [Cline](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev) defaults to confirmation for every file write. Both are right for their developer audiences and catastrophically wrong for a consumer who asked an agent to find a parking spot.

---

## Managing Many Agents

A consumer running three to five agents simultaneously is not a "fleet operator." They are a person with several things they want done. The Chrome model for managing multiple agents should borrow from the best consumer patterns in the research and reject the enterprise ones.

**Borrow:** The email inbox model. [Devin's](https://tianpan.co/blog/2026-04-23-async-agents-inbox-not-chat) "async agents: inbox, not chat" insight is exactly right. Users don't watch agents run; they check in when convenient. The Agent Side Panel and NTP inbox both implement this pattern: results appear when you look, not when the agent finishes.

**Borrow:** The card status model from [Cursor's](https://docs.cursor.com/en/background-agent) Background Agent Sidebar — one row per agent, status at a glance, click to expand. Simple, scalable, doesn't require understanding parallelism.

**Reject:** DAG visualizations. [LangGraph Studio's](https://www.langchain.com/blog/langgraph-studio-the-first-agent-ide) graph is beautiful engineering UI that a consumer will never understand or need.

**Reject:** Dashboard grids. [AutoGPT's](https://pyshine.com/2026/04/20/autogpt-platform-continuous-ai-agents/) Monitoring Dashboard with latency metrics and resource consumption is an ops tool. Consumer agents do not need to be "operated."

**Reject:** Session UUIDs, thread IDs, or any identifier that isn't the user's own task description. A consumer named their task "book car detailing" — that's its name, not "session-7f3a4b."

When five agents are all running and two need input, Chrome prioritizes them in the Agent Side Panel by urgency (needs input > complete > running), not by start time. The two amber cards appear at the top; the user handles them in order. There is no "manage priority" metaphor because consumers don't want to manage anything — they want things to be done.

---

## Priority / Triage Model: Pin, Snooze, Archive

Three primitives, no more:

**Pin** — the user wants this agent's result visible at all times. Pinned agents appear at the top of the Side Panel and NTP inbox, persist across sessions, and do not auto-archive. Use case: "Track flights to Tokyo until I tell you to stop" — an ongoing agent the user checks daily.

**Snooze** — the user knows the agent is running but doesn't want to see it until it's done, or until a specific time. Snoozed agents are invisible in the Side Panel and NTP until the snooze expires or the task completes. No interruptions, no status updates. Use case: "I started a 2-hour research task before dinner; I don't want to see it until I'm done eating."

**Archive** — the task is done and the user no longer needs it in their active view. Archived agents move to history (accessible via "See past tasks" on the NTP) and are searchable but do not appear in active surfaces. Auto-archiving happens 7 days after completion unless pinned.

These three primitives are deliberately less than what [Genspark](https://www.genspark.ai/blog/genspark-ai-workspace-4) offers (Skills, Workflows, Drive, AI Inbox as separate surfaces) and intentionally simpler than [Microsoft Scout's](https://learn.microsoft.com/en-us/microsoft-scout/microsoft-scout-responsible-ai-faq) enterprise approval tiers. The goal is a consumer who can manage their agents by instinct, not by studying the interface.

---

## Anti-Patterns to Avoid

These patterns appear across the surveyed tools and should be explicitly excluded from a consumer Chrome design.

**Raw log streams.** [Aider's](https://aider.chat/docs/repomap.html) repository map, [SWE-agent's](https://princeton-nlp.github.io/SWE-agent/usage/web_ui/) Thought/Action/Observation timeline, [Cline's](https://docs.cline.bot/core-workflows/plan-and-act) tool-call blocks with cost counters — all are transparent, accurate, and wrong for consumers. Replace logs with narratives.

**Terminal aesthetics.** Dark background, monospace font, ANSI color codes, `$` prompts, `/command` syntax. [Aider](https://aider.chat/docs/usage/browser.html), [Claude Code](https://www.anthropic.com/product/claude-code), and [Amazon Q Developer's](https://github.com/gabrielkoo/amazon-q-developer-cli-webui) CLI all use terminal metaphors that signal "for engineers." Chrome's agent surface should look like it belongs next to the address bar, not next to a code editor.

**Dense tool-call dumps.** [AutoGen Studio's](https://microsoft.github.io/autogen/dev/user-guide/autogenstudio-user-guide/usage.html) "inner monologue" debug console and [LangGraph Studio's](https://www.langchain.com/blog/langgraph-studio-the-first-agent-ide) step-by-step graph debug mode are valuable to their audiences and toxic to consumers. Calling them "optional" is insufficient — they should not exist in the consumer surface at all.

**Token / cost counters in the main flow.** [Perplexity Computer's](https://www.datacamp.com/tutorial/perplexity-computer) live credit ticker and [Cline's](https://www.youtube.com/watch?v=KjqQC4AnJ1I) real-time token cost display are honest about consumption and appropriate for prosumers managing spend. In a consumer context, displaying cost mid-task trains users to interrupt agents before they're done — a behavior that defeats the entire value proposition.

**Plan approval for every task.** [Google Jules'](https://jules.google/docs/review-plan/) mandatory plan review before any code runs and [Lovable's](https://docs.lovable.dev/features/plan-mode) Plan Mode before Build Mode are right for consequential code changes. Wrong for a consumer asking an agent to "find a good pizza place nearby" — a task that doesn't need a structured implementation plan reviewed in markdown.

**Dev jargon in UI text.** "Checkpoint," "diff," "worktree," "context window," "MCP tool," "interrupt handler" — these terms appear routinely in [Claude Code](https://code.claude.com/docs/en/overview), [Continue.dev](https://docs.continue.dev), and [LangGraph](https://studio.langchain.com) interfaces. Chrome should use: "saved your progress," "changes to review," "working in parallel," "what the agent can see," "when the agent pauses," "waiting for your input."

---

## Concrete Example Flow: Magnus Books a Detailing Appointment

Magnus opens Chrome and types in the omnibox: "Find and book a car detailing appointment for my Mercedes this week." Chrome's agent layer activates.

**Immediate response (0–2 seconds).** The omnibox indicator turns a subtle pulsing gray. A small confirmation popover drops below the bar: "I'll search for Mercedes-certified detailers near you and check availability this week. I'll ask before I book anything." Magnus taps "Go." The popover closes; the indicator keeps pulsing.

**Running in the background (2–90 seconds).** Magnus navigates normally — reads the news, checks email. The omnibox indicator pulses quietly. If Magnus opens the Agent Side Panel, he sees one card: "Find car detailing appointment — Searching for detailers near Palo Alto." He closes the panel and keeps working. No notifications, no interruptions.

**First interrupt — agent needs input.** The omnibox indicator turns amber. A bottom-sheet slides up: "I found 4 detailers. Which do you prefer for Friday afternoon?" The sheet shows four cards — name, distance, price, earliest slot — not a list of URLs, not a Google Maps embed, not raw business data. Magnus taps the second card. The sheet dismisses; indicator returns to gray.

**Second interrupt — approval gate.** A minute later, amber again. Bottom-sheet: "Ready to book at Prestige Auto Detailers — Friday, 2:00 PM, full exterior detail, $180. Book it?" Below: the appointment details, a "Book it" button, and a "See other options" link. Magnus taps "Book it." The agent submits the form. The indicator turns green for three seconds, then returns to neutral.

**Completion notification.** If Magnus has Chrome in the background, one OS notification arrives: "Your detailing appointment is confirmed for Friday at 2pm at Prestige Auto Detailers. Confirmation added to your calendar." No follow-up ping. The notification taps through to the Agent Side Panel, where the card shows the confirmation number and calendar link.

**In the NTP inbox (later that day).** Magnus opens a new tab. The completed task sits at the top of the Agents section, green, with the appointment summary inline. He can tap "Add to reminders" or "Archive." The card disappears from the inbox when he archives it.

The entire interaction involved two user decisions — a preference between four options, and a final booking confirmation — and zero log streams, zero tool-call summaries, zero token counters, and zero dev jargon. The agent did the work. Chrome showed the decisions that only Magnus could make.
