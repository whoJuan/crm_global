import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  ArrowRight,
  Sparkles,
  Plus,
  Power,
  Zap,
  Activity,
  ChevronRight,
  Sun,
  Moon,
  Tv,
  Wifi,
  Wind,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "../components/ui/StatCard";
import OrderStatusBadge from "../components/ui/OrderStatusBadge";
import Button from "../components/ui/Button";
import { formatCurrency, formatDate } from "../utils/format";
import api from "../api/axios";
import { Order, Product } from "../types";
import { useAuthStore } from "../store/authStore";

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [powerActive, setPowerActive] = useState(true);
  const [activeScene, setActiveScene] = useState<"morning" | "night">("morning");

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
        // Mock fallback
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8">
      {/* Cabecera Superior con Saludo Neumórfico (Similar a la barra Hi, Larry Williams) */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent bg-neu-surface px-3 py-1 rounded-full shadow-neu-inset-sm border border-white/20">
              Panel Principal · Neumorphism
            </span>
            <span className="w-2 h-2 rounded-full bg-neu-success shadow-neu-glow-success animate-pulse" />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-neu-text-dark">
            Panorama <span className="text-neu-accent">&</span> Métricas del Negocio
          </h1>
          <p className="text-xs text-neu-text-sub mt-1">
            Monitoreo en tiempo real de ingresos comerciales, órdenes en curso y actividad de clientes.
          </p>
        </div>

        {/* Widget Neumórfico de Usuario Estilo Píldora (Como en la imagen de referencia) */}
        <div className="p-3.5 px-5 rounded-3xl bg-neu-surface shadow-neu-raised-sm border border-white/60 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-neu-surface shadow-neu-inset flex items-center justify-center font-bold text-sm text-neu-accent border border-white/20">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : "VR"}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-neu-text-dark leading-tight">
                Hola, {user?.name || "Valeria Robledo"}
              </span>
              <div className="flex gap-1 ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-neu-success" />
                <span className="w-1.5 h-1.5 rounded-full bg-neu-accent" />
              </div>
            </div>
            <p className="text-[10px] font-mono text-neu-text-muted">
              {data.pendingOrders || 5} órdenes activas en curso
            </p>
          </div>
        </div>
      </header>

      {/* Sección Neumórfica Inspirada Directamente en el Diseño Adjunto */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Medidor / Dial Neumórfico + Escenas Rápidas (7 columnas) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tarjeta Medidora / Dial Neumórfico (Exacta a la tarjeta "Air Conditioner" con Dial semicircular) */}
          <div className="neu-card p-6 md:p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-neu-accent" />
                  <h3 className="font-display text-base font-bold text-neu-text-dark">
                    Rendimiento Comercial & Meta
                  </h3>
                </div>
                <p className="text-xs text-neu-text-sub mt-0.5">Control de cumplimiento mensual</p>
              </div>

              {/* Botón táctil Power/On estilo Neumorfismo de la imagen */}
              <button
                onClick={() => setPowerActive(!powerActive)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 border ${
                  powerActive
                    ? "bg-neu-surface shadow-neu-inset border-white/20 text-neu-accent"
                    : "bg-neu-surface shadow-neu-raised-xs border-white/60 text-neu-text-muted"
                }`}
              >
                <span>{powerActive ? "Activo" : "Pausa"}</span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    powerActive
                      ? "bg-neu-accent text-white shadow-neu-glow-accent"
                      : "bg-neu-surface shadow-neu-inset-sm text-neu-text-muted"
                  }`}
                >
                  <Power className="w-3 h-3" />
                </div>
              </button>
            </div>

            {/* Dial Semicircular Neumórfico con Ticks */}
            <div className="flex flex-col items-center justify-center pt-2 relative">
              <div className="relative w-64 h-36 flex items-end justify-center overflow-hidden">
                {/* Arco de ticks neumáticos decorativos */}
                <svg className="w-64 h-64 absolute -top-1" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#DCE3EE"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset="62.8"
                    transform="rotate(-180 100 100)"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#0EA5E9"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset="120"
                    transform="rotate(-180 100 100)"
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  {/* Aguja / Indicador del dial */}
                  <line
                    x1="100"
                    y1="100"
                    x2="135"
                    y2="45"
                    stroke="#0EA5E9"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="100" cy="100" r="6" fill="#2D3748" />
                  <circle cx="135" cy="45" r="3.5" fill="#0EA5E9" />
                </svg>

                {/* Valor Central en el Dial */}
                <div className="text-center pb-2 z-10">
                  <span className="font-display text-4xl font-black text-neu-text-dark tracking-tight">
                    78%
                  </span>
                  <p className="text-[10px] uppercase font-bold text-neu-text-muted tracking-wider mt-0.5">
                    Meta Mensual Cumplida
                  </p>
                </div>
              </div>

              {/* Rango Min/Max */}
              <div className="w-56 flex items-center justify-between text-[11px] font-mono text-neu-text-muted mt-1 px-2">
                <span>0% Base</span>
                <span className="text-neu-accent font-bold">42.9M / 55M COP</span>
                <span>100% Meta</span>
              </div>
            </div>
          </div>

          {/* Dos Tarjetas Táctiles Inferiores (Morning Scene / Night Scene en la imagen) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button
              onClick={() => setActiveScene("morning")}
              className={`p-6 rounded-3xl text-left transition-all duration-300 border ${
                activeScene === "morning"
                  ? "bg-neu-surface shadow-neu-inset border-white/20"
                  : "bg-neu-surface shadow-neu-raised border-white/60 hover:shadow-neu-raised-lg"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activeScene === "morning"
                      ? "bg-neu-accent text-white shadow-neu-glow-accent"
                      : "bg-neu-surface shadow-neu-inset text-neu-text-muted"
                  }`}
                >
                  <Sun className="w-5 h-5" />
                </div>
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-neu-accent" />
                  <span className="w-2 h-2 rounded-full bg-neu-text-muted/40" />
                </div>
              </div>
              <h4 className="font-display text-base font-bold text-neu-text-dark">
                Turno Showroom & Tienda
              </h4>
              <p className="text-xs text-neu-text-sub mt-0.5">7 Asesores activos</p>
            </button>

            <button
              onClick={() => setActiveScene("night")}
              className={`p-6 rounded-3xl text-left transition-all duration-300 border ${
                activeScene === "night"
                  ? "bg-neu-surface shadow-neu-inset border-white/20"
                  : "bg-neu-surface shadow-neu-raised border-white/60 hover:shadow-neu-raised-lg"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activeScene === "night"
                      ? "bg-neu-violet text-white shadow-neu-glow-accent"
                      : "bg-neu-surface shadow-neu-inset text-neu-text-muted"
                  }`}
                >
                  <Moon className="w-5 h-5" />
                </div>
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-neu-violet" />
                  <span className="w-2 h-2 rounded-full bg-neu-text-muted/40" />
                </div>
              </div>
              <h4 className="font-display text-base font-bold text-neu-text-dark">
                Taller & Fabricación
              </h4>
              <p className="text-xs text-neu-text-sub mt-0.5">3 Órdenes en banco de trabajo</p>
            </button>
          </div>

          {/* Barra Pill Inferior (Exacta a "You created 8 scenes / See All" en la imagen) */}
          <div className="p-4 px-6 rounded-full bg-neu-surface shadow-neu-raised-sm border border-white/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                to="/orders"
                className="w-8 h-8 rounded-full bg-neu-surface shadow-neu-inset flex items-center justify-center text-neu-accent hover:scale-105 transition-transform"
              >
                <Plus className="w-4 h-4" />
              </Link>
              <div>
                <p className="text-xs font-bold text-neu-text-dark">
                  Tienes {data.pendingOrders || 5} órdenes en proceso de entrega
                </p>
                <p className="text-[10px] text-neu-text-muted">14 órdenes completadas este mes</p>
              </div>
            </div>
            <Link
              to="/orders"
              className="px-4 py-1.5 rounded-full bg-neu-surface shadow-neu-raised-xs border border-white/60 text-xs font-bold text-neu-accent hover:shadow-neu-inset transition-all"
            >
              Ver Todas
            </Link>
          </div>
        </div>

        {/* Columna Derecha: Panel de Analítica Comercial con Lista de Tarjetas Extruidas (5 columnas) */}
        <div className="lg:col-span-5">
          <div className="neu-card p-6 md:p-7 space-y-5">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-neu-surface shadow-neu-inset flex items-center justify-center text-neu-accent">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-neu-text-dark">
                    Líneas de Negocio & Flujo
                  </h3>
                  <p className="text-[11px] text-neu-text-muted">Distribución de ingresos</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-neu-surface shadow-neu-raised-xs flex items-center justify-center text-neu-text-muted">
                <TrendingUp className="w-4 h-4 text-neu-accent" />
              </div>
            </div>

            {/* Lista de Filas Táctiles Neumórficas (Exactas a las filas Air Conditioner, Wi-Fi Router, etc.) */}
            <div className="space-y-3">
              <div className="p-3.5 px-4 rounded-2xl bg-neu-surface shadow-neu-raised-xs border border-white/60 flex items-center justify-between group hover:shadow-neu-raised transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-neu-surface shadow-neu-inset flex items-center justify-center text-neu-accent">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neu-text-dark">Línea Signature & Hogar</p>
                    <p className="text-[10px] text-neu-text-muted font-mono">8 Unidades | $28.4M COP</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neu-text-muted group-hover:text-neu-accent group-hover:translate-x-0.5 transition-all" />
              </div>

              <div className="p-3.5 px-4 rounded-2xl bg-neu-surface shadow-neu-raised-xs border border-white/60 flex items-center justify-between group hover:shadow-neu-raised transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-neu-surface shadow-neu-inset flex items-center justify-center text-neu-success">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neu-text-dark">Proyectos Corporativos</p>
                    <p className="text-[10px] text-neu-text-muted font-mono">4 Cuentas | $14.5M COP</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neu-text-muted group-hover:text-neu-success group-hover:translate-x-0.5 transition-all" />
              </div>

              <div className="p-3.5 px-4 rounded-2xl bg-neu-surface shadow-neu-raised-xs border border-white/60 flex items-center justify-between group hover:shadow-neu-raised transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-neu-surface shadow-neu-inset flex items-center justify-center text-neu-violet">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neu-text-dark">Servicios de Consultoría</p>
                    <p className="text-[10px] text-neu-text-muted font-mono">2 Contratos | $4.8M COP</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neu-text-muted group-hover:text-neu-violet group-hover:translate-x-0.5 transition-all" />
              </div>

              <div className="p-3.5 px-4 rounded-2xl bg-neu-surface shadow-neu-raised-xs border border-white/60 flex items-center justify-between group hover:shadow-neu-raised transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-neu-surface shadow-neu-inset flex items-center justify-center text-neu-warning">
                    <Wind className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neu-text-dark">Mantenimiento & Retapizado</p>
                    <p className="text-[10px] text-neu-text-muted font-mono">3 Servicios | $2.1M COP</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neu-text-muted group-hover:text-neu-warning group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>

            {/* Resumen Hundido de Eficiencia */}
            <div className="p-4 rounded-2xl bg-neu-surface shadow-neu-inset border border-white/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neu-success" />
                <span className="font-semibold text-neu-text-dark">Índice de Cobro</span>
              </div>
              <span className="font-mono font-bold text-neu-accent">94.2% Efectivo</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Indicadores Principales Neumórficos */}
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
          tag="Facturación"
          title="Acumulado del Mes"
          value={formatCurrency(data.salesMonth?.total || 0)}
          change={`${data.salesMonth?.count || 0} órdenes cerradas`}
          isPositive={true}
          icon={ShoppingBag}
        />
        <StatCard
          tag="Operación"
          title="Pedidos en Curso"
          value={data.pendingOrders || 0}
          subtitle="En taller o preparación"
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

      {/* Tabla Neumórfica de Órdenes Recientes */}
      <div className="neu-card p-6 md:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-neu-surfaceDark/50 mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent bg-neu-surface px-3 py-1 rounded-full shadow-neu-inset-sm border border-white/20">
              Registro de Operaciones
            </span>
            <h3 className="font-display text-xl font-bold text-neu-text-dark mt-2">
              Últimas Órdenes de Venta
            </h3>
          </div>
          <Link
            to="/orders"
            className="px-4 py-2 rounded-2xl bg-neu-surface shadow-neu-raised-xs border border-white/60 text-xs font-bold text-neu-accent hover:shadow-neu-inset flex items-center gap-1.5 transition-all"
          >
            Ver Todas <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neu-surfaceDark/40 text-[10px] font-bold uppercase tracking-wider text-neu-text-muted">
                <th className="pb-3 pl-2">N° Orden</th>
                <th className="pb-3">Cliente / Cuenta</th>
                <th className="pb-3 text-right">Progreso Anticipo</th>
                <th className="pb-3 text-right">Total</th>
                <th className="pb-3 text-right pr-2">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neu-surfaceDark/30">
              {data.lastOrders.map((order) => {
                const paidPercent = Math.round(
                  (Number(order.paidAmount) / Number(order.total || 1)) * 100
                );
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-white/40 transition-colors rounded-2xl"
                  >
                    <td className="py-4 pl-2 font-mono font-bold text-neu-text-dark">
                      <Link
                        to={`/orders/${order.id}`}
                        className="hover:text-neu-accent transition-colors flex items-center gap-1.5"
                      >
                        {order.orderNumber}
                      </Link>
                      <span className="block text-[10px] text-neu-text-muted font-normal">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td className="py-4">
                      <p className="font-bold text-neu-text-dark">{order.customer?.name}</p>
                      <span className="text-[10px] text-neu-text-muted font-mono">
                        {order.customer?.phone}
                      </span>
                    </td>
                    <td className="py-4 text-right font-mono">
                      <span className="text-neu-text-dark font-bold">
                        {formatCurrency(order.paidAmount)}
                      </span>
                      <div className="w-24 ml-auto h-2 bg-neu-surface shadow-neu-inset rounded-full overflow-hidden mt-1 p-0.5">
                        <div
                          className="h-full bg-neu-success rounded-full"
                          style={{ width: `${paidPercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-neu-success font-semibold">
                        {paidPercent}% Cubierto
                      </span>
                    </td>
                    <td className="py-4 text-right font-mono font-extrabold text-neu-text-dark text-sm">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-4 text-right pr-2">
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
