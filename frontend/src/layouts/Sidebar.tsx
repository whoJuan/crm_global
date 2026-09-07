import React from "react";
import { NavLink } from "react-router-dom";
import {
  Newspaper,
  ReceiptText,
  Boxes,
  Contact2,
  Coins,
  Fingerprint,
  LogOut,
  Globe,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

const NAV_ITEMS = [
  { path: "/dashboard", label: "The Daily Digest", icon: Newspaper, tag: "Portada" },
  { path: "/orders", label: "Ventas & Órdenes", icon: ReceiptText, tag: "Ventas" },
  { path: "/inventory", label: "Catálogo & Servicios", icon: Boxes, tag: "Catálogo" },
  { path: "/customers", label: "Directorio de Clientes", icon: Contact2, tag: "Clientes" },
  { path: "/reports", label: "Revista Financiera", icon: Coins, tag: "Finanzas" },
  { path: "/users", label: "Equipo & Ajustes", icon: Fingerprint, tag: "Ajustes", adminOnly: true },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <aside className="w-72 bg-surface border-r border-ink-100 flex flex-col justify-between min-h-screen py-8 px-6 flex-shrink-0">
      <div>
        {/* Cabecera Editorial Universal */}
        <div className="pb-7 border-b border-ink-100 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="editorial-tag text-brass-600 font-bold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Global CRM
            </span>
            <span className="text-[9px] font-mono text-ink-500 bg-canvas-alt px-2 py-0.5 border border-ink-100">
              EDITION 2026
            </span>
          </div>
          <h1 className="font-serif text-2xl font-normal tracking-tight text-ink-950">
            Maison <span className="italic font-light text-brass-600">&</span> Commerce
          </h1>
          <p className="text-[11px] text-ink-400 mt-1 font-light italic">
            Gestión Comercial & Editorial Universal
          </p>
        </div>

        {/* Menú de Navegación con Iconos Distintivos */}
        <nav className="space-y-1.5">
          <p className="editorial-tag text-[9px] px-3 mb-2.5 text-ink-400">Índice Principal</p>
          {NAV_ITEMS.filter((item) => !item.adminOnly || user?.role === "ADMIN").map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3.5 py-2.5 text-xs transition-all duration-200 ${
                    isActive
                      ? "bg-canvas-alt text-ink-950 font-semibold border-l-2 border-brass-600 pl-3 shadow-xs"
                      : "text-ink-600 hover:text-ink-950 hover:bg-canvas/60"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-ink-400 group-hover:text-brass-600 transition-colors" />
                  <span className="tracking-wide">{item.label}</span>
                </div>
                <span className="text-[9px] font-mono uppercase text-ink-300 group-hover:text-ink-500">
                  {item.tag}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Pie de Usuario y Cierre */}
      <div className="pt-6 border-t border-ink-100 space-y-4">
        <div className="bg-canvas-alt p-3.5 border border-ink-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-ink-950 text-canvas font-serif text-xs flex items-center justify-center font-bold">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "GC"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-ink-950 truncate">{user?.name || "Usuario Comercial"}</p>
              <p className="text-[10px] text-ink-400 truncate font-mono">{user?.email || "staff@crmglobal.com"}</p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 text-[11px] uppercase font-semibold text-ink-400 hover:text-clay-600 hover:bg-clay-50/50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
