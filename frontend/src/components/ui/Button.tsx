import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "success" | "danger" | "ghost" | "inset";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-sans font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none";

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs rounded-xl",
    md: "px-5 py-2.5 text-xs rounded-2xl",
    lg: "px-6 py-3 text-sm rounded-2xl",
    icon: "p-2.5 rounded-2xl",
  };

  const variantStyles = {
    primary:
      "bg-neu-surface text-neu-text-dark shadow-neu-raised-sm hover:shadow-neu-raised border border-white/60 active:shadow-neu-pressed text-neu-accent font-bold",
    secondary:
      "bg-neu-surface text-neu-text-main shadow-neu-raised-sm hover:shadow-neu-raised border border-white/50 active:shadow-neu-pressed",
    accent:
      "bg-neu-accent text-white shadow-neu-raised-sm hover:bg-neu-accent-hover hover:shadow-neu-glow-accent active:shadow-neu-pressed",
    success:
      "bg-neu-success text-white shadow-neu-raised-sm hover:bg-neu-success-hover hover:shadow-neu-glow-success active:shadow-neu-pressed",
    danger:
      "bg-neu-danger text-white shadow-neu-raised-sm hover:bg-neu-danger-hover active:shadow-neu-pressed",
    ghost:
      "bg-transparent text-neu-text-sub hover:text-neu-text-main hover:bg-white/40 active:bg-white/60 rounded-xl",
    inset:
      "bg-neu-surface text-neu-accent shadow-neu-inset border border-white/20 font-semibold",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Procesando...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
