import React from "react";
import { Search, Bell, Compass, Sparkles } from "lucide-react";
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
    <header className="bg-surface/90 border-b border-ink-100 py-4 px-8 lg:px-10 flex items-center justify-between sticky top-0 z-20">
      <div>
        <div className="flex items-center gap-2">
          <span className="editorial-tag text-brass-600">Global Commerce Edition</span>
          <span className="text-[10px] text-ink-300">·</span>
          <span className="text-[11px] font-mono text-ink-500 capitalize">{currentDate}</span>
        </div>
        {title && <h2 className="font-serif text-lg font-medium text-ink-950 mt-0.5">{title}</h2>}
      </div>

      <div className="flex items-center gap-5">
        {/* Buscador Universal */}
        <div className="relative hidden md:block w-64">
          <Search className="w-3.5 h-3.5 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar órdenes, piezas, clientes..."
            className="w-full bg-canvas-alt border border-ink-100 pl-9 pr-3 py-1.5 text-xs text-ink-900 placeholder:text-ink-400 placeholder:italic focus:outline-none focus:border-brass-500 focus:bg-surface transition-all"
          />
        </div>

        {/* Botón de Guía / Tour Interactivo */}
        {onOpenTour && (
          <button
            onClick={onOpenTour}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brass-50 text-brass-700 hover:bg-brass-100 border border-brass-200 text-xs font-mono font-semibold transition-colors shadow-xs"
            title="Abrir la guía paso a paso del CRM"
          >
            <Compass className="w-3.5 h-3.5 text-brass-600" />
            <span className="hidden sm:inline">Guía del Sistema</span>
          </button>
        )}

        {/* Perfil de Usuario */}
        <div className="flex items-center gap-3 pl-3 border-l border-ink-100">
          <div className="w-7 h-7 bg-ink-950 text-canvas font-serif text-xs flex items-center justify-center font-bold">
            {user?.name ? user.name[0].toUpperCase() : "G"}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-ink-900 leading-none">{user?.name || "Administrador"}</p>
            <span className="text-[9px] font-mono text-brass-600 uppercase">{user?.role || "GLOBAL STAFF"}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
