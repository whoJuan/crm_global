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
  const debouncedSearch = useDebounce(search, 350); // Consulta 1 a 1
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
      {/* Cabecera Editorial */}
      <header className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-ink-100 gap-6">
        <div>
          <span className="editorial-tag text-brass-600">Directorio de Clientela & Cuentas</span>
          <h1 className="font-serif text-4xl font-normal text-ink-950 mt-1">
            Directorio <span className="italic font-light text-brass-600">&</span> Dossier de Clientes
          </h1>
          <p className="text-sm text-ink-600 mt-2 font-light max-w-xl">
            Gestión de clientes particulares, cuentas B2B corporativas y contactos comerciales.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-2" /> Nuevo Cliente
          </Button>
        </div>
      </header>

      {/* Barra de Filtros & Búsqueda con Debounce 1 a 1 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-ink-100">
        <div className="flex items-center gap-2">
          {["TODOS", "VIP", "B2B"].map((ft) => (
            <button
              key={ft}
              onClick={() => setFilterType(ft)}
              className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-colors ${
                filterType === ft
                  ? "bg-ink-950 text-canvas font-semibold"
                  : "bg-surface border border-ink-100 text-ink-600 hover:border-ink-400"
              }`}
            >
              {ft === "TODOS" ? "Todos los Clientes" : ft === "VIP" ? "Clientes VIP" : "Cuentas B2B / Empresas"}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar (consulta 1 a 1)..."
            className="w-full bg-canvas-alt border border-ink-100 pl-8 pr-3 py-1.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500 font-mono"
          />
        </div>
      </div>

      {/* Grilla de Fichas de Cliente Dossier */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((cust) => (
          <article
            key={cust.id}
            className="editorial-card p-6 flex flex-col justify-between hover:border-brass-400 transition-colors shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {cust.isVip && (
                      <Badge variant="brass" size="sm">
                        <ShieldCheck className="w-2.5 h-2.5 mr-1 inline" /> VIP
                      </Badge>
                    )}
                    <Badge variant="default" size="sm">
                      {cust.clientType === "PARTICULAR" ? "Particular" : "Cuenta B2B"}
                    </Badge>
                  </div>
                  <h3 className="font-serif text-xl font-medium text-ink-950">{cust.name}</h3>
                </div>
                <span className="text-[10px] font-mono text-ink-400 bg-canvas-alt px-2 py-0.5 border border-ink-100">
                  {cust._count?.orders || 0} Pedidos
                </span>
              </div>

              {cust.notes && (
                <p className="text-xs text-ink-600 italic bg-canvas-alt/70 p-2.5 border-l-2 border-brass-500 font-light">
                  "{cust.notes}"
                </p>
              )}

              <div className="space-y-1.5 text-xs font-sans text-ink-600">
                <p className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-ink-400" />
                  <span className="font-mono">{cust.phone}</span>
                </p>
                {cust.email && (
                  <p className="flex items-center gap-2">
                    <MailCheck className="w-3.5 h-3.5 text-ink-400" />
                    <span className="font-mono truncate">{cust.email}</span>
                  </p>
                )}
                {cust.city && (
                  <p className="flex items-center gap-2 text-[11px] text-ink-500">
                    <MapPin className="w-3.5 h-3.5 text-ink-400" />
                    {cust.city}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-ink-100 mt-6 flex items-center justify-between">
              <Link
                to={`/customers/${cust.id}`}
                className="text-[11px] font-semibold text-brass-600 hover:text-ink-950 uppercase tracking-wider flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> Ver Dossier
              </Link>

              <a
                href={`https://wa.me/${cust.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-sage-50 text-sage-700 hover:bg-sage-100 border border-sage-200 text-xs font-mono"
              >
                <MessageSquareShare className="w-3.5 h-3.5" /> WhatsApp
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
        <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
                Nombre Completo / Razón Social *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej. Carolina Santamaría / Empresa SAS"
                className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500"
              />
            </div>

            <div>
              <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
                Tipo de Cuenta
              </label>
              <select
                value={formData.clientType}
                onChange={(e) =>
                  setFormData({ ...formData, clientType: e.target.value as any })
                }
                className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500"
              >
                <option value="PARTICULAR">Cliente Particular</option>
                <option value="ESTUDIO_ARQUITECTURA">Cuenta Comercial / B2B</option>
                <option value="HOTEL_RESTAURANTE">Cuenta Corporativa / Institucional</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
                Teléfono / WhatsApp *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+57 300 123 4567"
                className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="cliente@dominio.com"
                className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
                Ciudad
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Bogotá, Medellín, Pereira..."
                className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500"
              />
            </div>

            <div>
              <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
                Dirección
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Calle 85 #11-53..."
                className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
              Notas & Preferencias Comerciales
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ej. Requerimientos de atención, condiciones comerciales..."
              className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isVip"
              checked={formData.isVip}
              onChange={(e) => setFormData({ ...formData, isVip: e.target.checked })}
              className="rounded-none border-ink-300 text-brass-600 focus:ring-brass-500"
            />
            <label htmlFor="isVip" className="text-xs text-ink-800 font-medium">
              Marcar como Cliente VIP / Cuenta Clave
            </label>
          </div>

          <div className="pt-4 border-t border-ink-100 flex items-center justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Guardar Cliente
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;
