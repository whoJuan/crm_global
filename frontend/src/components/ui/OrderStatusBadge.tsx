import React from "react";
import { OrderStatus } from "../../types";
import { ORDER_STATUS_MAP } from "../../utils/format";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, className = "" }) => {
  const config = ORDER_STATUS_MAP[status] || {
    label: status,
    color: "text-ink-700",
    bg: "bg-canvas-alt border-ink-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono border uppercase tracking-wider ${config.bg} ${config.color} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
