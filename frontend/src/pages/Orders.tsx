import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Eye,
  ReceiptText,
  CreditCard,
  CalendarDays,
  FileCheck,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import OrderStatusBadge from "../components/ui/OrderStatusBadge";
import { formatCurrency, formatDate } from "../utils/format";
import useDebounce from "../utils/useDebounce";
import api from "../api/axios";
import { Order, Product, Customer } from "../types";

const MOCK_ORDERS: Order[] = [
  {
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
      phone: "+57 300 456 7890",
      isVip: true,
      clientType: "ESTUDIO_ARQUITECTURA",
      createdAt: new Date().toISOString(),
    },
    details: [
      {
        id: 1,
        productId: 1,
        quantity: 2,
        unitPrice: 4850000,
        lineTotal: 9700000,
        finishNotes: "Especificación de entrega personalizada",
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
        id: 2,
        productId: 3,
        quantity: 1,
        unitPrice: 6800000,
        lineTotal: 6800000,
        finishNotes: "Entrega programada",
      },
    ],
  },
];

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [orderItems, setOrderItems] = useState<
    { productId: number; quantity: number; unitPrice: number; finishNotes: string }[]
  >([]);
  const [discount, setDiscount] = useState("0");
  const [initialDeposit, setInitialDeposit] = useState("");
  const [notes, setNotes] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  const fetchOrders = async (searchTerm: string) => {
    try {
      const res = await api.get(`/orders?search=${encodeURIComponent(searchTerm)}`);
      if (res.data?.data && res.data.data.length > 0) {
        setOrders(res.data.data);
      }
    } catch {
      // Mock
    }
  };

  const fetchDependencies = async () => {
    try {
      const [custRes, prodRes] = await Promise.all([
        api.get("/customers"),
        api.get("/products"),
      ]);
      if (custRes.data?.data) setCustomers(custRes.data.data);
      if (prodRes.data?.data) setProducts(prodRes.data.data);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchOrders(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchDependencies();
  }, []);

  const handleAddItem = (productId: number) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    setOrderItems((prev) => [
      ...prev,
      {
        productId: prod.id,
        quantity: 1,
        unitPrice: Number(prod.price),
        finishNotes: prod.materials || "Especificación estándar",
      },
    ]);
  };

  const calculateSubtotal = () =>
    orderItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  const calculateTotal = () =>
    Math.max(0, calculateSubtotal() - (Number(discount) || 0));

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0) return alert("Agrega al menos un ítem al pedido");

    const payload = {
      customerId: Number(selectedCustomerId),
      items: orderItems,
      discount: Number(discount) || 0,
      initialDeposit: Number(initialDeposit) || 0,
      notes,
      deliveryDate: deliveryDate || null,
      workshopStage: "En Preparación",
    };

    try {
      const res = await api.post("/orders", payload);
      if (res.data?.data) {
        setOrders((prev) => [res.data.data, ...prev]);
      }
    } catch {
      const mockCustomer = customers.find((c) => c.id === Number(selectedCustomerId)) || {
        id: Number(selectedCustomerId),
        name: "Cliente Comercial",
        phone: "+57 300 000 0000",
        isVip: false,
        clientType: "PARTICULAR" as const,
        createdAt: new Date().toISOString(),
      };

      const newOrd: Order = {
        id: Date.now(),
        orderNumber: `ORD-26-${Math.floor(1000 + Math.random() * 9000)}`,
        status: Number(initialDeposit) > 0 ? "CONFIRMED" : "PENDING",
        subtotal: calculateSubtotal(),
        discount: Number(discount) || 0,
        total: calculateTotal(),
        paidAmount: Number(initialDeposit) || 0,
        workshopStage: "En Preparación",
        deliveryDate,
        createdAt: new Date().toISOString(),
        customerId: Number(selectedCustomerId),
        customer: mockCustomer,
        details: orderItems.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          lineTotal: i.unitPrice * i.quantity,
          finishNotes: i.finishNotes,
        })),
      };
      setOrders((prev) => [newOrd, ...prev]);
    }

    setIsModalOpen(false);
    setOrderItems([]);
    setDiscount("0");
    setInitialDeposit("");
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      o.customer?.name.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchStatus = statusFilter === "TODOS" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-8">
      {/* Cabecera Neumórfica */}
      <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent bg-neu-surface px-3 py-1 rounded-full shadow-neu-inset-sm border border-white/20">
              Ventas & Facturación
            </span>
            <span className="w-2 h-2 rounded-full bg-neu-success shadow-neu-glow-success animate-pulse" />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-neu-text-dark">
            Ventas <span className="text-neu-accent">&</span> Órdenes de Compra
          </h1>
          <p className="text-xs text-neu-text-sub mt-1">
            Control de pedidos, esquema de pagos parciales (50/50) y emisión de proformas comerciales.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="accent" size="md" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Nueva Orden / Cotización
          </Button>
        </div>
      </header>

      {/* Barra de Filtros Neumórfica & Búsqueda */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-3xl bg-neu-surface shadow-neu-raised-sm border border-white/60">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-neu">
          {[
            { id: "TODOS", label: "Todas las Órdenes" },
            { id: "PENDING", label: "Cotización" },
            { id: "CONFIRMED", label: "Confirmadas" },
            { id: "IN_PRODUCTION", label: "En Producción" },
            { id: "DELIVERED", label: "Entregadas" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-2xl whitespace-nowrap transition-all duration-200 border ${
                statusFilter === st.id
                  ? "bg-neu-surface shadow-neu-inset border-white/20 text-neu-accent font-bold"
                  : "bg-neu-surface shadow-neu-raised-xs border-white/60 text-neu-text-sub hover:text-neu-text-dark hover:shadow-neu-raised-sm"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neu-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por N° o Cliente..."
            className="neu-input-search"
          />
        </div>
      </div>

      {/* Tabla Neumórfica de Órdenes */}
      <div className="neu-card p-6 md:p-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neu-surfaceDark/40 text-[10px] font-bold uppercase tracking-wider text-neu-text-muted">
                <th className="pb-3 pl-3">N° Pedido</th>
                <th className="pb-3">Cliente / Cuenta</th>
                <th className="pb-3">Etapa Operativa</th>
                <th className="pb-3 text-right">Progreso de Pago</th>
                <th className="pb-3 text-right">Total Factura</th>
                <th className="pb-3 text-center">Estado</th>
                <th className="pb-3 text-center pr-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neu-surfaceDark/30">
              {filteredOrders.map((order) => {
                const paidPercent = Math.round(
                  (Number(order.paidAmount) / Number(order.total || 1)) * 100
                );
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-white/40 transition-colors"
                  >
                    <td className="py-4 pl-3 font-mono font-bold text-neu-text-dark">
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
                    <td className="py-4">
                      <span className="text-xs text-neu-text-sub font-medium">
                        {order.workshopStage || "En Preparación"}
                      </span>
                    </td>
                    <td className="py-4 text-right font-mono">
                      <div className="flex items-center justify-end gap-1.5 mb-1">
                        <span className="text-xs font-bold text-neu-text-dark">
                          {formatCurrency(order.paidAmount)}
                        </span>
                        <span className="text-[10px] text-neu-text-muted">
                          / {formatCurrency(order.total)}
                        </span>
                      </div>
                      <div className="w-28 bg-neu-surface shadow-neu-inset rounded-full h-2 ml-auto overflow-hidden p-0.5">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            paidPercent >= 100
                              ? "bg-neu-success"
                              : paidPercent >= 50
                              ? "bg-neu-accent"
                              : "bg-neu-warning"
                          }`}
                          style={{ width: `${Math.min(100, paidPercent)}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-4 text-right font-mono font-extrabold text-neu-text-dark text-sm">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-4 text-center">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="py-4 text-center pr-3">
                      <Link
                        to={`/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neu-surface shadow-neu-raised-xs border border-white/60 text-xs font-bold text-neu-accent hover:shadow-neu-inset active:scale-95 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" /> Ficha
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Neumórfico para Nueva Orden / Cotización */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nueva Orden de Venta"
        subtitle="Mesa de cotización con cálculo automático de anticipos e ítems"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateOrder} className="space-y-6 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-neu-text-dark font-bold uppercase tracking-wider text-[10px] mb-1.5 pl-1">
                Cliente / Cuenta *
              </label>
              <select
                required
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="neu-input"
              >
                <option value="">Selecciona un cliente...</option>
                <option value="1">Carolina Santamaría (Estudio Vanguardia)</option>
                <option value="2">Alejandro Echeverri</option>
                <option value="3">Mariana Restrepo</option>
              </select>
            </div>

            <div>
              <label className="block text-neu-text-dark font-bold uppercase tracking-wider text-[10px] mb-1.5 pl-1">
                Fecha Estimada de Entrega
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="neu-input font-mono"
              />
            </div>
          </div>

          {/* Selector de Ítems */}
          <div className="p-4 rounded-2xl bg-neu-surface shadow-neu-inset border border-white/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent">
                Ítems & Servicios del Pedido
              </span>
              <button
                type="button"
                onClick={() => handleAddItem(1)}
                className="px-3 py-1 rounded-full bg-neu-surface shadow-neu-raised-xs border border-white/60 text-[11px] font-bold text-neu-accent hover:shadow-neu-inset transition-all"
              >
                + Añadir Ítem del Catálogo
              </button>
            </div>

            {orderItems.length === 0 ? (
              <div className="p-4 rounded-xl bg-neu-surface/50 text-center text-neu-text-muted italic border border-dashed border-neu-surfaceDark">
                No has agregado ítems aún. Haz clic en el botón superior para añadir.
              </div>
            ) : (
              <div className="space-y-2">
                {orderItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-neu-surface shadow-neu-raised-xs border border-white/60 flex items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <p className="text-xs font-bold text-neu-text-dark">
                        Ítem Ref #{item.productId}
                      </p>
                      <input
                        type="text"
                        value={item.finishNotes}
                        onChange={(e) => {
                          const val = e.target.value;
                          setOrderItems((prev) =>
                            prev.map((it, i) => (i === idx ? { ...it, finishNotes: val } : it))
                          );
                        }}
                        placeholder="Especificaciones o notas de entrega..."
                        className="w-full bg-neu-surface rounded-lg shadow-neu-inset px-2 py-1 text-[11px] text-neu-text-main mt-1 border border-white/20"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const q = Number(e.target.value);
                          setOrderItems((prev) =>
                            prev.map((it, i) => (i === idx ? { ...it, quantity: q } : it))
                          );
                        }}
                        className="w-14 bg-neu-surface rounded-lg shadow-neu-inset px-2 py-1 text-center font-mono text-xs border border-white/20"
                      />
                      <span className="font-bold font-mono text-neu-text-dark w-28 text-right">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cálculos Financieros y Anticipo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-neu-text-dark font-bold uppercase tracking-wider text-[10px] mb-1.5 pl-1">
                Descuento Especial
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="neu-input font-mono"
              />
            </div>

            <div>
              <label className="block text-neu-text-dark font-bold uppercase tracking-wider text-[10px] mb-1.5 pl-1">
                Anticipo Inicial (50%)
              </label>
              <input
                type="number"
                value={initialDeposit}
                onChange={(e) => setInitialDeposit(e.target.value)}
                placeholder={formatCurrency(calculateTotal() * 0.5)}
                className="neu-input font-mono"
              />
            </div>

            <div className="p-4 rounded-2xl bg-neu-surface shadow-neu-raised-sm border border-white/60 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent">
                Total Estimado
              </span>
              <p className="font-display text-xl font-extrabold text-neu-text-dark mt-1 font-mono">
                {formatCurrency(calculateTotal())}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-neu-surfaceDark/50 flex items-center justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="accent">
              Guardar & Emitir Orden
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Orders;
