export type Role = "ADMIN" | "DESIGNER" | "WORKSHOP_LEAD" | "EMPLOYEE";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  avatarUrl?: string | null;
  createdAt: string;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PRODUCTION"
  | "QUALITY_CHECK"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type LeadStatus =
  | "NUEVO"
  | "CONTACTADO"
  | "CITA_SHOWROOM"
  | "COTIZACION_ENVIADA"
  | "NEGOCIACION"
  | "GANADO"
  | "PERDIDO";

export type LeadSource =
  | "INSTAGRAM"
  | "SHOWROOM_DIRECTO"
  | "ARQUITECTO_DISENADOR"
  | "SITIO_WEB"
  | "REFERIDO"
  | "EVENTO_DISENO";

export type PaymentMethod =
  | "TRANSFERENCIA_BANCARIA"
  | "TARJETA_CREDITO"
  | "EFECTIVO"
  | "LINK_PAGO"
  | "CHEQUE";

export type QuoteStatus = "BORRADOR" | "ENVIADA" | "APROBADA" | "RECHAZADA" | "EXPIRADA";

export interface Category {
  id: number;
  name: string;
  collection?: string | null;
  description?: string | null;
  createdAt: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  collection?: string | null;
  description?: string | null;
  materials?: string | null;
  dimensions?: string | null;
  imageUrl?: string | null;
  price: number | string;
  cost?: number | string | null;
  stock: number;
  minStock: number;
  inShowroom: boolean;
  isActive: boolean;
  categoryId: number;
  category?: Category;
  createdAt: string;
  updatedAt?: string;
}

export interface Customer {
  id: number;
  name: string;
  email?: string | null;
  phone: string;
  address?: string | null;
  city?: string | null;
  documentId?: string | null;
  isVip: boolean;
  clientType: "PARTICULAR" | "ESTUDIO_ARQUITECTURA" | "HOTEL_RESTAURANTE";
  notes?: string | null;
  createdAt: string;
  _count?: { orders: number };
  orders?: Order[];
}

export interface OrderDetail {
  id?: number;
  productId: number;
  product?: Product;
  quantity: number;
  unitPrice: number | string;
  lineTotal: number | string;
  finishNotes?: string | null;
}

export interface Payment {
  id: number;
  orderId: number;
  amount: number | string;
  method: PaymentMethod;
  reference?: string | null;
  notes?: string | null;
  paymentDate: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number | string;
  discount: number | string;
  total: number | string;
  paidAmount: number | string;
  notes?: string | null;
  workshopStage?: string | null;
  craftsmanName?: string | null;
  deliveryDate?: string | null;
  createdAt: string;
  updatedAt?: string;
  customerId: number;
  customer: Customer;
  createdById?: number;
  createdBy?: { id: number; name: string; email: string };
  details: OrderDetail[];
  payments?: Payment[];
}

export interface Activity {
  id: number;
  type: "LLAMADA" | "WHATSAPP" | "CITA_SHOWROOM" | "NOTA";
  title: string;
  description?: string | null;
  scheduledAt?: string | null;
  createdAt: string;
  user?: { id: number; name: string };
}

export interface Lead {
  id: number;
  name: string;
  email?: string | null;
  phone: string;
  company?: string | null;
  source: LeadSource;
  status: LeadStatus;
  estimatedBudget?: number | string | null;
  interestSummary?: string | null;
  notes?: string | null;
  assignedToId?: number | null;
  assignedTo?: { id: number; name: string; email: string } | null;
  createdAt: string;
  updatedAt: string;
  quotes?: Quote[];
  activities?: Activity[];
}

export interface QuoteItem {
  productId?: number;
  sku?: string;
  name: string;
  finishNotes?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Quote {
  id: number;
  quoteNumber: string;
  status: QuoteStatus;
  subtotal: number | string;
  discount: number | string;
  total: number | string;
  validUntil: string;
  notes?: string | null;
  itemsJson: QuoteItem[];
  leadId?: number | null;
  lead?: Lead | null;
  customerId?: number | null;
  customer?: Customer | null;
  orderId?: number | null;
  order?: { id: number; orderNumber: string; status: OrderStatus } | null;
  createdAt: string;
}

export interface DashboardSummary {
  salesToday: { total: number | string; count: number };
  salesMonth: { total: number | string; count: number };
  pendingOrders: number;
  newCustomersMonth: number;
  lowStockCount: number;
  lowStockProducts: Product[];
  lastOrders: Order[];
}

export interface SalesChartPoint {
  date: string;
  total: number;
}
