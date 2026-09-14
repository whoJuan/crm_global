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
    <div className="neu-card p-6 flex flex-col justify-between relative overflow-hidden group hover:shadow-neu-raised-lg transition-all duration-300">
      {/* Cabecera de la tarjeta con Tag y botón de Icono Neumórfico Circular */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-neu-accent bg-neu-surface px-3 py-1 rounded-full shadow-neu-inset border border-white/20">
          {tag}
        </span>
        {Icon && (
          <div className="w-10 h-10 rounded-full bg-neu-surface shadow-neu-raised-xs flex items-center justify-center border border-white/60 group-hover:shadow-neu-inset group-hover:text-neu-accent transition-all duration-300">
            <Icon className="w-4 h-4 text-neu-text-sub transition-colors group-hover:text-neu-accent" />
          </div>
        )}
      </div>

      {/* Valor Principal & Título */}
      <div className="my-4">
        <p className="text-xs text-neu-text-sub font-medium">{title}</p>
        <h3 className="font-display text-2xl lg:text-3xl text-neu-text-dark font-extrabold tracking-tight mt-1">
          {value}
        </h3>
      </div>

      {/* Pie con indicador de cambio o subtítulo */}
      {(change || subtitle) && (
        <div className="pt-3 border-t border-neu-surfaceDark/60 flex items-center justify-between text-xs">
          {change && (
            <span
              className={`inline-flex items-center gap-1.5 font-semibold text-xs px-2.5 py-0.5 rounded-full ${
                isPositive
                  ? "text-neu-success bg-neu-success-light/60 shadow-neu-inset-sm"
                  : "text-neu-danger bg-neu-danger-light/60 shadow-neu-inset-sm"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isPositive ? "bg-neu-success animate-pulse" : "bg-neu-danger"
                }`}
              />
              {change}
            </span>
          )}
          {subtitle && <span className="text-neu-text-muted text-[11px] truncate">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
