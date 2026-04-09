import type { Metadata } from "next";
import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "TUF Wall Calendar — Interactive Calendar Component",
  description: "A premium, interactive wall calendar built from scratch for the TakeUforward Frontend Engineering Challenge.",
  keywords: ["calendar", "interactive", "wall calendar", "react", "next.js"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] antialiased transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
