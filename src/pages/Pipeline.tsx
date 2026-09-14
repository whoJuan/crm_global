import React, { useEffect, useState } from "react";
import {
  Plus,
  Phone,
  Building,
  DollarSign,
  ArrowRight,
  MessageCircle,
  Filter,
  Sparkles,
  Calendar,
} from "lucide-react";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Badge from "../components/ui/Badge";
import { formatCurrency, LEAD_SOURCE_MAP } from "../utils/format";
import api from "../api/axios";
import { Lead, LeadStatus, LeadSource } from "../types";

const COLUMNS: { id: LeadStatus; title: string; subtitle: string }[] = [
  { id: "NUEVO", title: "Nuevos Prospectos", subtitle: "Interés inicial o consulta" },
  { id: "CITA_SHOWROOM", title: "Cita en Showroom", subtitle: "Muestrario de telas y piezas" },
  { id: "COTIZACION_ENVIADA", title: "Cotización Enviada", subtitle: "Proforma formal activa" },
  { id: "NEGOCIACION", title: "En Negociación", subtitle: "Ajuste de acabados y pago" },
  { id: "GANADO", title: "Cerrado / Ganado", subtitle: "Anticipo recibido / En taller" },
];

export const Pipeline: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 1,
      name: "Felipe Morales",
      company: "Morales & Co Arquitectura",
      email: "felipe@moralesarq.com",
      phone: "+57 310 555 0192",
      source: "ARQUITECTO_DISENADOR",
      status: "CITA_SHOWROOM",
      estimatedBudget: 18500000,
      interestSummary: "Mobiliario completo Penthouse El Poblado (Sala, Comedor 10P y Terraza)",
      notes: "Cita confirmada para revisión de muestras de tela bouclé.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: { id: 2, name: "Mateo Sotomayor", email: "diseno@robledoatelier.com" },
    },
    {
      id: 2,
      name: "Valentina Durán",
      company: "Boutique Hotel Casa Colonial",
      email: "gerencia@casacolonialhotel.com",
      phone: "+57 318 444 8821",
      source: "INSTAGRAM",
      status: "COTIZACION_ENVIADA",
      estimatedBudget: 34000000,
      interestSummary: "12 Poltronas Florence y 6 Mesas de Centro Monolith para lobby",
      notes: "Cotización #COT-26-4401 enviada con 10% de descuento institucional.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: { id: 1, name: "Valeria Robledo", email: "admin@robledoatelier.com" },
    },
    {
      id: 3,
      name: "Rodrigo Casas",
      company: null,
      email: "rodrigo.casas@gmail.com",
      phone: "+57 301 999 3322",
      source: "SHOWROOM_DIRECTO",
      status: "NEGOCIACION",
      estimatedBudget: 9500000,
      interestSummary: "Sofá Milano Curvo en Lino Italiano + Juego de mesas nido",
      notes: "Pendiente confirmación de medidas de ascensor para entrega.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 4,
      name: "Diana Marcela Ospina",
      company: "Estudio Terracota",
      email: "diana@estudioterracota.com",
      phone: "+57 314 777 6655",
      source: "REFERIDO",
      status: "NUEVO",
      estimatedBudget: 12000000,
      interestSummary: "3 Camas King Size Verona para proyecto hotel campestre en Barichara",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    source: "SHOWROOM_DIRECTO" as LeadSource,
    estimatedBudget: "",
    interestSummary: "",
    notes: "",
  });

  const fetchLeads = async () => {
    try {
      const res = await api.get("/leads");
      if (res.data?.data && res.data.data.length > 0) {
        setLeads(res.data.data);
      }
    } catch {
      // Mantener datos de muestra
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (leadId: number, nextStatus: LeadStatus) => {
    try {
      await api.patch(`/leads/${leadId}/status`, { status: nextStatus });
    } catch {
      // Optimistic update
    }
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: nextStatus } : l))
    );
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/leads", formData);
      if (res.data?.data) {
        setLeads((prev) => [res.data.data, ...prev]);
      }
    } catch {
      const newLead: Lead = {
        id: Date.now(),
        name: formData.name,
        company: formData.company || null,
        email: formData.email || null,
        phone: formData.phone,
        source: formData.source,
        status: "NUEVO",
        estimatedBudget: formData.estimatedBudget ? Number(formData.estimatedBudget) : null,
        interestSummary: formData.interestSummary || null,
        notes: formData.notes || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setLeads((prev) => [newLead, ...prev]);
    }
    setIsModalOpen(false);
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      source: "SHOWROOM_DIRECTO",
      estimatedBudget: "",
      interestSummary: "",
      notes: "",
    });
  };

  const totalPipelineValue = leads.reduce(
    (sum, l) => sum + (Number(l.estimatedBudget) || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Cabecera Editorial */}
      <header className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-ink-100 gap-6">
        <div>
          <span className="editorial-tag text-brass-600">Embudo Comercial · Ventas & Asesoría</span>
          <h1 className="font-serif text-4xl font-normal text-ink-950 mt-1">
            Pipeline <span className="italic font-light text-brass-600">&</span> Proyectos en Curso
          </h1>
          <p className="text-sm text-ink-600 mt-2 font-light max-w-xl">
            Seguimiento de prospectos, estudios de arquitectura y cotizaciones de alta ebanistería.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block font-mono">
            <span className="editorial-tag text-ink-400">Valor Total en Pipeline</span>
            <p className="text-xl font-serif text-ink-950 font-normal">
              {formatCurrency(totalPipelineValue)}
            </p>
          </div>
          <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-2" /> Nuevo Prospecto
          </Button>
        </div>
      </header>

      {/* Tablero Kanban Comercial */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 items-start overflow-x-auto pb-6">
        {COLUMNS.map((col) => {
          const colLeads = leads.filter((l) => l.status === col.id);
          const colValue = colLeads.reduce((s, l) => s + (Number(l.estimatedBudget) || 0), 0);

          return (
            <div key={col.id} className="bg-canvas-alt/70 border border-ink-100 p-4 min-w-[260px] flex flex-col">
              {/* Encabezado de Columna */}
              <div className="pb-3 border-b border-ink-200/80 mb-4">
                <div className="flex items-center justify-between">
                  <span className="editorial-tag text-ink-600 font-bold">{col.title}</span>
                  <span className="w-5 h-5 bg-surface border border-ink-200 text-ink-900 font-mono text-[10px] flex items-center justify-center font-bold">
                    {colLeads.length}
                  </span>
                </div>
                <p className="text-[10px] text-ink-400 font-light italic mt-0.5">{col.subtitle}</p>
                <p className="font-mono text-[11px] text-brass-700 font-semibold mt-1">
                  {formatCurrency(colValue)}
                </p>
              </div>

              {/* Tarjetas de Prospectos */}
              <div className="space-y-4">
                {colLeads.map((lead) => (
                  <article
                    key={lead.id}
                    className="editorial-card p-4 space-y-3 bg-surface hover:border-brass-400 transition-colors shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="brass" size="sm">
                          {LEAD_SOURCE_MAP[lead.source] || lead.source}
                        </Badge>
                      </div>
                      <h4 className="font-serif text-base font-medium text-ink-950">{lead.name}</h4>
                      {lead.company && (
                        <p className="text-xs text-ink-500 font-light flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3 text-ink-400" /> {lead.company}
                        </p>
                      )}
                    </div>

                    {lead.interestSummary && (
                      <p className="text-[11px] text-ink-600 italic bg-canvas-alt/60 p-2 border-l-2 border-brass-400">
                        "{lead.interestSummary}"
                      </p>
                    )}

                    <div className="pt-2 border-t border-ink-100 flex items-center justify-between font-mono text-xs">
                      <div>
                        <span className="text-[9px] text-ink-400 uppercase block">Presupuesto</span>
                        <strong className="text-ink-950 font-medium">
                          {formatCurrency(lead.estimatedBudget || 0)}
                        </strong>
                      </div>

                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-sage-50 text-sage-700 hover:bg-sage-100 border border-sage-200 transition-colors title='Contactar por WhatsApp'"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* Selector Rápido de Etapa */}
                    <div className="pt-2 border-t border-ink-100 flex items-center justify-between">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                        className="bg-canvas-alt text-[10px] font-mono py-1 px-2 border border-ink-200 focus:outline-none focus:border-brass-500 w-full"
                      >
                        <option value="NUEVO">Mover a: Nuevo</option>
                        <option value="CITA_SHOWROOM">Mover a: Cita Showroom</option>
                        <option value="COTIZACION_ENVIADA">Mover a: Cotización</option>
                        <option value="NEGOCIACION">Mover a: Negociación</option>
                        <option value="GANADO">Mover a: Cerrado Ganado</option>
                        <option value="PERDIDO">Mover a: Perdido</option>
                      </select>
                    </div>
                  </article>
                ))}

                {colLeads.length === 0 && (
                  <div className="py-8 text-center border border-dashed border-ink-200 bg-canvas/40 text-ink-400 text-xs italic">
                    Sin prospectos en esta etapa
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal para Crear Lead */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nuevo Prospecto de Proyecto"
        subtitle="Registra una nueva oportunidad comercial para atención en showroom o taller"
      >
        <form onSubmit={handleCreateLead} className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
                Nombre del Contacto *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej. Carolina Santamaría"
                className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500"
              />
            </div>

            <div>
              <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
                Estudio / Empresa (Opcional)
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Ej. Estudio Vanguardia Arquitectura"
                className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500"
              />
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
                className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500"
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
                placeholder="contacto@estudio.com"
                className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
                Origen del Lead
              </label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value as LeadSource })}
                className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500 font-mono"
              >
                <option value="SHOWROOM_DIRECTO">Visita a Showroom Directo</option>
                <option value="ARQUITECTO_DISENADOR">Estudio de Arquitectura / Diseñador</option>
                <option value="INSTAGRAM">Instagram Atelier</option>
                <option value="SITIO_WEB">Catálogo Web</option>
                <option value="REFERIDO">Cliente VIP Referido</option>
                <option value="EVENTO_DISENO">Feria o Evento de Diseño</option>
              </select>
            </div>

            <div>
              <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
                Presupuesto Estimado (COP)
              </label>
              <input
                type="number"
                value={formData.estimatedBudget}
                onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                placeholder="Ej. 18500000"
                className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
              Resumen del Proyecto o Piezas de Interés
            </label>
            <textarea
              rows={3}
              value={formData.interestSummary}
              onChange={(e) => setFormData({ ...formData, interestSummary: e.target.value })}
              placeholder="Ej. Mobiliario completo para casa campestre: Sofá curvo en lino belga, Comedor 8P en nogal..."
              className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500"
            />
          </div>

          <div className="pt-4 border-t border-ink-100 flex items-center justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Guardar Prospecto
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Pipeline;
