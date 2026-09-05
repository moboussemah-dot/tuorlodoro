import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GradientBlurBgProps {
  children?: ReactNode;
  className?: string;
}

/** Warm golden gradient grid background with soft blurred glow. */
export const Component = ({ children, className }: GradientBlurBgProps) => {
  return (
    <div className={cn("relative w-full overflow-hidden bg-background", className)}>
      {/* Golden gradient grid */}
      <div
        className="pointer-events-none absolute inset-0 dotted-bg"
        style={{
          maskImage: "radial-gradient(ellipse 80% 70% at 70% 30%, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 70% 30%, black 20%, transparent 70%)",
        }}
      />
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-[36rem] w-[36rem] rounded-full bg-yolk/25 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 left-[-10%] h-[28rem] w-[28rem] rounded-full bg-yolk-deep/20 blur-[140px]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const GradientBlurBg = Component;
