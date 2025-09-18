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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const fulfillmentStatus = searchParams.get('fulfillmentStatus');
    const customerId = searchParams.get('customerId');
    const minAmount = searchParams.get('minAmount');
    const maxAmount = searchParams.get('maxAmount');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Get orders from JSON file
    const orders = getOrdersFromFile();
    let filteredOrders = [...orders];
    
    if (status) {
      filteredOrders = filteredOrders.filter(o => o.status === status);
    }
    
    if (paymentStatus) {
      filteredOrders = filteredOrders.filter(o => o.paymentStatus === paymentStatus);
    }
    
    if (fulfillmentStatus) {
      filteredOrders = filteredOrders.filter(o => o.fulfillmentStatus === fulfillmentStatus);
    }
    
    if (customerId) {
      filteredOrders = filteredOrders.filter(o => o.customerId === customerId);
    }
    
    if (minAmount) {
      filteredOrders = filteredOrders.filter(o => o.total >= parseFloat(minAmount));
    }
    
    if (maxAmount) {
      filteredOrders = filteredOrders.filter(o => o.total <= parseFloat(maxAmount));
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredOrders = filteredOrders.filter(o => 
        o.orderNumber.toLowerCase().includes(searchLower) ||
        o.customer.firstName.toLowerCase().includes(searchLower) ||
        o.customer.lastName.toLowerCase().includes(searchLower) ||
        o.customer.email.toLowerCase().includes(searchLower) ||
        o.items.some(item => item.title.toLowerCase().includes(searchLower))
      );
    }
    
    if (sortBy) {
      switch (sortBy) {
        case 'total-desc':
          filteredOrders.sort((a, b) => b.total - a.total);
          break;
        case 'total-asc':
          filteredOrders.sort((a, b) => a.total - b.total);
          break;
        case 'date-desc':
          filteredOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
        case 'date-asc':
          filteredOrders.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
          break;
        case 'order-number':
          filteredOrders.sort((a, b) => a.orderNumber.localeCompare(b.orderNumber));
          break;
        case 'customer':
          filteredOrders.sort((a, b) => 
            `${a.customer.firstName} ${a.customer.lastName}`.localeCompare(
              `${b.customer.firstName} ${b.customer.lastName}`
            )
          );
          break;
      }
    } else {
      // Default sort by date desc
      filteredOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    
    const total = filteredOrders.length;
    const paginatedOrders = filteredOrders.slice(offset, offset + limit);
    
    return NextResponse.json({
      orders: paginatedOrders,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}