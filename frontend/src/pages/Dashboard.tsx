import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  ArrowRight,
  Sparkles,
  Plus,
  Compass,
} from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "../components/ui/StatCard";
import OrderStatusBadge from "../components/ui/OrderStatusBadge";
import Button from "../components/ui/Button";
import { formatCurrency, formatDate } from "../utils/format";
import api from "../api/axios";
import { Order, Product } from "../types";

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<{
    salesToday: { total: number; count: number };
    salesMonth: { total: number; count: number };
    pendingOrders: number;
    newCustomersMonth: number;
    lowStockCount: number;
    lowStockProducts: Product[];
    lastOrders: Order[];
  }>({
    salesToday: { total: 4850000, count: 2 },
    salesMonth: { total: 42900000, count: 14 },
    pendingOrders: 5,
    newCustomersMonth: 8,
    lowStockCount: 2,
    lowStockProducts: [
      {
        id: 2,
        sku: "PROD-002",
        name: "Servicio de Diseño & Consultoría",
        collection: "Línea Corporativa",
        price: 2450000,
        stock: 2,
        minStock: 3,
        inShowroom: true,
        isActive: true,
        categoryId: 1,
        createdAt: new Date().toISOString(),
      },
    ],
    lastOrders: [
      {
        id: 101,
        orderNumber: "ORD-26-8901",
        status: "IN_PRODUCTION",
        subtotal: 9700000,
        discount: 0,
        total: 9700000,
        paidAmount: 4850000,
        workshopStage: "En Desarrollo / Preparación",
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
        details: [],
      },
      {
        id: 102,
        orderNumber: "ORD-26-8902",
        status: "CONFIRMED",
        subtotal: 6800000,
        discount: 300000,
        total: 6500000,
        paidAmount: 3250000,
        workshopStage: "Confirmado / Anticipo 50%",
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
        details: [],
      },
    ],
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard/summary");
        if (res.data?.data) {
          setData(res.data.data);
        }
      } catch {
        // Fallback demo
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-10">
      {/* Cabecera Editorial Limpia */}
      <header className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-ink-100 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="editorial-tag text-brass-600">The Daily Digest · Resumen General</span>
            <span className="text-[10px] text-ink-300">·</span>
            <span className="text-[10px] font-mono text-ink-400 uppercase">Maison & Commerce</span>
          </div>
          <h1 className="font-serif text-4xl font-normal text-ink-950">
            Panorama <span className="italic font-light text-brass-600">&</span> Métricas del Negocio
          </h1>
          <p className="text-sm text-ink-600 mt-2 font-light max-w-xl">
            Control de ingresos diarios, pedidos en curso, facturación consolidada y catálogo comercial.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/inventory">
            <Button variant="secondary" size="md">
              <Package className="w-3.5 h-3.5 mr-2" /> Ver Catálogo
            </Button>
          </Link>
          <Link to="/orders">
            <Button variant="primary" size="md">
              <Plus className="w-3.5 h-3.5 mr-2" /> Nueva Orden
            </Button>
          </Link>
        </div>
      </header>

      {/* Tarjetas de Indicadores Principales */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          tag="Finanzas Hoy"
          title="Ventas del Día"
          value={formatCurrency(data.salesToday?.total || 0)}
          change={`+${data.salesToday?.count || 0} órdenes hoy`}
          isPositive={true}
          icon={TrendingUp}
        />
        <StatCard
          tag="Facturación Mensual"
          title="Acumulado del Mes"
          value={formatCurrency(data.salesMonth?.total || 0)}
          change={`${data.salesMonth?.count || 0} órdenes cerradas`}
          isPositive={true}
          icon={ShoppingBag}
        />
        <StatCard
          tag="Operación Activa"
          title="Pedidos en Curso"
          value={data.pendingOrders || 0}
          subtitle="En preparación o entrega"
          icon={Package}
        />
        <StatCard
          tag="Directorio"
          title="Nuevos Clientes"
          value={data.newCustomersMonth || 0}
          change="+18% vs mes previo"
          isPositive={true}
          icon={Users}
        />
      </section>

      {/* Tabla de Órdenes Recientes */}
      <div className="editorial-card p-6">
        <div className="flex items-center justify-between pb-4 border-b border-ink-100 mb-6">
          <div>
            <span className="editorial-tag text-brass-600">Registro de Transacciones</span>
            <h3 className="font-serif text-xl font-normal text-ink-950 mt-0.5">
              Últimas Órdenes de Venta
            </h3>
          </div>
          <Link
            to="/orders"
            className="text-xs uppercase font-semibold text-brass-600 hover:text-ink-950 flex items-center gap-1 transition-colors"
          >
            Ver Todas <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-ink-100 text-[10px] font-mono text-ink-400 uppercase">
                <th className="pb-3 font-medium">N° Orden</th>
                <th className="pb-3 font-medium">Cliente / Cuenta</th>
                <th className="pb-3 font-medium text-right">Progreso Anticipo</th>
                <th className="pb-3 font-medium text-right">Total</th>
                <th className="pb-3 font-medium text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100/60">
              {data.lastOrders.map((order) => {
                const paidPercent = Math.round(
                  (Number(order.paidAmount) / Number(order.total || 1)) * 100
                );
                return (
                  <tr key={order.id} className="hover:bg-canvas-alt/40 transition-colors">
                    <td className="py-3.5 font-mono text-ink-900 font-semibold">
                      <Link to={`/orders/${order.id}`} className="hover:text-brass-600">
                        {order.orderNumber}
                      </Link>
                      <span className="block text-[10px] text-ink-400 font-normal">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <p className="font-medium text-ink-900">{order.customer?.name}</p>
                      <span className="text-[10px] text-ink-500 font-mono">
                        {order.customer?.phone}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-mono">
                      <span className="text-ink-950 font-semibold">
                        {formatCurrency(order.paidAmount)}
                      </span>
                      <p className="text-[10px] text-sage-600 font-medium">
                        {paidPercent}% Cubierto
                      </p>
                    </td>
                    <td className="py-3.5 text-right font-mono font-bold text-ink-950 text-sm">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-3.5 text-right">
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
