import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Contact2,
  Building2,
  PhoneCall,
  MailCheck,
  MapPin,
  MessageSquareShare,
  Eye,
  ShieldCheck,
  Phone,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Badge from "../components/ui/Badge";
import { formatDate } from "../utils/format";
import useDebounce from "../utils/useDebounce";
import api from "../api/axios";
import { Customer } from "../types";

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 1,
    name: "Carolina Santamaría",
    email: "carolina.santamaria@estudiovanguardia.com",
    phone: "+57 300 456 7890",
    address: "Calle 85 #11-53, PH 901",
    city: "Bogotá",
    documentId: "52.489.123",
    isVip: true,
    clientType: "ESTUDIO_ARQUITECTURA",
    notes: "Directora en Estudio Vanguardia. Cuenta corporativa preferencial.",
    createdAt: "2026-03-12T10:00:00Z",
    _count: { orders: 4 },
  },
  {
    id: 2,
    name: "Alejandro Echeverri",
    email: "alejandro.echeverri@interiores.co",
    phone: "+57 312 890 1234",
    address: "Carrera 43A #1-50, Apto 1402",
    city: "Medellín",
    documentId: "98.765.432",
    isVip: true,
    clientType: "PARTICULAR",
    notes: "Cliente particular de alta frecuencia de compra.",
    createdAt: "2026-04-18T14:30:00Z",
    _count: { orders: 2 },
  },
  {
    id: 3,
    name: "Mariana Restrepo",
    email: "mariana.restrepo@empresa.com",
    phone: "+57 315 234 5678",
    address: "Av. Circunvalar #12-40",
    city: "Pereira",
    documentId: "42.112.980",
    isVip: false,
    clientType: "HOTEL_RESTAURANTE",
    notes: "Cuenta empresarial con requerimientos de facturación electrónica.",
    createdAt: "2026-05-20T09:15:00Z",
    _count: { orders: 1 },
  },
];

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [filterType, setFilterType] = useState("TODOS");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    documentId: "",
    isVip: false,
    clientType: "PARTICULAR" as const,
    notes: "",
  });

  const fetchCustomers = async (searchTerm: string) => {
    try {
      const res = await api.get(`/customers?search=${encodeURIComponent(searchTerm)}`);
      if (res.data?.data && res.data.data.length > 0) {
        setCustomers(res.data.data);
      }
    } catch {
      // Mock
    }
  };

  useEffect(() => {
    fetchCustomers(debouncedSearch);
  }, [debouncedSearch]);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/customers", formData);
      if (res.data?.data) {
        setCustomers((prev) => [res.data.data, ...prev]);
      }
    } catch {
      const newCust: Customer = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
        _count: { orders: 0 },
      };
      setCustomers((prev) => [newCust, ...prev]);
    }
    setIsModalOpen(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      documentId: "",
      isVip: false,
      clientType: "PARTICULAR",
      notes: "",
    });
  };

  const filteredCustomers = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.phone.includes(debouncedSearch) ||
      (c.email && c.email.toLowerCase().includes(debouncedSearch.toLowerCase()));

    const matchType =
      filterType === "TODOS" ||
      (filterType === "VIP" && c.isVip) ||
      (filterType === "B2B" && c.clientType !== "PARTICULAR");

    return matchSearch && matchType;
  });

  return (
    <div className="space-y-8">
      {/* Cabecera Neumórfica */}
      <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent bg-neu-surface px-3 py-1 rounded-full shadow-neu-inset-sm border border-white/20">
              Directorio & Cuentas
            </span>
            <span className="w-2 h-2 rounded-full bg-neu-success shadow-neu-glow-success animate-pulse" />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-neu-text-dark">
            Directorio <span className="text-neu-accent">&</span> Expedientes
          </h1>
          <p className="text-xs text-neu-text-sub mt-1">
            Gestión de clientes particulares, cuentas corporativas y contactos comerciales.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="accent" size="md" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Nuevo Cliente
          </Button>
        </div>
      </header>

      {/* Barra de Filtros & Búsqueda */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-3xl bg-neu-surface shadow-neu-raised-sm border border-white/60">
        <div className="flex items-center gap-2">
          {[
            { id: "TODOS", label: "Todos los Clientes" },
            { id: "VIP", label: "Clientes VIP" },
            { id: "B2B", label: "Cuentas B2B" },
          ].map((ft) => (
            <button
              key={ft.id}
              onClick={() => setFilterType(ft.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-2xl whitespace-nowrap transition-all duration-200 border ${
                filterType === ft.id
                  ? "bg-neu-surface shadow-neu-inset border-white/20 text-neu-accent font-bold"
                  : "bg-neu-surface shadow-neu-raised-xs border-white/60 text-neu-text-sub hover:text-neu-text-dark hover:shadow-neu-raised-sm"
              }`}
            >
              {ft.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neu-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, teléfono o email..."
            className="neu-input-search"
          />
        </div>
      </div>

      {/* Grilla de Fichas de Cliente Neumórficas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((cust) => (
          <article
            key={cust.id}
            className="neu-card p-6 flex flex-col justify-between hover:shadow-neu-raised-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {cust.isVip && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neu-warning bg-neu-surface px-2.5 py-0.5 rounded-full shadow-neu-inset-sm border border-white/20 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-neu-warning" /> VIP
                      </span>
                    )}
                    <span className="text-[10px] font-semibold text-neu-text-sub bg-neu-surface px-2.5 py-0.5 rounded-full shadow-neu-raised-xs border border-white/60">
                      {cust.clientType === "PARTICULAR" ? "Particular" : "Cuenta B2B"}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-neu-text-dark">{cust.name}</h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-neu-accent bg-neu-surface px-3 py-1 rounded-full shadow-neu-inset-sm border border-white/20">
                  {cust._count?.orders || 0} Pedidos
                </span>
              </div>

              {cust.notes && (
                <div className="p-3 rounded-2xl bg-neu-surface shadow-neu-inset border border-white/20 text-xs text-neu-text-sub italic">
                  "{cust.notes}"
                </div>
              )}

              <div className="space-y-2 text-xs text-neu-text-sub">
                <p className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-neu-surface shadow-neu-inset-sm flex items-center justify-center text-neu-accent">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-mono">{cust.phone}</span>
                </p>
                {cust.email && (
                  <p className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-neu-surface shadow-neu-inset-sm flex items-center justify-center text-neu-accent">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-mono truncate">{cust.email}</span>
                  </p>
                )}
                {cust.city && (
                  <p className="flex items-center gap-2.5 text-[11px] text-neu-text-muted">
                    <div className="w-7 h-7 rounded-lg bg-neu-surface shadow-neu-inset-sm flex items-center justify-center text-neu-text-muted">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <span>{cust.city}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-neu-surfaceDark/50 mt-6 flex items-center justify-between">
              <Link
                to={`/customers/${cust.id}`}
                className="px-4 py-2 rounded-2xl bg-neu-surface shadow-neu-raised-xs border border-white/60 text-xs font-bold text-neu-accent hover:shadow-neu-inset flex items-center gap-1.5 transition-all"
              >
                <Eye className="w-3.5 h-3.5" /> Expediente
              </Link>

              <a
                href={`https://wa.me/${cust.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-2xl bg-neu-surface shadow-neu-raised-xs border border-white/60 text-xs font-bold text-neu-success hover:shadow-neu-inset flex items-center gap-1.5 transition-all"
              >
                <MessageSquareShare className="w-3.5 h-3.5 text-neu-success" /> WhatsApp
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Modal para Crear Cliente */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nuevo Perfil de Cliente"
        subtitle="Registra información de contacto y preferencias"
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-neu-text-dark font-bold uppercase tracking-wider text-[10px] mb-1.5 pl-1">
                Nombre Completo / Razón Social *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej. Carolina Santamaría / Estudio SAS"
                className="neu-input"
              />
            </div>

            <div>
              <label className="block text-neu-text-dark font-bold uppercase tracking-wider text-[10px] mb-1.5 pl-1">
                Tipo de Cuenta
              </label>
              <select
                value={formData.clientType}
                onChange={(e) => setFormData({ ...formData, clientType: e.target.value as any })}
                className="neu-input"
              >
                <option value="PARTICULAR">Particular</option>
                <option value="ESTUDIO_ARQUITECTURA">Estudio de Arquitectura / Diseño</option>
                <option value="HOTEL_RESTAURANTE">Hotel / Restaurante</option>
                <option value="CORPORATIVO">Empresa / Corporativo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-neu-text-dark font-bold uppercase tracking-wider text-[10px] mb-1.5 pl-1">
                Teléfono Celular *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+57 300 123 4567"
                className="neu-input font-mono"
              />
            </div>

            <div>
              <label className="block text-neu-text-dark font-bold uppercase tracking-wider text-[10px] mb-1.5 pl-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="cliente@empresa.com"
                className="neu-input font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-neu-text-dark font-bold uppercase tracking-wider text-[10px] mb-1.5 pl-1">
                Cédula o NIT
              </label>
              <input
                type="text"
                value={formData.documentId}
                onChange={(e) => setFormData({ ...formData, documentId: e.target.value })}
                className="neu-input font-mono"
              />
            </div>

            <div>
              <label className="block text-neu-text-dark font-bold uppercase tracking-wider text-[10px] mb-1.5 pl-1">
                Ciudad
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Bogotá, Medellín..."
                className="neu-input"
              />
            </div>

            <div>
              <label className="block text-neu-text-dark font-bold uppercase tracking-wider text-[10px] mb-1.5 pl-1">
                Dirección
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="neu-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-neu-text-dark font-bold uppercase tracking-wider text-[10px] mb-1.5 pl-1">
              Notas & Preferencias
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notas comerciales de interés..."
              className="neu-input"
            />
          </div>

          <div className="p-3 rounded-2xl bg-neu-surface shadow-neu-inset border border-white/20 flex items-center gap-3">
            <input
              type="checkbox"
              id="isVip"
              checked={formData.isVip}
              onChange={(e) => setFormData({ ...formData, isVip: e.target.checked })}
              className="w-4 h-4 rounded text-neu-accent accent-neu-accent cursor-pointer"
            />
            <label htmlFor="isVip" className="text-xs font-bold text-neu-text-dark cursor-pointer">
              Marcar como Cliente VIP (Tratamiento preferencial)
            </label>
          </div>

          <div className="pt-4 border-t border-neu-surfaceDark/50 flex items-center justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="accent">
              Registrar Cliente
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;
