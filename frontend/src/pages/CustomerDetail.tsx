import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  MessageSquareShare,
  ShoppingBag,
  Sparkles,
  Calendar,
  Eye,
  ShieldCheck,
} from "lucide-react";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import OrderStatusBadge from "../components/ui/OrderStatusBadge";
import { formatCurrency, formatDate } from "../utils/format";
import api from "../api/axios";
import { Customer } from "../types";

export const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>({
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
    orders: [
      {
        id: 101,
        orderNumber: "ORD-26-8901",
        status: "IN_PRODUCTION",
        subtotal: 9700000,
        discount: 0,
        total: 9700000,
        paidAmount: 4850000,
        workshopStage: "En Desarrollo / Preparación",
        createdAt: "2026-09-02T10:00:00Z",
        customerId: 1,
        customer: {} as any,
        details: [],
      },
    ],
  });

  const fetchCustomer = async () => {
    try {
      const res = await api.get(`/customers/${id}`);
      if (res.data?.data) {
        setCustomer(res.data.data);
      }
    } catch {
      // Mock
    }
  };

  useEffect(() => {
    if (id) fetchCustomer();
  }, [id]);

  if (!customer) {
    return <div className="p-10 text-center text-neu-text-muted">Cargando expediente del cliente...</div>;
  }

  const lifetimeValue = (customer.orders || []).reduce(
    (sum, o) => sum + Number(o.total || 0),
    0
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Volver */}
      <Link
        to="/customers"
        className="px-4 py-2 rounded-2xl bg-neu-surface shadow-neu-raised-xs border border-white/60 text-xs font-bold text-neu-text-sub hover:text-neu-text-dark hover:shadow-neu-inset inline-flex items-center gap-2 transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al Directorio
      </Link>

      {/* Tarjeta de Encabezado Expediente */}
      <div className="neu-card p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-neu-surfaceDark/50">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent bg-neu-surface px-3 py-1 rounded-full shadow-neu-inset-sm border border-white/20">
                Expediente N° {customer.id}
              </span>
              {customer.isVip && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-neu-warning bg-neu-surface px-2.5 py-0.5 rounded-full shadow-neu-inset-sm border border-white/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> VIP
                </span>
              )}
              <span className="text-[10px] font-semibold text-neu-text-sub bg-neu-surface px-2.5 py-0.5 rounded-full shadow-neu-raised-xs border border-white/60">
                {customer.clientType === "PARTICULAR" ? "Particular" : "Cuenta Corporativa B2B"}
              </span>
            </div>
            <h1 className="font-display text-3xl font-extrabold text-neu-text-dark">{customer.name}</h1>
            <p className="text-xs text-neu-text-muted font-mono mt-1">
              Registrado el {formatDate(customer.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-2xl bg-neu-surface shadow-neu-raised-sm border border-white/60 text-xs font-bold text-neu-success hover:shadow-neu-inset inline-flex items-center gap-2 transition-all"
            >
              <MessageSquareShare className="w-4 h-4 text-neu-success" /> Iniciar Chat WhatsApp
            </a>
          </div>
        </div>

        {/* Métricas y Datos Rápidos en Paneles Hundidos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-neu-surface shadow-neu-inset border border-white/20">
            <span className="text-[10px] text-neu-text-muted uppercase font-sans font-bold block">
              Facturación Histórica
            </span>
            <p className="font-display text-xl font-black text-neu-text-dark mt-1">
              {formatCurrency(lifetimeValue)}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-neu-surface shadow-neu-inset border border-white/20">
            <span className="text-[10px] text-neu-text-muted uppercase font-sans font-bold block">
              Teléfono de Contacto
            </span>
            <p className="text-neu-text-dark font-bold mt-1 text-sm">{customer.phone}</p>
          </div>
          <div className="p-4 rounded-2xl bg-neu-surface shadow-neu-inset border border-white/20">
            <span className="text-[10px] text-neu-text-muted uppercase font-sans font-bold block">
              Ubicación
            </span>
            <p className="text-neu-text-dark font-bold mt-1 text-xs truncate">
              {customer.address ? `${customer.address}, ${customer.city || ""}` : "No especificada"}
            </p>
          </div>
        </div>

        {customer.notes && (
          <div className="p-4 rounded-2xl bg-neu-surface shadow-neu-inset border border-white/20 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent block">
              Notas & Preferencias
            </span>
            <p className="text-xs text-neu-text-sub italic">
              "{customer.notes}"
            </p>
          </div>
        )}
      </div>

      {/* Historial de Pedidos */}
      <div className="neu-card p-6 md:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-neu-surfaceDark/50 mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent bg-neu-surface px-3 py-1 rounded-full shadow-neu-inset-sm border border-white/20">
              Historial de Transacciones
            </span>
            <h3 className="font-display text-xl font-bold text-neu-text-dark mt-2">
              Órdenes Registradas
            </h3>
          </div>
          <span className="text-xs font-mono text-neu-text-muted">
            {customer.orders?.length || 0} órdenes en total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neu-surfaceDark/40 text-[10px] font-bold uppercase tracking-wider text-neu-text-muted">
                <th className="pb-3 pl-3">N° Orden</th>
                <th className="pb-3">Fecha</th>
                <th className="pb-3">Etapa Operativa</th>
                <th className="pb-3 text-right">Total</th>
                <th className="pb-3 text-center">Estado</th>
                <th className="pb-3 text-center pr-3">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neu-surfaceDark/30">
              {(customer.orders || []).map((order) => (
                <tr key={order.id} className="hover:bg-white/40 transition-colors">
                  <td className="py-4 pl-3 font-mono font-bold text-neu-text-dark">
                    <Link to={`/orders/${order.id}`} className="hover:text-neu-accent">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-4 text-neu-text-muted font-mono">{formatDate(order.createdAt)}</td>
                  <td className="py-4 text-neu-text-sub font-medium">{order.workshopStage || "En Preparación"}</td>
                  <td className="py-4 text-right font-mono font-extrabold text-neu-text-dark">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="py-4 text-center">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="py-4 text-center pr-3">
                    <Link
                      to={`/orders/${order.id}`}
                      className="px-3 py-1.5 rounded-xl bg-neu-surface shadow-neu-raised-xs border border-white/60 text-xs font-bold text-neu-accent hover:shadow-neu-inset inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> Ficha
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
