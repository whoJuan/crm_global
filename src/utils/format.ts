import { OrderStatus, LeadStatus, LeadSource } from "../types";

export const formatCurrency = (amount: number | string | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) return "$ 0";
  const num = Number(amount);
  return `$ ${num.toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export const formatDate = (dateStr?: string | null): string => {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export const formatDateTime = (dateStr?: string | null): string => {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString("es-ES", { day: "numeric", month: "short" })} · ${d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`;
  } catch {
    return dateStr;
  }
};

export const ORDER_STATUS_MAP: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  PENDING: { label: "Pendiente Anticipo", color: "text-clay-600", bg: "bg-clay-50 border-clay-200" },
  CONFIRMED: { label: "Confirmado / Anticipo 50%", color: "text-brass-700", bg: "bg-brass-50 border-brass-300" },
  IN_PRODUCTION: { label: "En Ebanistería & Taller", color: "text-ink-900", bg: "bg-canvas-alt border-ink-300" },
  QUALITY_CHECK: { label: "Control de Calidad", color: "text-sage-700", bg: "bg-sage-50 border-sage-300" },
  SHIPPED: { label: "En Transporte / Despacho", color: "text-ink-700", bg: "bg-ink-100 border-ink-300" },
  DELIVERED: { label: "Entregado & Instalado", color: "text-sage-600", bg: "bg-sage-50 border-sage-200" },
  CANCELLED: { label: "Cancelado", color: "text-ink-400", bg: "bg-ink-50 border-ink-200" },
};

export const LEAD_STATUS_MAP: Record<LeadStatus, { label: string; tag: string }> = {
  NUEVO: { label: "Nuevo Prospecto", tag: "ETAPA 01" },
  CONTACTADO: { label: "Primer Contacto", tag: "ETAPA 02" },
  CITA_SHOWROOM: { label: "Cita en Showroom", tag: "ETAPA 03" },
  COTIZACION_ENVIADA: { label: "Cotización Enviada", tag: "ETAPA 04" },
  NEGOCIACION: { label: "En Negociación", tag: "ETAPA 05" },
  GANADO: { label: "Cerrado / Ganado", tag: "ÉXITO" },
  PERDIDO: { label: "No Concretado", tag: "ARCHIVADO" },
};

export const LEAD_SOURCE_MAP: Record<LeadSource, string> = {
  INSTAGRAM: "Instagram Atelier",
  SHOWROOM_DIRECTO: "Visita Showroom",
  ARQUITECTO_DISENADOR: "Estudio de Arquitectura",
  SITIO_WEB: "Catálogo Online",
  REFERIDO: "Cliente VIP Referido",
  EVENTO_DISENO: "Feria de Diseño",
};
