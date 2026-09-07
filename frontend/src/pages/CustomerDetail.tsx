import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  Calendar,
  Eye,
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
    return <div className="p-10 text-center text-ink-500">Cargando expediente del cliente...</div>;
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
        className="text-xs uppercase font-semibold text-ink-500 hover:text-ink-950 flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al Directorio
      </Link>

      {/* Tarjeta de Encabezado Dossier */}
      <div className="editorial-card p-8 bg-surface border border-ink-200">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-ink-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-tag text-brass-600">Expediente de Cliente N° {customer.id}</span>
              {customer.isVip && (
                <Badge variant="brass" size="sm">
                  <Sparkles className="w-2.5 h-2.5 mr-1 inline" /> VIP
                </Badge>
              )}
              <Badge variant="default" size="sm">
                {customer.clientType === "PARTICULAR" ? "Particular" : "Cuenta Comercial B2B"}
              </Badge>
            </div>
            <h1 className="font-serif text-3xl font-normal text-ink-950">{customer.name}</h1>
            <p className="text-xs text-ink-500 font-mono mt-1">
              Registrado el {formatDate(customer.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="btn-editorial-primary"
            >
              <MessageCircle className="w-3.5 h-3.5 mr-2" /> Iniciar Chat WhatsApp
            </a>
          </div>
        </div>

        {/* Métricas y Datos Rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 font-mono text-xs">
          <div>
            <span className="text-[10px] text-ink-400 uppercase block">Facturación Histórica</span>
            <p className="font-serif text-2xl font-normal text-ink-950 mt-0.5">
              {formatCurrency(lifetimeValue)}
            </p>
          </div>
          <div>
            <span className="text-[10px] text-ink-400 uppercase block">Teléfono de Contacto</span>
            <p className="text-ink-950 font-bold mt-0.5">{customer.phone}</p>
          </div>
          <div>
            <span className="text-[10px] text-ink-400 uppercase block">Ubicación / Dirección</span>
            <p className="text-ink-950 mt-0.5">{customer.address ? `${customer.address}, ${customer.city || ""}` : "No especificada"}</p>
          </div>
        </div>

        {customer.notes && (
          <div className="mt-6 pt-4 border-t border-ink-100">
            <span className="editorial-tag text-brass-600 block mb-1">Notas & Observaciones</span>
            <p className="text-xs text-ink-700 italic bg-canvas-alt p-3 border-l-2 border-brass-500 font-light">
              "{customer.notes}"
            </p>
          </div>
        )}
      </div>

      {/* Historial de Pedidos */}
      <div className="editorial-card p-8">
        <div className="flex items-center justify-between pb-4 border-b border-ink-100 mb-6">
          <div>
            <span className="editorial-tag text-brass-600">Historial de Compras</span>
            <h3 className="font-serif text-xl font-normal text-ink-950 mt-0.5">
              Órdenes Registradas
            </h3>
          </div>
          <span className="text-xs font-mono text-ink-400">
            {customer.orders?.length || 0} órdenes en total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-ink-100 text-[10px] font-mono text-ink-400 uppercase">
                <th className="pb-3 font-medium">N° Orden</th>
                <th className="pb-3 font-medium">Fecha</th>
                <th className="pb-3 font-medium">Etapa Operativa</th>
                <th className="pb-3 font-medium text-right">Total</th>
                <th className="pb-3 font-medium text-center">Estado</th>
                <th className="pb-3 font-medium text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100/60">
              {(customer.orders || []).map((order) => (
                <tr key={order.id} className="hover:bg-canvas-alt/40 transition-colors">
                  <td className="py-3 font-mono font-bold text-ink-950">
                    <Link to={`/orders/${order.id}`} className="hover:text-brass-600">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3 text-ink-500 font-mono">{formatDate(order.createdAt)}</td>
                  <td className="py-3 text-ink-700 italic">{order.workshopStage || "En Preparación"}</td>
                  <td className="py-3 text-right font-mono font-bold text-ink-950">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="py-3 text-center">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="py-3 text-center">
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-brass-600 hover:text-ink-950 font-semibold uppercase text-[10px]"
                    >
                      Ver Ficha
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
