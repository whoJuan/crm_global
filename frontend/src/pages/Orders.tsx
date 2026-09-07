import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Eye,
  ReceiptText,
  CreditCard,
  CalendarDays,
  FileCheck,
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
  const debouncedSearch = useDebounce(search, 350); // Consulta 1 a 1
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
      {/* Cabecera Editorial */}
      <header className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-ink-100 gap-6">
        <div>
          <span className="editorial-tag text-brass-600">Registro de Ventas & Facturación</span>
          <h1 className="font-serif text-4xl font-normal text-ink-950 mt-1">
            Ventas <span className="italic font-light text-brass-600">&</span> Órdenes de Compra
          </h1>
          <p className="text-sm text-ink-600 mt-2 font-light max-w-xl">
            Control de pedidos, esquema de pagos parciales (50/50) y emisión de proformas imprimibles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-2" /> Nueva Orden / Cotización
          </Button>
        </div>
      </header>

      {/* Barra de Filtros & Búsqueda con Debounce 1 a 1 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-ink-100">
        <div className="flex items-center gap-2 overflow-x-auto">
          {["TODOS", "PENDING", "CONFIRMED", "IN_PRODUCTION", "DELIVERED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? "bg-ink-950 text-canvas font-semibold"
                  : "bg-surface border border-ink-100 text-ink-600 hover:border-ink-400"
              }`}
            >
              {st === "TODOS" ? "Todas las Órdenes" : st}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar (consulta 1 a 1)..."
            className="w-full bg-canvas-alt border border-ink-100 pl-8 pr-3 py-1.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500 font-mono"
          />
        </div>
      </div>

      {/* Tabla Editorial de Órdenes */}
      <div className="editorial-card overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="border-b border-ink-100 text-[10px] font-mono text-ink-400 uppercase bg-canvas-alt/50">
              <th className="p-4 font-medium">N° Pedido</th>
              <th className="p-4 font-medium">Cliente / Cuenta</th>
              <th className="p-4 font-medium">Etapa Operativa</th>
              <th className="p-4 font-medium text-right">Progreso de Pago</th>
              <th className="p-4 font-medium text-right">Total Factura</th>
              <th className="p-4 font-medium text-center">Estado</th>
              <th className="p-4 font-medium text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {filteredOrders.map((order) => {
              const paidPercent = Math.round(
                (Number(order.paidAmount) / Number(order.total || 1)) * 100
              );
              return (
                <tr key={order.id} className="hover:bg-canvas-alt/40 transition-colors">
                  <td className="p-4 font-mono font-semibold text-ink-950">
                    <Link to={`/orders/${order.id}`} className="hover:text-brass-600">
                      {order.orderNumber}
                    </Link>
                    <span className="block text-[10px] text-ink-400 font-normal">
                      {formatDate(order.createdAt)}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-ink-900">{order.customer?.name}</p>
                    <span className="text-[10px] text-ink-500 font-mono">{order.customer?.phone}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-serif italic text-xs text-ink-800">
                      {order.workshopStage || "En Preparación"}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono">
                    <div className="flex items-center justify-end gap-2 mb-1">
                      <span className="text-[11px] font-bold text-ink-900">
                        {formatCurrency(order.paidAmount)}
                      </span>
                      <span className="text-[10px] text-ink-400">/ {formatCurrency(order.total)}</span>
                    </div>
                    {/* Barra de progreso de pago */}
                    <div className="w-32 bg-ink-100 h-1.5 ml-auto overflow-hidden">
                      <div
                        className={`h-full ${
                          paidPercent >= 100
                            ? "bg-sage-600"
                            : paidPercent >= 50
                            ? "bg-brass-500"
                            : "bg-clay-500"
                        }`}
                        style={{ width: `${Math.min(100, paidPercent)}%` }}
                      />
                    </div>
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-ink-950 text-sm">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="p-4 text-center">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="p-4 text-center">
                    <Link
                      to={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-brass-600 hover:text-ink-950 uppercase tracking-wider"
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

      {/* Modal para Nueva Orden / Cotización */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nueva Orden de Venta"
        subtitle="Mesa de cotización con cálculo automático de anticipos e ítems"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateOrder} className="space-y-6 text-xs font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
                Cliente / Cuenta *
              </label>
              <select
                required
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500"
              >
                <option value="">Selecciona un cliente...</option>
                <option value="1">Carolina Santamaría (Estudio Vanguardia)</option>
                <option value="2">Alejandro Echeverri</option>
                <option value="3">Mariana Restrepo</option>
              </select>
            </div>

            <div>
              <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
                Fecha Estimada de Entrega
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full bg-canvas-alt border border-ink-200 p-2.5 text-xs text-ink-900 font-mono focus:outline-none focus:border-brass-500"
              />
            </div>
          </div>

          {/* Selector de Ítems */}
          <div className="border-t border-b border-ink-100 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="editorial-tag text-brass-600">Ítems & Servicios del Pedido</span>
              <button
                type="button"
                onClick={() => handleAddItem(1)}
                className="text-[11px] font-semibold text-brass-600 hover:text-ink-950 uppercase"
              >
                + Añadir Ítem del Catálogo
              </button>
            </div>

            {orderItems.length === 0 ? (
              <div className="p-4 bg-canvas-alt text-center text-ink-400 italic">
                No has agregado ítems aún. Haz clic en el botón superior para añadir.
              </div>
            ) : (
              <div className="space-y-2 font-mono">
                {orderItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-canvas-alt border border-ink-100 flex items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <p className="font-serif text-sm font-medium text-ink-950">
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
                        className="w-full bg-surface border border-ink-200 p-1 text-[11px] text-ink-900 mt-1 font-sans"
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
                        className="w-14 bg-surface border border-ink-200 p-1 text-center font-mono"
                      />
                      <span className="font-bold text-ink-950 w-28 text-right">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cálculos Financieros y Anticipo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
            <div>
              <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
                Descuento Especial
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full bg-canvas-alt border border-ink-200 p-2 text-xs text-ink-900 focus:outline-none focus:border-brass-500"
              />
            </div>

            <div>
              <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1">
                Anticipo Inicial (50% Sugerido)
              </label>
              <input
                type="number"
                value={initialDeposit}
                onChange={(e) => setInitialDeposit(e.target.value)}
                placeholder={formatCurrency(calculateTotal() * 0.5)}
                className="w-full bg-canvas-alt border border-ink-200 p-2 text-xs text-ink-900 focus:outline-none focus:border-brass-500"
              />
            </div>

            <div className="p-3 bg-ink-950 text-canvas flex flex-col justify-between">
              <span className="editorial-tag text-brass-300 text-[9px]">Total de la Orden</span>
              <p className="font-serif text-xl font-normal text-white">
                {formatCurrency(calculateTotal())}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-ink-100 flex items-center justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Guardar & Emitir Orden
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Orders;
