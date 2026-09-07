import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "brass" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
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
    "inline-flex items-center justify-center font-sans uppercase font-semibold tracking-wider transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-[10px]",
    md: "px-5 py-2.5 text-xs",
    lg: "px-6 py-3.5 text-sm",
  };

  const variantStyles = {
    primary: "bg-ink-950 text-canvas hover:bg-brass-600 hover:text-white shadow-sm",
    secondary: "bg-surface text-ink-900 border border-ink-200 hover:border-ink-900 hover:bg-canvas-alt",
    brass: "bg-brass-500 text-white hover:bg-brass-600 shadow-sm",
    outline: "bg-transparent text-ink-900 border border-ink-900/30 hover:border-ink-900 hover:bg-ink-900/5",
    ghost: "bg-transparent text-ink-700 hover:text-ink-950 hover:bg-ink-100/50",
    danger: "bg-clay-500 text-white hover:bg-clay-600 shadow-sm",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
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
