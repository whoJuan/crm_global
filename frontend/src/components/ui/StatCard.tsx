import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  tag: string;
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: LucideIcon;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  tag,
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  subtitle,
}) => {
  return (
    <div className="editorial-card p-6 flex flex-col justify-between relative overflow-hidden group hover:border-brass-300">
      <div className="flex items-center justify-between">
        <span className="editorial-tag text-brass-600">{tag}</span>
        {Icon && <Icon className="w-4 h-4 text-ink-400 group-hover:text-brass-600 transition-colors" />}
      </div>

      <div className="mt-4 mb-2">
        <p className="text-xs text-ink-600 font-medium">{title}</p>
        <h3 className="font-serif text-3xl text-ink-950 font-normal tracking-tight mt-1">
          {value}
        </h3>
      </div>

      {(change || subtitle) && (
        <div className="pt-3 border-t border-ink-100 flex items-center justify-between text-xs font-mono">
          {change && (
            <span className={isPositive ? "text-sage-600 font-medium" : "text-clay-600 font-medium"}>
              {change}
            </span>
          )}
          {subtitle && <span className="text-ink-400 text-[11px] truncate">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
