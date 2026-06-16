"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function LoginInner() {
  const params = useSearchParams();
  const router = useRouter();
  const from = params.get("from") || "/";
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) {
      router.push(from);
      router.refresh();
    } else {
      setErr("Incorrect password.");
      setBusy(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "var(--bg)",
      }}
    >
      <form
        onSubmit={submit}
        style={{
          width: "100%",
          maxWidth: 440,
          padding: "48px",
          border: "1px solid var(--rule)",
          background: "var(--bg-2)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--ink-dim)",
            marginBottom: 18,
          }}
        >
          Field Report №1 · Private preview
        </div>
        <h1
          style={{
            fontFamily: "var(--f-display)",
            fontSize: 44,
            lineHeight: 1,
            letterSpacing: "-0.025em",
            margin: 0,
            color: "var(--ink)",
          }}
        >
          Enter the
          <br />
          <span style={{ color: "var(--accent)", fontStyle: "italic" }}>
            passphrase.
          </span>
        </h1>
        <p
          style={{
            marginTop: 20,
            fontSize: 14,
            lineHeight: 1.55,
            color: "var(--ink-dim)",
          }}
        >
          This is a private draft of the Agent UX Field Report. Type the
          passphrase to continue.
        </p>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          autoFocus
          autoComplete="current-password"
          placeholder="passphrase"
          style={{
            marginTop: 28,
            width: "100%",
            background: "transparent",
            border: "1px solid var(--rule)",
            borderBottom: "1px solid var(--ink-dim)",
            color: "var(--ink)",
            fontFamily: "var(--f-mono)",
            fontSize: 16,
            padding: "14px 16px",
            outline: "none",
            letterSpacing: "0.05em",
          }}
        />
        <button
          type="submit"
          disabled={busy || !pw}
          style={{
            marginTop: 20,
            width: "100%",
            background: "var(--accent)",
            color: "#0c0b08",
            border: "none",
            padding: "14px",
            fontFamily: "var(--f-mono)",
            fontSize: 12,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontWeight: 700,
            cursor: busy ? "default" : "pointer",
            opacity: busy || !pw ? 0.5 : 1,
            transition: "opacity 200ms",
          }}
        >
          {busy ? "Checking…" : "Enter"}
        </button>
        {err && (
          <div
            style={{
              marginTop: 16,
              color: "#ff7a55",
              fontSize: 13,
              fontFamily: "var(--f-mono)",
              letterSpacing: "0.05em",
            }}
          >
            {err}
          </div>
        )}
      </form>
    </main>
  );
}

export default function Login() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
