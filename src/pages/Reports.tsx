import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  Award,
  DollarSign,
  PackageCheck,
  Calendar,
  Layers,
  ArrowUpRight,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import StatCard from "../components/ui/StatCard";
import Button from "../components/ui/Button";
import { formatCurrency } from "../utils/format";
import api from "../api/axios";

const MOCK_CHART_DATA = [
  { date: "01 Sep", total: 4850000 },
  { date: "02 Sep", total: 2450000 },
  { date: "03 Sep", total: 6800000 },
  { date: "04 Sep", total: 3750000 },
  { date: "05 Sep", total: 1650000 },
  { date: "06 Sep", total: 9700000 },
  { date: "07 Sep", total: 5900000 },
];

const MOCK_TOP_PRODUCTS = [
  { sku: "SAL-001", name: "Sofá Milano 3 Puestos", collection: "Lombardía 2026", quantitySold: 8, revenue: 38800000 },
  { sku: "COM-001", name: "Mesa Comedor Monolith 8P", collection: "Nordic Monolith", quantitySold: 5, revenue: 34000000 },
  { sku: "DOR-001", name: "Cama King Size Verona", collection: "Suites Privadas", quantitySold: 4, revenue: 23600000 },
  { sku: "SAL-002", name: "Poltrona Bergère Florence", collection: "Riviera Heritage", quantitySold: 6, revenue: 14700000 },
];

export const Reports: React.FC = () => {
  const [chartData, setChartData] = useState(MOCK_CHART_DATA);
  const [topProducts, setTopProducts] = useState(MOCK_TOP_PRODUCTS);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [chartRes, topRes] = await Promise.all([
          api.get("/dashboard/sales-chart?days=7"),
          api.get("/reports/top-products"),
        ]);
        if (chartRes.data?.data && chartRes.data.data.length > 0) {
          setChartData(
            chartRes.data.data.map((d: any) => ({
              date: d.date.slice(5),
              total: Number(d.total),
            }))
          );
        }
        if (topRes.data?.data && topRes.data.data.length > 0) {
          setTopProducts(topRes.data.data);
        }
      } catch {
        // Mock
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="space-y-8">
      {/* Cabecera Neumórfica */}
      <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent bg-neu-surface px-3 py-1 rounded-full shadow-neu-inset-sm border border-white/20">
              Analítica Financiera
            </span>
            <span className="w-2 h-2 rounded-full bg-neu-success shadow-neu-glow-success animate-pulse" />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-neu-text-dark">
            Revista Financiera <span className="text-neu-accent">&</span> Rendimiento
          </h1>
          <p className="text-xs text-neu-text-sub mt-1">
            Análisis de rentabilidad por línea, flujo de caja por anticipos y ranking de piezas líderes.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-neu-text-muted font-bold">Rango:</span>
          <span className="px-4 py-2 bg-neu-surface rounded-2xl shadow-neu-inset border border-white/20 text-neu-text-dark font-bold font-mono">
            Últimos 30 Días
          </span>
        </div>
      </header>

      {/* 4 Indicadores Neumórficos */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          tag="Facturación Total"
          title="Ventas del Período"
          value={formatCurrency(111100000)}
          change="+24% vs mes previo"
          isPositive={true}
          icon={TrendingUp}
        />
        <StatCard
          tag="Ticket Promedio"
          title="Valor por Proyecto"
          value={formatCurrency(5847000)}
          change="Margen Bruto: 52%"
          isPositive={true}
          icon={DollarSign}
        />
        <StatCard
          tag="Piezas Fabricadas"
          title="Volumen en Taller"
          value="23 unidades"
          subtitle="98% Entregas a tiempo"
          icon={PackageCheck}
        />
        <StatCard
          tag="Línea Estrella"
          title="Colección Líder"
          value="Nordic Monolith"
          subtitle="38% de los ingresos"
          icon={Award}
        />
      </section>

      {/* Gráficos Neumórficos con Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico de Tendencia de Ventas (2 Columnas) */}
        <div className="lg:col-span-2 neu-card p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neu-surfaceDark/50">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent bg-neu-surface px-2.5 py-0.5 rounded-full shadow-neu-inset-sm border border-white/20">
                Curva de Facturación
              </span>
              <h3 className="font-display text-xl font-bold text-neu-text-dark mt-2">
                Flujo Diario de Ventas (COP)
              </h3>
            </div>
            <span className="text-xs font-semibold text-neu-success bg-neu-surface px-3 py-1 rounded-full shadow-neu-inset-sm border border-white/20 flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" /> +18.4% Crecimiento
            </span>
          </div>

          <div className="h-72 w-full font-mono text-xs p-2 rounded-2xl bg-neu-surface shadow-neu-inset border border-white/20">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 15, right: 15, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorSalesNeu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#DCE3EE" vertical={false} />
                <XAxis dataKey="date" stroke="#94A3B8" tickLine={false} />
                <YAxis
                  stroke="#94A3B8"
                  tickLine={false}
                  tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(val), "Ventas"]}
                  contentStyle={{
                    backgroundColor: "#E8EDF5",
                    color: "#2D3748",
                    borderRadius: "1rem",
                    boxShadow: "6px 6px 14px rgba(166, 180, 200, 0.7), -6px -6px 14px rgba(255, 255, 255, 0.95)",
                    border: "1px solid rgba(255, 255, 255, 0.6)",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#0EA5E9"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSalesNeu)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ranking de Piezas Más Vendidas */}
        <div className="neu-card p-6 md:p-8 space-y-6">
          <div className="pb-4 border-b border-neu-surfaceDark/50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent bg-neu-surface px-2.5 py-0.5 rounded-full shadow-neu-inset-sm border border-white/20">
              Best Sellers
            </span>
            <h3 className="font-display text-lg font-bold text-neu-text-dark mt-2">
              Piezas Líderes
            </h3>
          </div>

          <div className="space-y-3 font-sans text-xs">
            {topProducts.map((p, idx) => (
              <div
                key={p.sku}
                className="p-3.5 px-4 rounded-2xl bg-neu-surface shadow-neu-raised-xs border border-white/60 space-y-1.5 hover:shadow-neu-raised transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-neu-accent bg-neu-surface px-2 py-0.5 rounded-full shadow-neu-inset-sm">
                    0{idx + 1}. {p.sku}
                  </span>
                  <span className="font-mono font-bold text-neu-text-dark">{formatCurrency(p.revenue)}</span>
                </div>
                <p className="font-bold text-xs text-neu-text-dark">{p.name}</p>
                <p className="text-[11px] text-neu-text-sub font-medium">{p.quantitySold} unidades entregadas</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
