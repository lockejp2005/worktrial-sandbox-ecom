import { NextRequest, NextResponse } from 'next/server';
import { Order } from '@/types/order';
import fs from 'fs';
import path from 'path';

// Transform JSON order to match Order type
function transformJsonToOrder(jsonOrder: any): Order {
  return {
    id: jsonOrder.id,
    orderNumber: jsonOrder.orderNumber,
    customerId: jsonOrder.customerId,
    customer: jsonOrder.customer,
    items: jsonOrder.items.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      title: item.title,
      sku: item.sku,
      quantity: item.quantity,
      price: item.price,
      compareAtPrice: item.compareAtPrice,
      totalDiscount: item.totalDiscount || 0,
      linePrice: item.linePrice,
      taxable: item.taxable,
      taxLines: item.taxLines || [],
      vendor: item.vendor,
      productType: item.productType,
      weight: item.weight,
      requiresShipping: item.requiresShipping,
      giftCard: item.giftCard || false,
      fulfillmentService: item.fulfillmentService || 'manual'
    })),
    status: jsonOrder.status,
    paymentStatus: jsonOrder.paymentStatus,
    fulfillmentStatus: jsonOrder.fulfillmentStatus,
    shippingAddress: jsonOrder.shippingAddress,
    billingAddress: jsonOrder.billingAddress,
    subtotal: jsonOrder.subtotal,
    tax: jsonOrder.tax,
    shipping: jsonOrder.shipping,
    discount: jsonOrder.discount,
    total: jsonOrder.total,
    currency: jsonOrder.currency,
    paymentMethod: jsonOrder.paymentMethod,
    shippingMethod: jsonOrder.shippingMethod,
    notes: jsonOrder.notes,
    tags: jsonOrder.tags || [],
    createdAt: new Date(jsonOrder.createdAt),
    updatedAt: new Date(jsonOrder.updatedAt),
    processedAt: jsonOrder.processedAt ? new Date(jsonOrder.processedAt) : undefined,
    cancelledAt: jsonOrder.cancelledAt ? new Date(jsonOrder.cancelledAt) : undefined,
    shippedAt: jsonOrder.shippedAt ? new Date(jsonOrder.shippedAt) : undefined,
    deliveredAt: jsonOrder.deliveredAt ? new Date(jsonOrder.deliveredAt) : undefined,
    tracking: jsonOrder.tracking,
    refunds: jsonOrder.refunds?.map((refund: any) => ({
      ...refund,
      createdAt: new Date(refund.createdAt),
      processedAt: refund.processedAt ? new Date(refund.processedAt) : undefined
    })),
    riskLevel: jsonOrder.riskLevel || 'low',
    source: jsonOrder.source || 'web',
    channel: jsonOrder.channel || 'online_store',
    taxExempt: jsonOrder.taxExempt || false,
    testOrder: jsonOrder.testOrder || false
  };
}

// Read orders from JSON file
function getOrdersFromFile(): Order[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'orders.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const jsonOrders = JSON.parse(fileContent);
    return jsonOrders.map(transformJsonToOrder);
  } catch (error) {
    console.error('Error reading orders from file:', error);
    return [];
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orders = getOrdersFromFile();
    const order = orders.find(o => o.id === id);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}