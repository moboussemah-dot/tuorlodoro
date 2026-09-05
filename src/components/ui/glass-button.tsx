import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassButtonVariants = cva(
  "glass-button-shell relative isolate inline-flex cursor-pointer items-center justify-center rounded-full transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        default: "text-base font-medium",
        sm: "text-sm font-medium",
        lg: "text-lg font-medium",
        icon: "h-10 w-10",
      },
      variant: {
        glass: "text-foreground",
        solid: "glass-button-solid text-primary-foreground",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "glass",
    },
  },
);

const glassButtonTextVariants = cva(
  "glass-button-text relative flex select-none items-center gap-2 tracking-tight",
  {
    variants: {
      size: {
        default: "px-6 py-3.5",
        sm: "px-4 py-2",
        lg: "px-8 py-4",
        icon: "h-10 w-10 items-center justify-center",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  contentClassName?: string;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, children, size, variant, contentClassName, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(glassButtonVariants({ size, variant }), className)}
        {...props}
      >
        <span className={cn(glassButtonTextVariants({ size }), contentClassName)}>
          {children}
        </span>
      </button>
    );
  },
);
GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants };
