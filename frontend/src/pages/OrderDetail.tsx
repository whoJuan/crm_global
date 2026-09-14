import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Printer,
  Calendar,
  User,
  Phone,
  Building,
  CheckCircle2,
  Clock,
  Sparkles,
  Receipt,
  CreditCard,
} from "lucide-react";
import Button from "../components/ui/Button";
import OrderStatusBadge from "../components/ui/OrderStatusBadge";
import { formatCurrency, formatDate } from "../utils/format";
import api from "../api/axios";
import { Order } from "../types";

export const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>({
    id: 101,
    orderNumber: "ORD-26-8901",
    status: "IN_PRODUCTION",
    subtotal: 9700000,
    discount: 0,
    total: 9700000,
    paidAmount: 4850000,
    workshopStage: "En Desarrollo / Preparación",
    deliveryDate: "2026-10-15",
    createdAt: new Date().toISOString(),
    customerId: 1,
    customer: {
      id: 1,
      name: "Carolina Santamaría (Estudio Vanguardia)",
      email: "carolina@estudiovanguardia.com",
      phone: "+57 300 456 7890",
      address: "Calle 85 #11-53, PH 901",
      city: "Bogotá",
      isVip: true,
      clientType: "ESTUDIO_ARQUITECTURA",
      createdAt: new Date().toISOString(),
    },
    createdBy: { id: 1, name: "Valeria Robledo", email: "admin@crmglobal.com" },
    details: [
      {
        id: 1,
        productId: 1,
        quantity: 2,
        unitPrice: 4850000,
        lineTotal: 9700000,
        finishNotes: "Especificaciones y acabados de entrega estándar",
        product: {
          id: 1,
          sku: "ART-001",
          name: "Sillón Lounge de Diseño",
          collection: "Línea Signature",
          dimensions: "90 x 95 x 82 cm",
          price: 4850000,
          stock: 6,
          minStock: 2,
          inShowroom: true,
          isActive: true,
          categoryId: 1,
          createdAt: new Date().toISOString(),
        },
      },
    ],
    payments: [
      {
        id: 1,
        orderId: 101,
        amount: 4850000,
        method: "TRANSFERENCIA_BANCARIA",
        reference: "TRANSF-BANCOLOMBIA-9921",
        notes: "Anticipo 50% de inicio",
        paymentDate: new Date().toISOString(),
      },
    ],
  });

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      if (res.data?.data) {
        setOrder(res.data.data);
      }
    } catch {
      // Usar mock
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  if (!order) {
    return <div className="p-10 text-center text-neu-text-muted">Cargando detalles de la orden...</div>;
  }

  const balanceDue = Math.max(0, Number(order.total) - Number(order.paidAmount));
  const paidPercent = Math.round(
    (Number(order.paidAmount) / Number(order.total || 1)) * 100
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Barra de Acciones Superior */}
      <div className="flex items-center justify-between">
        <Link
          to="/orders"
          className="px-4 py-2 rounded-2xl bg-neu-surface shadow-neu-raised-xs border border-white/60 text-xs font-bold text-neu-text-sub hover:text-neu-text-dark hover:shadow-neu-inset flex items-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a Órdenes
        </Link>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => window.print()}
          className="print:hidden"
        >
          <Printer className="w-3.5 h-3.5 mr-1.5 text-neu-accent" /> Imprimir Proforma
        </Button>
      </div>

      {/* FICHA PROFORMA NEUMÓRFICA */}
      <div className="neu-card p-8 md:p-12 space-y-8 shadow-neu-raised-lg">
        {/* Cabecera del Documento */}
        <div className="flex flex-col md:flex-row md:items-start justify-between pb-6 border-b border-neu-surfaceDark/50 gap-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent bg-neu-surface px-3 py-1 rounded-full shadow-neu-inset-sm border border-white/20">
              Proforma Oficial de Venta
            </span>
            <h1 className="font-display text-3xl font-extrabold text-neu-text-dark mt-2">
              Global <span className="text-neu-accent">CRM Studio</span>
            </h1>
            <p className="text-xs text-neu-text-sub mt-0.5">
              Gestión Comercial, Pedidos y Servicios
            </p>
          </div>

          <div className="text-left md:text-right font-mono">
            <span className="text-[10px] uppercase font-bold text-neu-text-muted block">
              Número de Orden
            </span>
            <h2 className="text-2xl font-bold text-neu-text-dark mt-0.5">{order.orderNumber}</h2>
            <p className="text-xs text-neu-text-sub mt-1">Emisión: {formatDate(order.createdAt)}</p>
            <div className="mt-2 flex md:justify-end">
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
        </div>

        {/* Datos del Cliente & Entrega en Tarjetas Hundidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-5 rounded-3xl bg-neu-surface shadow-neu-inset border border-white/20 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent">
              Cliente Destinatario
            </span>
            <h3 className="font-display text-base font-bold text-neu-text-dark">
              {order.customer?.name}
            </h3>
            {order.customer?.email && (
              <p className="text-neu-text-sub font-mono text-[11px]">{order.customer.email}</p>
            )}
            <p className="text-neu-text-sub">{order.customer?.phone}</p>
            {order.customer?.address && (
              <p className="text-neu-text-muted italic">
                {order.customer.address}, {order.customer.city}
              </p>
            )}
          </div>

          <div className="p-5 rounded-3xl bg-neu-surface shadow-neu-inset border border-white/20 space-y-2.5 font-mono">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent">
              Información de Operación & Entrega
            </span>
            <div className="flex items-center justify-between">
              <span className="text-neu-text-muted">Etapa de Taller:</span>
              <strong className="text-neu-text-dark font-semibold">
                {order.workshopStage || "En Preparación"}
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neu-text-muted">Fecha Estimada:</span>
              <span className="text-neu-text-dark font-semibold">{formatDate(order.deliveryDate)}</span>
            </div>
          </div>
        </div>

        {/* Tabla Desglosada de Ítems */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent mb-3 block pl-1">
            Desglose de Ítems & Servicios
          </span>
          <div className="overflow-x-auto rounded-2xl bg-neu-surface shadow-neu-inset-sm border border-white/20 p-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neu-surfaceDark/40 text-[10px] font-bold uppercase tracking-wider text-neu-text-muted">
                  <th className="p-3">SKU / Ref</th>
                  <th className="p-3">Descripción & Acabados</th>
                  <th className="p-3 text-center">Cant.</th>
                  <th className="p-3 text-right">Precio Unitario</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neu-surfaceDark/30">
                {order.details.map((detail, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-mono font-bold text-neu-text-dark">
                      {detail.product?.sku || `REF-${detail.productId}`}
                    </td>
                    <td className="p-3">
                      <p className="font-bold text-neu-text-dark">
                        {detail.product?.name || "Ítem de Catálogo"}
                      </p>
                      {detail.finishNotes && (
                        <p className="text-xs text-neu-text-sub mt-0.5">{detail.finishNotes}</p>
                      )}
                    </td>
                    <td className="p-3 text-center font-mono font-semibold">{detail.quantity}</td>
                    <td className="p-3 text-right font-mono">{formatCurrency(detail.unitPrice)}</td>
                    <td className="p-3 text-right font-mono font-bold text-neu-text-dark">
                      {formatCurrency(detail.lineTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen Financiero y Esquema de Pagos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neu-surfaceDark/50">
          {/* Historial de Pagos y Anticipos */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent pl-1">
              Historial de Pagos & Anticipos
            </span>
            {order.payments && order.payments.length > 0 ? (
              <div className="space-y-2">
                {order.payments.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-neu-surface shadow-neu-raised-xs border border-white/60 flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <span className="font-bold text-neu-text-dark">{formatCurrency(p.amount)}</span>
                      <p className="text-[10px] text-neu-text-muted">{p.method}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-neu-success bg-neu-surface px-2.5 py-0.5 rounded-full shadow-neu-inset-sm border border-white/20">
                      {formatDate(p.paymentDate)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neu-text-muted italic">No se registran pagos previos para este pedido.</p>
            )}
          </div>

          {/* Liquidación Final */}
          <div className="p-5 rounded-3xl bg-neu-surface shadow-neu-raised-sm border border-white/60 space-y-2.5 text-xs font-mono">
            <div className="flex items-center justify-between text-neu-text-sub">
              <span>Subtotal:</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex items-center justify-between text-neu-danger">
                <span>Descuento Especial:</span>
                <span>- {formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-base font-bold text-neu-text-dark pt-2 border-t border-neu-surfaceDark/50">
              <span>Total Facturado:</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
            <div className="flex items-center justify-between text-neu-success pt-1 font-semibold">
              <span>Abonos Recibidos ({paidPercent}%):</span>
              <span>{formatCurrency(order.paidAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-neu-danger font-bold pt-2 border-t border-neu-surfaceDark/50 bg-neu-surface rounded-2xl shadow-neu-inset p-3">
              <span>Saldo Pendiente:</span>
              <span className="text-base">{formatCurrency(balanceDue)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
