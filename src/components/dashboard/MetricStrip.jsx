"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { cn } from "@/utils/cn";

export function MetricStrip({ items = [], className }) {
  const ref = useRef(null);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
  }, []);

  useEffect(() => {
    if (reduce || !ref.current) return undefined;
    const cards = ref.current.querySelectorAll("[data-metric]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.05,
          ease: "power3.out",
        },
      );
    }, ref);
    return () => ctx.revert();
  }, [reduce, items]);

  return (
    <div
      ref={ref}
      className={cn("grid grid-cols-2 gap-4 md:grid-cols-4", className)}
    >
      {items.map((item) => (
        <div
          key={item.label}
          data-metric
          className="rounded-lg border border-border bg-surface px-5 py-5 md:px-6"
        >
          <p className="text-caption text-muted">{item.label}</p>
          <p className="mt-3 text-stat text-3xl md:text-4xl">{item.value}</p>
          {item.hint ? (
            <p className="mt-2 text-xs text-muted">{item.hint}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
