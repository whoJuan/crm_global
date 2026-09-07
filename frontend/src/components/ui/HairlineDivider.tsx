import React from "react";

interface HairlineDividerProps {
  label?: string;
  tag?: string;
  className?: string;
}

export const HairlineDivider: React.FC<HairlineDividerProps> = ({ label, tag, className = "" }) => {
  if (!label && !tag) {
    return <div className={`rule-hairline my-6 ${className}`} />;
  }

  return (
    <div className={`relative flex items-center justify-between my-8 ${className}`}>
      <div className="flex-1 border-t border-ink-100" />
      <div className="px-4 flex items-center gap-3">
        {tag && <span className="editorial-tag text-brass-600">{tag}</span>}
        {label && <span className="text-xs uppercase font-serif tracking-widest text-ink-600">{label}</span>}
      </div>
      <div className="flex-1 border-t border-ink-100" />
    </div>
  );
};

export default HairlineDivider;
