"use client";

import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface LiquidMetalButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  label?: string;
  onClick?: () => void;
  size?: "default" | "lg";
  icon?: React.ReactNode;
}

/**
 * Liquid-metal button: a live chrome shader behind the label, ripple on click.
 * Falls back to a plain black button if WebGL is not available.
 */
export function LiquidMetalButton({
  label = "Get Started",
  onClick,
  size = "default",
  icon,
  className,
  disabled,
  ...rest
}: LiquidMetalButtonProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const shaderRef = useRef<HTMLDivElement>(null);
  const shaderMount = useRef<ShaderMount | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);
  const hovered = useRef(false);

  useEffect(() => {
    const el = shaderRef.current;
    if (!el) return;
    try {
      shaderMount.current = new ShaderMount(
        el,
        liquidMetalFragmentShader,
        {
          u_colorBack: [0, 0, 0, 1],
          u_colorTint: [1, 1, 1, 1],
          u_repetition: 4,
          u_softness: 0.5,
          u_shiftRed: 0.25,
          u_shiftBlue: 0.25,
          u_distortion: 0.1,
          u_contour: 0,
          u_angle: 45,
          u_shape: 0,
          u_isImage: false,
          u_scale: 1.4,
          u_rotation: 0,
          u_offsetX: 0,
          u_offsetY: 0,
          u_fit: 2,
          u_originX: 0.5,
          u_originY: 0.5,
          u_worldWidth: 0,
          u_worldHeight: 0,
        } as never,
        undefined,
        0.5,
      );
    } catch (error) {
      console.error("Liquid metal shader unavailable", error);
    }
    return () => {
      shaderMount.current?.dispose();
      shaderMount.current = null;
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    shaderMount.current?.setSpeed(2.4);
    setTimeout(() => shaderMount.current?.setSpeed(hovered.current ? 1 : 0.5), 350);

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const ripple = { x: e.clientX - rect.left, y: e.clientY - rect.top, id: rippleId.current++ };
      setRipples((p) => [...p, ripple]);
      setTimeout(() => setRipples((p) => p.filter((r) => r.id !== ripple.id)), 600);
    }
    onClick?.();
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      disabled={disabled}
      onMouseEnter={() => {
        hovered.current = true;
        shaderMount.current?.setSpeed(1);
      }}
      onMouseLeave={() => {
        hovered.current = false;
        shaderMount.current?.setSpeed(0.5);
      }}
      onClick={handleClick}
      aria-label={label}
      className={cn(
        "liquid-metal group relative isolate inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full bg-foreground text-background outline-none transition-transform duration-300 ease-out",
        "hover:scale-[1.03] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        size === "lg" ? "h-14 px-8 text-base" : "h-12 px-6 text-sm",
        className,
      )}
      {...rest}
    >
      {/* chrome shader */}
      <div ref={shaderRef} aria-hidden className="absolute inset-0 -z-20" />
      {/* inner dark pill so text stays legible; the chrome shows as a rim */}
      <span
        aria-hidden
        className="absolute inset-[3px] -z-10 rounded-full bg-foreground/90 shadow-[inset_0_1px_0_oklch(1_0_0/25%),inset_0_-2px_6px_oklch(0_0_0/50%)] transition-colors duration-300 group-hover:bg-foreground/75"
      />
      <span className="relative flex items-center gap-2 font-medium tracking-tight">
        {icon}
        {label}
      </span>
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden
          className="pointer-events-none absolute h-24 w-24 rounded-full bg-background/60 animate-[ripple-animation_0.6s_ease-out_forwards]"
          style={{ left: r.x, top: r.y }}
        />
      ))}
    </button>
  );
}
