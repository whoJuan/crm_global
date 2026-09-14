import React, { useEffect, useState, useMemo } from "react";
import {
  Plus,
  Fingerprint,
  ShieldCheck,
  MailCheck,
  CalendarDays,
  KeyRound,
  UserPlus,
  Search,
  Shield,
  UserCheck,
  Trash2,
  Lock,
} from "lucide-react";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Badge from "../components/ui/Badge";
import { formatDate } from "../utils/format";
import { useDebounce } from "../utils/useDebounce";
import api from "../api/axios";
import { User, Role } from "../types";

const MOCK_USERS: User[] = [
  {
    id: 1,
    name: "Valeria Robledo",
    email: "admin@crmglobal.com",
    role: "ADMIN",
    isActive: true,
    createdAt: "2026-01-15T08:00:00Z",
  },
  {
    id: 2,
    name: "Mateo Sotomayor",
    email: "asesor@crmglobal.com",
    role: "DESIGNER",
    isActive: true,
    createdAt: "2026-02-01T09:00:00Z",
  },
  {
    id: 3,
    name: "Donato Valenzuela",
    email: "operaciones@crmglobal.com",
    role: "WORKSHOP_LEAD",
    isActive: true,
    createdAt: "2026-02-10T10:00:00Z",
  },
];

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "DESIGNER" as Role,
  });

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      if (res.data?.data && res.data.data.length > 0) {
        setUsers(res.data.data);
      }
    } catch {
      // Mock fallback
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/users", formData);
      if (res.data?.data) {
        setUsers((prev) => [res.data.data, ...prev]);
        setFeedback({ type: "success", text: `Usuario ${formData.name} creado exitosamente.` });
      }
    } catch {
      const newU: User = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      setUsers((prev) => [newU, ...prev]);
      setFeedback({ type: "success", text: `Usuario ${formData.name} registrado en el sistema local.` });
    }
    setIsModalOpen(false);
    setFormData({ name: "", email: "", password: "", role: "DESIGNER" });
    setTimeout(() => setFeedback(null), 4000);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchRole = roleFilter === "ALL" || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, debouncedSearch, roleFilter]);

  return (
    <div className="space-y-8">
      {/* Cabecera Neumórfica */}
      <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent bg-neu-surface px-3 py-1 rounded-full shadow-neu-inset-sm border border-white/20">
              Control de Accesos & Roles
            </span>
            <span className="w-2 h-2 rounded-full bg-neu-success shadow-neu-glow-success animate-pulse" />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-neu-text-dark">
            Equipo <span className="text-neu-accent">&</span> Cuentas del Sistema
          </h1>
          <p className="text-xs text-neu-text-sub mt-1">
            Software privado: La administración y asignación de permisos es facultad del Administrador.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="accent" size="md" onClick={() => setIsModalOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" /> Agregar Miembro
          </Button>
        </div>
      </header>

      {/* Alerta de confirmación */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-neu-surface shadow-neu-inset border border-white/20 text-xs font-semibold text-neu-success flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-neu-success" />
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-neu-text-muted hover:text-neu-text-dark">
            ✕
          </button>
        </div>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-3xl bg-neu-surface shadow-neu-raised-sm border border-white/60">
        <div className="flex items-center gap-2">
          {[
            { id: "ALL", label: "Todos los Miembros" },
            { id: "ADMIN", label: "Administradores" },
            { id: "DESIGNER", label: "Asesores / Ventas" },
            { id: "WORKSHOP_LEAD", label: "Operaciones" },
          ].map((rf) => (
            <button
              key={rf.id}
              onClick={() => setRoleFilter(rf.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-2xl whitespace-nowrap transition-all duration-200 border ${
                roleFilter === rf.id
                  ? "bg-neu-surface shadow-neu-inset border-white/20 text-neu-accent font-bold"
                  : "bg-neu-surface shadow-neu-raised-xs border-white/60 text-neu-text-sub hover:text-neu-text-dark hover:shadow-neu-raised-sm"
              }`}
            >
              {rf.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neu-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o correo..."
            className="neu-input-search"
          />
        </div>
      </div>

      {/* Grilla de Usuarios Neumórficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((u) => (
          <div
            key={u.id}
            className="neu-card p-6 space-y-4 hover:shadow-neu-raised-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-neu-surface shadow-neu-inset flex items-center justify-center text-sm font-bold text-neu-accent border border-white/20">
                  {u.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-neu-text-dark">{u.name}</h3>
                  <p className="text-xs text-neu-text-muted font-mono">{u.email}</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-neu-surface shadow-neu-inset border border-white/20 flex items-center justify-between text-xs">
              <span className="text-neu-text-sub font-medium">Nivel de Acceso</span>
              <span className="font-bold text-neu-accent font-mono uppercase text-[11px]">
                {u.role}
              </span>
            </div>

            <div className="pt-3 border-t border-neu-surfaceDark/50 flex items-center justify-between text-xs text-neu-text-muted">
              <span className="flex items-center gap-1.5 font-semibold text-neu-success">
                <span className="w-2 h-2 rounded-full bg-neu-success shadow-neu-glow-success" /> Activo
              </span>
              <span className="font-mono text-[10px]">{formatDate(u.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para Crear Usuario */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nuevo Usuario del Sistema"
        subtitle="Asigna permisos y credenciales de ingreso al CRM"
      >
        <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
          <div>
            <label className="block text-neu-text-dark font-bold uppercase tracking-wider text-[10px] mb-1.5 pl-1">
              Nombre Completo *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej. Mateo Sotomayor"
              className="neu-input"
            />
          </div>

          <div>
            <label className="block text-neu-text-dark font-bold uppercase tracking-wider text-[10px] mb-1.5 pl-1">
              Correo Electrónico *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="usuario@crmglobal.com"
              className="neu-input font-mono"
            />
          </div>

          <div>
            <label className="block text-neu-text-dark font-bold uppercase tracking-wider text-[10px] mb-1.5 pl-1">
              Contraseña de Acceso *
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="neu-input font-mono"
            />
          </div>

          <div>
            <label className="block text-neu-text-dark font-bold uppercase tracking-wider text-[10px] mb-1.5 pl-1">
              Rol Asignado
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
              className="neu-input"
            >
              <option value="ADMIN">Administrador General (Acceso Total)</option>
              <option value="DESIGNER">Asesor Comercial / Ventas</option>
              <option value="WORKSHOP_LEAD">Líder de Operaciones / Taller</option>
            </select>
          </div>

          <div className="pt-4 border-t border-neu-surfaceDark/50 flex items-center justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="accent">
              Crear Usuario
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsersPage;
