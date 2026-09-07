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
          name: "Sillón Lounge de Diseño Editorial",
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
    return <div className="p-10 text-center text-ink-500">Cargando detalles de la orden...</div>;
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
          className="text-xs uppercase font-semibold text-ink-500 hover:text-ink-950 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a Órdenes
        </Link>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => window.print()}
          className="print:hidden"
        >
          <Printer className="w-3.5 h-3.5 mr-1.5" /> Imprimir Proforma
        </Button>
      </div>

      {/* DOCUMENTO EDITORIAL / FACTURA PROFORMA */}
      <div className="editorial-card p-10 bg-surface border border-ink-200 space-y-10 shadow-elevated">
        {/* Cabecera de la Casa / Negocio */}
        <div className="flex flex-col md:flex-row md:items-start justify-between pb-8 border-b border-ink-100 gap-6">
          <div>
            <span className="editorial-tag text-brass-600">Proforma Oficial de Venta</span>
            <h1 className="font-serif text-3xl font-normal text-ink-950 mt-1">
              Global <span className="italic font-light text-brass-600">Commerce</span>
            </h1>
            <p className="text-xs text-ink-500 mt-1 italic font-light">
              Maison & Commerce · Gestión Comercial & Servicios
            </p>
          </div>

          <div className="text-left md:text-right font-mono">
            <span className="editorial-tag text-ink-400 block">Número de Factura / Orden</span>
            <h2 className="text-2xl font-bold text-ink-950 mt-0.5">{order.orderNumber}</h2>
            <p className="text-xs text-ink-500 mt-1">Fecha de Emisión: {formatDate(order.createdAt)}</p>
            <div className="mt-2">
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
        </div>

        {/* Datos del Cliente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-sans">
          <div className="p-4 bg-canvas-alt border border-ink-100 space-y-1.5">
            <span className="editorial-tag text-brass-600">Cliente Destinatario</span>
            <h3 className="font-serif text-lg font-medium text-ink-950">{order.customer?.name}</h3>
            {order.customer?.email && (
              <p className="text-ink-600 font-mono text-[11px]">{order.customer.email}</p>
            )}
            <p className="text-ink-600">{order.customer?.phone}</p>
            {order.customer?.address && (
              <p className="text-ink-500 italic">
                {order.customer.address}, {order.customer.city}
              </p>
            )}
          </div>

          <div className="p-4 bg-canvas-alt border border-ink-100 space-y-2 font-mono">
            <span className="editorial-tag text-brass-600">Información de Entrega & Operación</span>
            <div className="flex items-center justify-between">
              <span className="text-ink-500">Estado Operativo:</span>
              <strong className="text-ink-950">{order.workshopStage || "En Preparación"}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-500">Fecha Estimada de Entrega:</span>
              <span className="text-ink-950">{formatDate(order.deliveryDate)}</span>
            </div>
          </div>
        </div>

        {/* Tabla Desglosada de Ítems */}
        <div>
          <span className="editorial-tag text-brass-600 mb-3 block">Desglose de Ítems & Servicios</span>
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-ink-200 text-[10px] font-mono text-ink-400 uppercase bg-canvas-alt">
                <th className="p-3 font-medium">SKU / Ref</th>
                <th className="p-3 font-medium">Descripción & Especificaciones</th>
                <th className="p-3 font-medium text-center">Cant.</th>
                <th className="p-3 font-medium text-right">Precio Unitario</th>
                <th className="p-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {order.details.map((detail, idx) => (
                <tr key={idx}>
                  <td className="p-3 font-mono font-bold text-ink-900">
                    {detail.product?.sku || `REF-${detail.productId}`}
                  </td>
                  <td className="p-3">
                    <p className="font-serif text-sm font-medium text-ink-950">
                      {detail.product?.name || "Ítem de Catálogo"}
                    </p>
                    {detail.finishNotes && (
                      <p className="text-xs text-ink-600 italic mt-0.5 font-light">
                        {detail.finishNotes}
                      </p>
                    )}
                  </td>
                  <td className="p-3 text-center font-mono">{detail.quantity}</td>
                  <td className="p-3 text-right font-mono">{formatCurrency(detail.unitPrice)}</td>
                  <td className="p-3 text-right font-mono font-bold text-ink-950">
                    {formatCurrency(detail.lineTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumen Financiero y Esquema de Pagos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-ink-100">
          {/* Historial de Pagos y Anticipos */}
          <div className="space-y-3">
            <span className="editorial-tag text-brass-600">Historial de Pagos & Abonos</span>
            {order.payments && order.payments.length > 0 ? (
              <div className="space-y-2">
                {order.payments.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-canvas-alt border border-ink-100 flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <span className="font-bold text-ink-950">{formatCurrency(p.amount)}</span>
                      <p className="text-[10px] text-ink-400">{p.method}</p>
                    </div>
                    <span className="text-[10px] text-sage-700 bg-sage-50 px-2 py-0.5 border border-sage-200">
                      {formatDate(p.paymentDate)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-ink-400 italic">No se registran pagos previos para este pedido.</p>
            )}
          </div>

          {/* Liquidación Final */}
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-ink-600">
              <span>Subtotal:</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex items-center justify-between text-clay-600">
                <span>Descuento Aplicado:</span>
                <span>- {formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-base font-bold text-ink-950 pt-2 border-t border-ink-200 font-serif">
              <span>Total Orden:</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
            <div className="flex items-center justify-between text-sage-600 pt-1">
              <span>Abonos Recibidos ({paidPercent}%):</span>
              <span>{formatCurrency(order.paidAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-clay-700 font-bold pt-2 border-t border-ink-100 bg-clay-50/50 p-2">
              <span>Saldo Pendiente:</span>
              <span>{formatCurrency(balanceDue)}</span>
            </div>
          </div>
        </div>

        {/* Firmas de Conformidad */}
        <div className="grid grid-cols-2 gap-12 pt-12 border-t border-ink-100 text-center text-xs text-ink-500 font-mono">
          <div>
            <div className="border-t border-ink-300 w-48 mx-auto mb-2" />
            <p className="font-semibold text-ink-900">Emisor Comercial</p>
            <p className="text-[10px]">Global CRM · Maison & Commerce</p>
          </div>
          <div>
            <div className="border-t border-ink-300 w-48 mx-auto mb-2" />
            <p className="font-semibold text-ink-900">{order.customer?.name}</p>
            <p className="text-[10px]">Aceptación del Cliente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
