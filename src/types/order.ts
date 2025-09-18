export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'partially_paid' | 'refunded' | 'failed';
  fulfillmentStatus: 'unfulfilled' | 'partially_fulfilled' | 'fulfilled' | 'cancelled';
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  paymentMethod: string;
  shippingMethod: string;
  notes?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  processedAt?: Date;
  cancelledAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  tracking?: {
    number: string;
    url: string;
    carrier: string;
  };
  refunds?: OrderRefund[];
  riskLevel: 'low' | 'medium' | 'high';
  source: 'web' | 'mobile' | 'pos' | 'api';
  channel: string;
  taxExempt: boolean;
  testOrder: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  title: string;
  sku: string;
  quantity: number;
  price: number;
  compareAtPrice?: number;
  totalDiscount: number;
  linePrice: number;
  taxable: boolean;
  taxLines: TaxLine[];
  vendor?: string;
  productType?: string;
  weight?: number;
  requiresShipping: boolean;
  giftCard: boolean;
  fulfillmentService: string;
}

export interface TaxLine {
  title: string;
  price: number;
  rate: number;
}

export interface Address {
  id?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  country: string;
  zip: string;
  phone?: string;
  provinceCode?: string;
  countryCode: string;
  countryName: string;
}

export interface OrderRefund {
  id: string;
  orderId: string;
  amount: number;
  reason: string;
  note?: string;
  refundLineItems: RefundLineItem[];
  transactions: RefundTransaction[];
  createdAt: Date;
  processedAt?: Date;
}

export interface RefundLineItem {
  id: string;
  lineItemId: string;
  quantity: number;
  subtotal: number;
  totalTax: number;
}

export interface RefundTransaction {
  id: string;
  orderId: string;
  amount: number;
  kind: 'refund' | 'void';
  gateway: string;
  status: 'pending' | 'success' | 'failure' | 'error';
  message?: string;
  createdAt: Date;
  processedAt?: Date;
}

export interface OrderSearchFilters {
  status?: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  minAmount?: number;
  maxAmount?: number;
  customerId?: string;
  tags?: string[];
  source?: string;
  riskLevel?: string;
  search?: string;
}

export interface OrderAnalytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  conversionRate: number;
  ordersByStatus: Record<string, number>;
  ordersByPaymentStatus: Record<string, number>;
  revenueByDay: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  topProducts: Array<{
    productId: string;
    title: string;
    quantity: number;
    revenue: number;
  }>;
  topCustomers: Array<{
    customerId: string;
    name: string;
    orders: number;
    totalSpent: number;
  }>;
}