"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";

const script = [
  {
    role: "user",
    text: "Who works in Engineering?",
  },
  {
    role: "assistant",
    text: "Two people match Engineering right now — Ada Lovelace (Active) and Grace Hopper (Away).",
  },
  {
    role: "user",
    text: "Show workforce overview",
  },
  {
    role: "assistant",
    text: "28 teammates across 6 departments. 24 active · strongest concentration in Engineering.",
  },
];

export function DashboardPreview() {
  const shellRef = useRef(null);
  const [reduce, setReduce] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [typed, setTyped] = useState("");
  const [typingRole, setTypingRole] = useState(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduce || !shellRef.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        shellRef.current,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.15 },
      );
    }, shellRef);
    return () => ctx.revert();
  }, [reduce]);

  useEffect(() => {
    if (reduce) {
      setVisibleCount(script.length);
      setTyped("");
      setTypingRole(null);
      return undefined;
    }

    let cancelled = false;
    let timer;

    const wait = (ms) =>
      new Promise((r) => {
        timer = setTimeout(r, ms);
      });

    const run = async () => {
      while (!cancelled) {
        setVisibleCount(0);
        for (let i = 0; i < script.length; i += 1) {
          if (cancelled) return;
          setTypingRole(script[i].role);
          setTyped("");
          const message = script[i].text;
          for (let c = 0; c <= message.length; c += 1) {
            if (cancelled) return;
            setTyped(message.slice(0, c));
            await wait(script[i].role === "user" ? 28 : 18);
          }
          setTypingRole(null);
          setTyped("");
          setVisibleCount(i + 1);
          await wait(i === script.length - 1 ? 1600 : 750);
        }
        await wait(600);
      }
    };

    run();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reduce]);

  return (
    <div ref={shellRef} className="relative w-full">
      <div
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] opacity-80 blur-2xl sm:-inset-10"
        style={{
          background:
            "radial-gradient(circle at 40% 30%, color-mix(in srgb, var(--emp-primary) 22%, transparent), transparent 65%)",
        }}
        aria-hidden
      />

      <div className="landing-preview-shell relative overflow-hidden rounded-2xl border border-border bg-surface/95 backdrop-blur-sm">
        <div className="landing-shimmer absolute inset-x-0 top-0 h-px" aria-hidden />

        <div className="flex items-center gap-2 border-b border-border bg-surface-soft/80 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-error/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning" />
          <span className="h-2.5 w-2.5 rounded-full bg-success" />
          <span className="ml-2 font-mono text-[11px] text-muted">
            assistant · grounded on directory
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase">
            <span className="relative flex h-1.5 w-1.5">
              <span className="landing-pulse-ring absolute inset-0 rounded-full bg-primary" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Live
          </span>
        </div>

        <div className="grid gap-0 lg:grid-cols-[11rem_1fr]">
          <aside className="hidden border-r border-border bg-surface-soft/60 p-4 lg:block">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-[11px] font-bold text-on-primary">
                EA
              </span>
              <div>
                <p className="text-xs font-semibold text-foreground">EmployeeAI</p>
                <p className="text-[10px] text-muted">Workspace</p>
              </div>
            </div>
            {["Overview", "Assistant", "Employees", "Analytics"].map(
              (item, i) => (
                <div
                  key={item}
                  className={cn(
                    "mb-1 rounded-lg px-2.5 py-2 text-[11px] font-medium",
                    i === 1
                      ? "bg-primary text-on-primary"
                      : "text-muted",
                  )}
                >
                  {item}
                </div>
              ),
            )}
          </aside>

          <div className="space-y-4 p-4 sm:p-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="font-display text-sm font-semibold text-foreground">
                  AI Assistant
                </p>
                <p className="mt-0.5 text-[11px] text-muted">
                  Answers stay tied to your employee data
                </p>
              </div>
              <Badge tone="success" dot className="text-[10px]">
                Streaming
              </Badge>
            </div>

            <div className="min-h-[11.5rem] space-y-3 rounded-xl border border-border bg-background/80 p-3 sm:min-h-[13rem] sm:p-4">
              {script.slice(0, visibleCount).map((msg, idx) => (
                <div
                  key={`${msg.role}-${idx}`}
                  className={cn(
                    "max-w-[92%] rounded-xl px-3 py-2 text-[12px] leading-relaxed sm:text-[13px]",
                    msg.role === "user"
                      ? "ml-auto bg-primary text-on-primary"
                      : "bg-surface-elevated text-body ring-1 ring-border",
                  )}
                >
                  {msg.text}
                </div>
              ))}

              {typingRole ? (
                <div
                  className={cn(
                    "max-w-[92%] rounded-xl px-3 py-2 text-[12px] leading-relaxed sm:text-[13px]",
                    typingRole === "user"
                      ? "ml-auto bg-primary text-on-primary"
                      : "bg-surface-elevated text-body ring-1 ring-border",
                  )}
                >
                  {typed || (
                    <span className="inline-flex gap-1 py-0.5">
                      <span className="chat-typing-dot h-1.5 w-1.5 rounded-full bg-current" />
                      <span className="chat-typing-dot h-1.5 w-1.5 rounded-full bg-current" />
                      <span className="chat-typing-dot h-1.5 w-1.5 rounded-full bg-current" />
                    </span>
                  )}
                  {typed ? <span className="chat-caret ml-0.5">|</span> : null}
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/70 px-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-[12px] font-medium text-foreground">
                  Ada Lovelace
                </p>
                <p className="truncate text-[10px] text-muted">
                  Engineering · Active · matched in last reply
                </p>
              </div>
              <Badge tone="success" dot className="shrink-0 text-[9px]">
                Online
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
