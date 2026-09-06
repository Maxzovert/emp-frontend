"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { cn } from "@/utils/cn";

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduce;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 16,
  scale = 1,
}) {
  const ref = useRef(null);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (reduce || !ref.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y, scale: scale === 1 ? 0.98 : scale },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          delay,
          ease: "power3.out",
        },
      );
    }, ref);
    return () => ctx.revert();
  }, [delay, y, scale, reduce]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function Stagger({ children, className, delay = 0, stagger = 0.08 }) {
  const ref = useRef(null);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (reduce || !ref.current) return undefined;
    const items = ref.current.querySelectorAll("[data-stagger-item]");
    if (!items.length) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 14, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.45,
          delay,
          stagger,
          ease: "power3.out",
        },
      );
    }, ref);
    return () => ctx.revert();
  }, [delay, stagger, reduce]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}

export function StaggerItem({ children, className }) {
  const ref = useRef(null);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (reduce || !ref.current) return undefined;
    const el = ref.current;
    const onEnter = () =>
      gsap.to(el, { y: -3, duration: 0.2, ease: "power2.out" });
    const onLeave = () =>
      gsap.to(el, { y: 0, duration: 0.2, ease: "power2.out" });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reduce]);

  return (
    <div ref={ref} data-stagger-item className={className}>
      {children}
    </div>
  );
}

export function MotionPress({ children, className }) {
  const ref = useRef(null);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (reduce || !ref.current) return undefined;
    const el = ref.current;
    const onEnter = () =>
      gsap.to(el, { scale: 1.015, duration: 0.2, ease: "power2.out" });
    const onLeave = () =>
      gsap.to(el, { scale: 1, duration: 0.2, ease: "power2.out" });
    const onDown = () =>
      gsap.to(el, { scale: 0.985, duration: 0.12, ease: "power2.out" });
    const onUp = () =>
      gsap.to(el, { scale: 1.015, duration: 0.12, ease: "power2.out" });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mousedown", onDown);
    el.addEventListener("mouseup", onUp);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("mouseup", onUp);
    };
  }, [reduce]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
