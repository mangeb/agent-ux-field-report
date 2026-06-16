import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent UX Field Report — How 24 AI agents surface, approve, and bubble up",
  description:
    "A design-studio teardown of 24 agent management interfaces — and a concrete proposal for bringing agent management into Chrome for consumers.",
  openGraph: {
    title: "Agent UX Field Report",
    description:
      "24 agents · 5 dimensions · 25 named patterns · 1 Chrome proposal.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&f[]=jetbrains-mono@400,500&f[]=gambarino@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
