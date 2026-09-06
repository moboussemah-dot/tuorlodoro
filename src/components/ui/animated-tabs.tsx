"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface AnimatedTabsProps {
  tabs: { label: string; value?: string }[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

/**
 * Pill tabs with a sliding clip-path highlight. Works uncontrolled or
 * controlled through `value` / `onChange`.
 */
export function AnimatedTabs({ tabs, value, onChange, className }: AnimatedTabsProps) {
  const [internal, setInternal] = useState(tabs[0]?.value ?? tabs[0]?.label);
  const active = value ?? internal;
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  const select = (v: string) => {
    setInternal(v);
    onChange?.(v);
  };

  useEffect(() => {
    const container = containerRef.current;
    const el = activeTabRef.current;
    if (!container || !el) return;
    const { offsetLeft, offsetWidth } = el;
    const clipLeft = offsetLeft;
    const clipRight = offsetLeft + offsetWidth;
    container.style.clipPath = `inset(0 ${(100 - (clipRight / container.offsetWidth) * 100).toFixed(2)}% 0 ${((clipLeft / container.offsetWidth) * 100).toFixed(2)}% round 999px)`;
  }, [active, tabs]);

  return (
    <div className={cn("relative inline-flex rounded-full border border-border bg-card p-1", className)}>
      {/* highlighted layer */}
      <div
        ref={containerRef}
        aria-hidden
        className="absolute inset-1 z-10 overflow-hidden bg-foreground transition-[clip-path] duration-300 ease-out"
        style={{ clipPath: "inset(0 100% 0 0 round 999px)" }}
      >
        <div className="relative flex w-full">
          {tabs.map((tab) => (
            <span
              key={tab.label}
              className="flex h-8 items-center whitespace-nowrap rounded-full px-4 text-sm font-medium text-background"
            >
              {tab.label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative flex w-full">
        {tabs.map((tab) => {
          const v = tab.value ?? tab.label;
          const isActive = active === v;
          return (
            <button
              key={tab.label}
              type="button"
              ref={isActive ? activeTabRef : null}
              onClick={() => select(v)}
              className="flex h-8 cursor-pointer items-center whitespace-nowrap rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
