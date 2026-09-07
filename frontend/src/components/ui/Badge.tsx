import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "brass" | "sage" | "clay" | "dark" | "outline";
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className = "",
}) => {
  const baseStyles = "inline-flex items-center font-mono font-medium border uppercase tracking-wider";

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[9px]",
    md: "px-2.5 py-1 text-[10px]",
  };

  const variantStyles = {
    default: "bg-canvas-alt text-ink-800 border-ink-200",
    brass: "bg-brass-50 text-brass-700 border-brass-300",
    sage: "bg-sage-50 text-sage-700 border-sage-200",
    clay: "bg-clay-50 text-clay-600 border-clay-200",
    dark: "bg-ink-950 text-canvas border-ink-950",
    outline: "bg-transparent text-ink-700 border-ink-300",
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
