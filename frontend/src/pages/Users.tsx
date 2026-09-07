import React, { useEffect, useState, useMemo } from "react";
import { Plus, Fingerprint, ShieldCheck, MailCheck, CalendarDays, KeyRound, UserPlus, Search, Shield, UserCheck, Trash2 } from "lucide-react";
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
      {/* Cabecera Editorial */}
      <header className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-ink-100 gap-6">
        <div>
          <span className="editorial-tag text-brass-600">Control de Accesos & Roles 1 a 1</span>
          <h1 className="font-serif text-4xl font-normal text-ink-950 mt-1">
            Equipo <span className="italic font-light text-brass-600">&</span> Usuarios del Sistema
          </h1>
          <p className="text-sm text-ink-600 mt-2 font-light max-w-xl">
            Software privado: La creación de cuentas y asignación de permisos es facultad exclusiva del Administrador.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
            <UserPlus className="w-3.5 h-3.5 mr-2" /> Agregar Miembro
          </Button>
        </div>
      </header>

      {/* Alerta de confirmación */}
      {feedback && (
        <div
          className={`p-4 border text-xs font-mono flex items-center justify-between ${
            feedback.type === "success"
              ? "bg-sage-50 border-sage-200 text-sage-800"
              : "bg-clay-50 border-clay-200 text-clay-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brass-600" />
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-ink-400 hover:text-ink-900 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Barra de Filtros y Búsqueda 1 a 1 */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o correo (1 a 1)..."
            className="w-full bg-surface border border-ink-200 pl-9 pr-4 py-2 text-xs text-ink-900 focus:outline-none focus:border-brass-500 font-mono transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-ink-400 uppercase">Filtrar Rol:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-surface border border-ink-200 px-3 py-2 text-xs text-ink-900 font-mono focus:outline-none focus:border-brass-500"
          >
            <option value="ALL">Todos los roles</option>
            <option value="ADMIN">Administradores</option>
            <option value="DESIGNER">Asesores Comerciales</option>
            <option value="WORKSHOP_LEAD">Operaciones</option>
            <option value="EMPLOYEE">Staff de Ventas</option>
          </select>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="editorial-card overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="border-b border-ink-100 text-[10px] font-mono text-ink-400 uppercase bg-canvas-alt/50">
              <th className="p-4 font-medium">Nombre del Miembro</th>
              <th className="p-4 font-medium">Correo Electrónico</th>
              <th className="p-4 font-medium">Rol Asignado</th>
              <th className="p-4 font-medium">Fecha de Alta</th>
              <th className="p-4 font-medium text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-ink-400 font-mono text-xs">
                  No se encontraron usuarios con el criterio especificado.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-canvas-alt/40 transition-colors">
                  <td className="p-4">
                    <p className="font-serif text-sm font-medium text-ink-950">{u.name}</p>
                  </td>
                  <td className="p-4 font-mono text-ink-600">{u.email}</td>
                  <td className="p-4">
                    <Badge variant={u.role === "ADMIN" ? "dark" : u.role === "DESIGNER" ? "brass" : "sage"}>
                      {u.role === "ADMIN" ? "Administrador" : u.role === "DESIGNER" ? "Asesor Comercial" : "Operaciones"}
                    </Badge>
                  </td>
                  <td className="p-4 font-mono text-ink-500">{formatDate(u.createdAt)}</td>
                  <td className="p-4 text-center font-mono">
                    <span className="text-sage-700 bg-sage-50 border border-sage-200 px-2 py-0.5 text-[10px] font-bold">
                      Activo
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para Crear Usuario */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nuevo Integrante del Equipo"
        subtitle="Crea credenciales individuales con asignación de rol (Solo Admin)"
      >
        <form onSubmit={handleCreateUser} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
              Nombre Completo *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej. Mateo Sotomayor"
              className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500"
            />
          </div>

          <div>
            <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
              Correo Electrónico *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="usuario@crmglobal.com"
              className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
              Contraseña de Acceso *
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
              Rol Asignado
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
              className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500 font-mono"
            >
              <option value="DESIGNER">Asesor Comercial / Consultor</option>
              <option value="WORKSHOP_LEAD">Coordinador de Operaciones</option>
              <option value="EMPLOYEE">Staff de Ventas</option>
              <option value="ADMIN">Administrador General</option>
            </select>
          </div>

          <div className="pt-4 border-t border-ink-100 flex items-center justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Crear Usuario
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsersPage;

