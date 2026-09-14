import React from "react";

interface HairlineDividerProps {
  label?: string;
  tag?: string;
  className?: string;
}

export const HairlineDivider: React.FC<HairlineDividerProps> = ({ label, tag, className = "" }) => {
  if (!label && !tag) {
    return (
      <div
        className={`w-full h-[2px] bg-gradient-to-r from-transparent via-neu-surfaceDark to-transparent shadow-[0_1px_0_rgba(255,255,255,0.8)] my-6 ${className}`}
      />
    );
  }

  return (
    <div className={`relative flex items-center justify-between my-8 ${className}`}>
      <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-neu-surfaceDark to-neu-surfaceDark shadow-[0_1px_0_rgba(255,255,255,0.8)]" />
      <div className="px-4 flex items-center gap-3">
        {tag && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent bg-neu-surface px-2.5 py-0.5 rounded-full shadow-neu-inset-sm border border-white/20">
            {tag}
          </span>
        )}
        {label && (
          <span className="text-xs font-semibold uppercase tracking-wider text-neu-text-sub font-display">
            {label}
          </span>
        )}
      </div>
      <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent via-neu-surfaceDark to-neu-surfaceDark shadow-[0_1px_0_rgba(255,255,255,0.8)]" />
    </div>
  );
};

export default HairlineDivider;
