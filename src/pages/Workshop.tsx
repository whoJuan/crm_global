import React, { useEffect, useState } from "react";
import {
  Hammer,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  User,
  Calendar,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import OrderStatusBadge from "../components/ui/OrderStatusBadge";
import { formatCurrency, formatDate } from "../utils/format";
import api from "../api/axios";
import { Order } from "../types";

const WORKSHOP_STAGES = [
  { id: "Estructura de Madera", title: "01. Estructura & Ebanistería", desc: "Corte de roble/nogal y ensamble" },
  { id: "Espumado & Tapicería", title: "02. Espumado & Tapizado", desc: "Montaje de lino, bouclé o cuero" },
  { id: "Laca & Acabados", title: "03. Laca & Herrajes", desc: "Acabado cera mate y latón" },
  { id: "Control de Calidad", title: "04. Inspección QC", desc: "Confort, estabilidad y acabados" },
  { id: "Listo para Despacho", title: "05. Empaque & Logística", desc: "Listo para transporte e instalación" },
];

export const Workshop: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 101,
      orderNumber: "ORD-26-8901",
      status: "IN_PRODUCTION",
      subtotal: 9700000,
      discount: 0,
      total: 9700000,
      paidAmount: 4850000,
      workshopStage: "Espumado & Tapicería",
      craftsmanName: "Maestro Donato",
      deliveryDate: "2026-10-15",
      createdAt: new Date().toISOString(),
      customerId: 1,
      customer: {
        id: 1,
        name: "Carolina Santamaría (Estudio Vanguardia)",
        phone: "+57 300 456 7890",
        isVip: true,
        clientType: "ESTUDIO_ARQUITECTURA",
        createdAt: new Date().toISOString(),
      },
      details: [
        {
          productId: 1,
          quantity: 2,
          unitPrice: 4850000,
          lineTotal: 9700000,
          finishNotes: "2x Sofá Milano Curvo en Lino Crudo Belga",
        },
      ],
    },
    {
      id: 102,
      orderNumber: "ORD-26-8902",
      status: "CONFIRMED",
      subtotal: 6800000,
      discount: 300000,
      total: 6500000,
      paidAmount: 3250000,
      workshopStage: "Estructura de Madera",
      craftsmanName: "Ebanistería Central",
      deliveryDate: "2026-10-28",
      createdAt: new Date().toISOString(),
      customerId: 2,
      customer: {
        id: 2,
        name: "Alejandro Echeverri",
        phone: "+57 312 890 1234",
        isVip: true,
        clientType: "PARTICULAR",
        createdAt: new Date().toISOString(),
      },
      details: [
        {
          productId: 3,
          quantity: 1,
          unitPrice: 6800000,
          lineTotal: 6800000,
          finishNotes: "1x Mesa Comedor Monolith 8P en Nogal Macizo",
        },
      ],
    },
    {
      id: 103,
      orderNumber: "ORD-26-8903",
      status: "QUALITY_CHECK",
      subtotal: 3750000,
      discount: 0,
      total: 3750000,
      paidAmount: 3750000,
      workshopStage: "Control de Calidad",
      craftsmanName: "Maestro Álvaro",
      deliveryDate: "2026-09-20",
      createdAt: new Date().toISOString(),
      customerId: 3,
      customer: {
        id: 3,
        name: "Mariana Restrepo",
        phone: "+57 315 234 5678",
        isVip: false,
        clientType: "PARTICULAR",
        createdAt: new Date().toISOString(),
      },
      details: [
        {
          productId: 6,
          quantity: 1,
          unitPrice: 3750000,
          lineTotal: 3750000,
          finishNotes: "Escritorio Magistral Praga con herrajes de latón",
        },
      ],
    },
  ]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      if (res.data?.data && res.data.data.length > 0) {
        setOrders(res.data.data);
      }
    } catch {
      // Mock
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStageChange = async (orderId: number, nextStage: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, {
        workshopStage: nextStage,
        status: nextStage === "Control de Calidad" ? "QUALITY_CHECK" : "IN_PRODUCTION",
      });
    } catch {
      // Optimistic
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, workshopStage: nextStage } : o))
    );
  };

  return (
    <div className="space-y-8">
      {/* Cabecera Editorial */}
      <header className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-ink-100 gap-6">
        <div>
          <span className="editorial-tag text-brass-600">Fabricación & Alta Ebanistería</span>
          <h1 className="font-serif text-4xl font-normal text-ink-950 mt-1">
            Mesa de Taller <span className="italic font-light text-brass-600">&</span> Ebanistas
          </h1>
          <p className="text-sm text-ink-600 mt-2 font-light max-w-xl">
            Trazabilidad por fases artesanales, control de calidad y asignación de maestros ebanistas.
          </p>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="p-3 bg-surface border border-ink-100 flex items-center gap-3">
            <Hammer className="w-4 h-4 text-brass-600" />
            <div>
              <span className="text-[10px] text-ink-400 block uppercase">Capacidad Taller</span>
              <strong className="text-ink-950">85% Ocupación</strong>
            </div>
          </div>
        </div>
      </header>

      {/* Tablero por Fases de Taller */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 items-start overflow-x-auto pb-6">
        {WORKSHOP_STAGES.map((stage) => {
          const stageOrders = orders.filter((o) => o.workshopStage === stage.id);

          return (
            <div key={stage.id} className="bg-canvas-alt/70 border border-ink-100 p-4 min-w-[270px] flex flex-col">
              {/* Encabezado de Fase */}
              <div className="pb-3 border-b border-ink-200/80 mb-4">
                <div className="flex items-center justify-between">
                  <span className="editorial-tag text-ink-900 font-bold">{stage.title}</span>
                  <span className="w-5 h-5 bg-surface border border-ink-200 text-ink-900 font-mono text-[10px] flex items-center justify-center font-bold">
                    {stageOrders.length}
                  </span>
                </div>
                <p className="text-[10px] text-ink-500 font-light italic mt-0.5">{stage.desc}</p>
              </div>

              {/* Tarjetas de Pedidos en Fase */}
              <div className="space-y-4">
                {stageOrders.map((ord) => (
                  <article
                    key={ord.id}
                    className="editorial-card p-4 space-y-3 bg-surface hover:border-brass-400 transition-colors shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/orders/${ord.id}`}
                        className="font-mono text-xs font-bold text-ink-950 hover:text-brass-600"
                      >
                        {ord.orderNumber}
                      </Link>
                      <span className="text-[10px] font-mono text-ink-400">
                        Entrega: {formatDate(ord.deliveryDate)}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif text-sm font-medium text-ink-950">
                        {ord.customer?.name}
                      </h4>
                      {ord.details && ord.details[0] && (
                        <p className="text-[11px] text-ink-600 italic mt-1 bg-canvas-alt p-2 border-l-2 border-brass-400">
                          {ord.details[0].finishNotes || "Pieza en confección"}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-ink-100 flex items-center justify-between font-mono text-[11px]">
                      <span className="text-ink-500 flex items-center gap-1">
                        <User className="w-3 h-3 text-ink-400" />
                        {ord.craftsmanName || "Ebanistería Central"}
                      </span>
                      <strong className="text-ink-950">{formatCurrency(ord.total)}</strong>
                    </div>

                    {/* Selector de Avance de Fase */}
                    <div className="pt-2 border-t border-ink-100">
                      <select
                        value={ord.workshopStage || stage.id}
                        onChange={(e) => handleStageChange(ord.id, e.target.value)}
                        className="bg-canvas-alt text-[10px] font-mono py-1 px-2 border border-ink-200 focus:outline-none focus:border-brass-500 w-full"
                      >
                        {WORKSHOP_STAGES.map((s) => (
                          <option key={s.id} value={s.id}>
                            Pasar a: {s.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </article>
                ))}

                {stageOrders.length === 0 && (
                  <div className="py-8 text-center border border-dashed border-ink-200 bg-canvas/40 text-ink-400 text-xs italic">
                    Sin órdenes en esta etapa
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Workshop;
