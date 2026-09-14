import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "accent"
    | "success"
    | "warning"
    | "danger"
    | "violet"
    | "inset"
    | "brass"
    | "sage"
    | "clay"
    | "dark"
    | "outline";
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className = "",
}) => {
  const baseStyles = "inline-flex items-center font-sans font-semibold rounded-full tracking-wide";

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
  };

  const variantStyles: Record<string, string> = {
    default: "bg-neu-surface text-neu-text-main shadow-neu-raised-xs border border-white/50",
    accent: "bg-neu-surface text-neu-accent shadow-neu-inset-sm border border-white/20 font-bold",
    brass: "bg-neu-surface text-neu-accent shadow-neu-inset-sm border border-white/20 font-bold",
    success: "bg-neu-surface text-neu-success shadow-neu-inset-sm border border-white/20 font-semibold",
    sage: "bg-neu-surface text-neu-success shadow-neu-inset-sm border border-white/20 font-semibold",
    warning: "bg-neu-surface text-neu-warning shadow-neu-inset-sm border border-white/20 font-semibold",
    danger: "bg-neu-surface text-neu-danger shadow-neu-inset-sm border border-white/20 font-semibold",
    clay: "bg-neu-surface text-neu-danger shadow-neu-inset-sm border border-white/20 font-semibold",
    violet: "bg-neu-surface text-neu-violet shadow-neu-inset-sm border border-white/20 font-semibold",
    dark: "bg-neu-dark text-white shadow-neu-raised-xs border border-neu-dark font-bold",
    outline: "bg-transparent text-neu-text-sub border border-neu-surfaceDark shadow-neu-inset-sm",
    inset: "bg-neu-surface text-neu-text-sub shadow-neu-inset-sm border border-white/20",
  };

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size]} ${
        variantStyles[variant] || variantStyles.default
      } ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
