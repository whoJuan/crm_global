import React from "react";
import { OrderStatus } from "../../types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; dotColor: string; textColor: string }
> = {
  PENDING: {
    label: "Cotización / Pendiente",
    dotColor: "bg-neu-warning",
    textColor: "text-neu-warning",
  },
  CONFIRMED: {
    label: "Confirmado",
    dotColor: "bg-neu-accent",
    textColor: "text-neu-accent",
  },
  IN_PRODUCTION: {
    label: "En Producción",
    dotColor: "bg-neu-violet",
    textColor: "text-neu-violet",
  },
  QUALITY_CHECK: {
    label: "Control de Calidad",
    dotColor: "bg-indigo-500",
    textColor: "text-indigo-500",
  },
  SHIPPED: {
    label: "Enviado",
    dotColor: "bg-blue-500",
    textColor: "text-blue-500",
  },
  DELIVERED: {
    label: "Entregado",
    dotColor: "bg-neu-success",
    textColor: "text-neu-success",
  },
  CANCELLED: {
    label: "Cancelado",
    dotColor: "bg-neu-danger",
    textColor: "text-neu-danger",
  },
};

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, className = "" }) => {
  const config = STATUS_CONFIG[status] || {
    label: status,
    dotColor: "bg-neu-text-sub",
    textColor: "text-neu-text-sub",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-neu-surface shadow-neu-inset-sm border border-white/20 ${config.textColor} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dotColor} shadow-sm animate-pulse`} />
      <span>{config.label}</span>
    </span>
  );
};

export default OrderStatusBadge;
