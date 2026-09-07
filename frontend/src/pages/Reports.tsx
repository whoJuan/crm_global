import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  Award,
  DollarSign,
  PackageCheck,
  Calendar,
  Layers,
  ArrowUpRight,
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
    <div className="space-y-10">
      {/* Cabecera Editorial */}
      <header className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-ink-100 gap-6">
        <div>
          <span className="editorial-tag text-brass-600">Journal Financiero · Temporada 2026</span>
          <h1 className="font-serif text-4xl font-normal text-ink-950 mt-1">
            Revista Financiera <span className="italic font-light text-brass-600">&</span> Rendimiento
          </h1>
          <p className="text-sm text-ink-600 mt-2 font-light max-w-xl">
            Análisis de rentabilidad por colección, flujo de caja por anticipos y piezas más cotizadas.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-ink-400">Rango:</span>
          <span className="px-3 py-1 bg-surface border border-ink-200 text-ink-900 font-semibold">
            Últimos 30 Días
          </span>
        </div>
      </header>

      {/* Indicadores de Rendimiento */}
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
          tag="Colección Estrella"
          title="Línea Líder"
          value="Nordic Monolith"
          subtitle="38% de los ingresos totales"
          icon={Award}
        />
      </section>

      {/* Gráficos Editoriales con Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico de Tendencia de Ventas (2 Columnas) */}
        <div className="lg:col-span-2 editorial-card p-6">
          <div className="flex items-center justify-between pb-4 border-b border-ink-100 mb-6">
            <div>
              <span className="editorial-tag text-brass-600">Curva de Facturación</span>
              <h3 className="font-serif text-xl font-normal text-ink-950 mt-0.5">
                Flujo Diario de Ventas (COP)
              </h3>
            </div>
            <span className="text-xs font-mono text-sage-600 font-semibold flex items-center">
              <ArrowUpRight className="w-4 h-4 mr-0.5" /> +18.4% Crecimiento
            </span>
          </div>

          <div className="h-72 w-full font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B38E58" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#B38E58" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAE5DF" vertical={false} />
                <XAxis dataKey="date" stroke="#8C827A" tickLine={false} />
                <YAxis
                  stroke="#8C827A"
                  tickLine={false}
                  tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(val), "Ventas"]}
                  contentStyle={{
                    backgroundColor: "#1A1614",
                    color: "#FAF8F5",
                    borderRadius: "0px",
                    border: "none",
                    fontFamily: "monospace",
                    fontSize: "11px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#B38E58"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ranking de Piezas Más Vendidas */}
        <div className="editorial-card p-6">
          <div className="flex items-center justify-between pb-4 border-b border-ink-100 mb-6">
            <div>
              <span className="editorial-tag text-brass-600">Best Sellers</span>
              <h3 className="font-serif text-lg font-normal text-ink-950 mt-0.5">
                Piezas Líderes
              </h3>
            </div>
          </div>

          <div className="space-y-4 font-sans text-xs">
            {topProducts.map((p, idx) => (
              <div key={p.sku} className="pb-3 border-b border-ink-100 last:border-b-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-ink-400">0{idx + 1}. {p.sku}</span>
                  <span className="font-mono font-bold text-ink-950">{formatCurrency(p.revenue)}</span>
                </div>
                <p className="font-serif font-medium text-sm text-ink-900">{p.name}</p>
                <p className="text-[11px] text-brass-600 font-light">{p.quantitySold} unidades entregadas</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
