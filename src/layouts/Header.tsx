import React from "react";
import { Search, Compass, Bell, ShieldCheck } from "lucide-react";
import { useAuthStore } from "../store/authStore";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onOpenTour?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, onOpenTour }) => {
  const { user } = useAuthStore();
  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="bg-neu-base/95 backdrop-blur-sm py-4 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20 border-b border-neu-surfaceDark/40">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent bg-neu-surface px-2.5 py-0.5 rounded-full shadow-neu-inset-sm border border-white/20">
            Global Control Hub
          </span>
          <span className="text-[10px] text-neu-text-muted">·</span>
          <span className="text-xs font-mono text-neu-text-sub capitalize">{currentDate}</span>
        </div>
        {title && <h2 className="font-display text-lg font-bold text-neu-text-dark mt-0.5">{title}</h2>}
      </div>

      <div className="flex items-center gap-4">
        {/* Buscador Neumórfico Incrustado */}
        <div className="relative hidden md:block w-72">
          <Search className="w-4 h-4 text-neu-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar órdenes, productos, clientes..."
            className="neu-input-search"
          />
        </div>

        {/* Botón de Guía / Tour Interactivo */}
        {onOpenTour && (
          <button
            onClick={onOpenTour}
            className="flex items-center gap-2 px-4 py-2 bg-neu-surface rounded-2xl shadow-neu-raised-xs border border-white/60 text-xs font-semibold text-neu-accent hover:shadow-neu-raised active:shadow-neu-pressed transition-all"
            title="Abrir la guía interactiva del CRM"
          >
            <Compass className="w-4 h-4 text-neu-accent" />
            <span className="hidden sm:inline">Guía Rápida</span>
          </button>
        )}

        {/* Perfil de Usuario */}
        <div className="flex items-center gap-3 pl-3 border-l border-neu-surfaceDark/60">
          <div className="w-9 h-9 rounded-full bg-neu-surface shadow-neu-raised-sm flex items-center justify-center font-bold text-xs text-neu-accent border border-white/60">
            {user?.name ? user.name[0].toUpperCase() : "G"}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-neu-text-dark leading-none">
              {user?.name || "Administrador"}
            </p>
            <span className="text-[9px] font-mono text-neu-accent font-semibold uppercase">
              {user?.role || "ADMIN"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
