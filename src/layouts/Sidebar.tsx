import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ReceiptText,
  Boxes,
  Contact2,
  Coins,
  Fingerprint,
  LogOut,
  Sparkles,
  Layers,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, tag: "Portada" },
  { path: "/orders", label: "Ventas & Órdenes", icon: ReceiptText, tag: "Ventas" },
  { path: "/inventory", label: "Catálogo & Stock", icon: Boxes, tag: "Catálogo" },
  { path: "/customers", label: "Clientes", icon: Contact2, tag: "Directorio" },
  { path: "/reports", label: "Finanzas & Reportes", icon: Coins, tag: "Reportes" },
  { path: "/users", label: "Equipo & Ajustes", icon: Fingerprint, tag: "Sistema", adminOnly: true },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <aside className="w-72 bg-neu-base flex flex-col justify-between min-h-screen py-6 px-5 flex-shrink-0 border-r border-neu-surfaceDark/40">
      <div>
        {/* Cabecera Neumórfica de Marca */}
        <div className="p-4 rounded-3xl bg-neu-surface shadow-neu-raised-sm border border-white/60 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-neu-surface shadow-neu-inset flex items-center justify-center text-neu-accent border border-white/20">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent">
                  Global CRM
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-neu-success shadow-neu-glow-success animate-pulse" />
              </div>
              <h1 className="font-display text-lg font-bold text-neu-text-dark leading-tight">
                Soft UI
              </h1>
              <p className="text-[11px] text-neu-text-muted font-medium">Edición Neumórfica</p>
            </div>
          </div>
        </div>

        {/* Menú de Navegación */}
        <nav className="space-y-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neu-text-muted px-3 mb-2">
            Módulos del Sistema
          </p>
          {NAV_ITEMS.filter((item) => !item.adminOnly || user?.role === "ADMIN").map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-4 py-3 text-xs font-semibold rounded-2xl transition-all duration-200 border ${
                    isActive
                      ? "bg-neu-surface shadow-neu-inset border-white/20 text-neu-accent font-bold"
                      : "bg-neu-surface shadow-neu-raised-xs border-white/60 text-neu-text-sub hover:text-neu-text-dark hover:shadow-neu-raised-sm"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                          isActive
                            ? "bg-neu-accent text-white shadow-neu-glow-accent"
                            : "bg-neu-surface shadow-neu-inset-sm text-neu-text-sub group-hover:text-neu-accent"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="tracking-tight">{item.label}</span>
                    </div>
                    <span
                      className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-neu-accent/10 text-neu-accent"
                          : "text-neu-text-muted group-hover:text-neu-text-sub"
                      }`}
                    >
                      {item.tag}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Pie de Usuario y Cierre */}
      <div className="pt-5 border-t border-neu-surfaceDark/50 space-y-3">
        <div className="p-3.5 rounded-2xl bg-neu-surface shadow-neu-inset border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-neu-surface shadow-neu-raised-xs flex items-center justify-center text-xs font-bold text-neu-accent border border-white/50">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "GC"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-neu-text-dark truncate">
                {user?.name || "Usuario Comercial"}
              </p>
              <p className="text-[10px] text-neu-text-muted truncate font-mono">
                {user?.email || "staff@crmglobal.com"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-xl bg-neu-surface shadow-neu-raised-xs border border-white/50 text-neu-text-sub hover:text-neu-danger hover:shadow-neu-inset transition-all"
        >
          <LogOut className="w-3.5 h-3.5" /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
