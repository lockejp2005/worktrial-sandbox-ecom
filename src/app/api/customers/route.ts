import { NextRequest, NextResponse } from 'next/server';
import { Customer } from '@/types/customer';
import fs from 'fs';
import path from 'path';

function transformJsonToCustomer(jsonCustomer: any): Customer {
  // Transform purchase history
  const purchaseHistory = jsonCustomer.purchaseHistory?.map((order: any) => ({
    orderId: order.orderId,
    date: new Date(order.date),
    products: order.items.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price
    })),
    totalAmount: order.total,
    paymentMethod: 'credit-card',
    fulfillmentStatus: order.status === 'delivered' ? 'delivered' : 'processing'
  })) || [];

  // Transform search history
  const searchHistory = jsonCustomer.searchHistory?.map((search: any) => ({
    query: search.query,
    timestamp: new Date(search.timestamp),
    resultsCount: search.resultsClicked?.length || 0,
    clickedResults: search.resultsClicked || [],
    device: 'desktop'
  })) || [];

  // Calculate order count and average order value
  const ordersCount = purchaseHistory.length;
  const averageOrderValue = ordersCount > 0 ? jsonCustomer.lifetimeValue / ordersCount : 0;

  // Get last order date
  const lastOrderDate = purchaseHistory.length > 0 
    ? purchaseHistory.sort((a: any, b: any) => b.date.getTime() - a.date.getTime())[0].date
    : null;

  // Transform cart abandonments
  const cartAbandonments = jsonCustomer.cartAbandonment?.map((cart: any, index: number) => ({
    id: `cart${index + 1}`,
    date: new Date(cart.date),
    products: cart.items.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: cart.cartValue / cart.items.length
    })),
    totalValue: cart.cartValue,
    recoveryAttempts: 0,
    recovered: false
  })) || [];

  // Map tier to customer group
  const customerGroupMap: Record<string, any> = {
    platinum: {
      id: 'platinum',
      name: 'Platinum Members',
      benefits: ['Lifetime warranty', 'Concierge service', 'Exclusive events'],
      discountPercentage: 15
    },
    gold: {
      id: 'gold',
      name: 'Gold Members',
      benefits: ['Extended warranty', 'Priority support', 'Early access'],
      discountPercentage: 10
    },
    silver: {
      id: 'silver',
      name: 'Silver Members',
      benefits: ['Free shipping', 'Member pricing'],
      discountPercentage: 5
    },
    bronze: {
      id: 'bronze',
      name: 'Bronze Members',
      benefits: ['Member newsletter'],
      discountPercentage: 0
    }
  };

  // Transform behavioral insights from inferred interests
  const behavioralInsights = jsonCustomer.inferredInterests?.fromPhoneListening?.map((interest: any) => ({
    type: interest.topic.replace(/_/g, '-'),
    score: Math.round(interest.confidence * 100),
    evidence: [interest.context.replace(/_/g, ' ')],
    detectedAt: new Date(interest.detectedAt)
  })) || [];

  return {
    id: jsonCustomer.id,
    email: jsonCustomer.email,
    firstName: jsonCustomer.firstName,
    lastName: jsonCustomer.lastName,
    displayName: `${jsonCustomer.firstName} ${jsonCustomer.lastName}`,
    phone: jsonCustomer.phone,
    dateOfBirth: new Date(jsonCustomer.dateOfBirth),
    gender: jsonCustomer.gender,
    addresses: [{
      id: 'addr1',
      address1: jsonCustomer.address.street,
      city: jsonCustomer.address.city,
      province: jsonCustomer.address.state,
      country: jsonCustomer.address.country,
      zip: jsonCustomer.address.zipCode,
      countryCode: jsonCustomer.address.country === 'USA' ? 'US' : jsonCustomer.address.country,
      countryName: jsonCustomer.address.country === 'USA' ? 'United States' : jsonCustomer.address.country,
      default: true
    }],
    defaultAddressId: 'addr1',
    tags: [jsonCustomer.tier, ...jsonCustomer.preferences.preferredCategories.map((c: string) => c.toLowerCase().replace(/ /g, '-'))],
    verifiedEmail: true,
    acceptsMarketing: jsonCustomer.preferences.newsletter,
    marketingOptInLevel: jsonCustomer.preferences.newsletter ? 'confirmed-opt-in' : undefined,
    state: jsonCustomer.status === 'active' ? 'enabled' : 'disabled',
    taxExempt: false,
    totalSpent: jsonCustomer.lifetimeValue,
    ordersCount,
    lastOrderDate,
    averageOrderValue,
    createdAt: new Date(jsonCustomer.createdAt),
    updatedAt: new Date(jsonCustomer.lastLoginAt),
    currency: 'USD',
    customerGroup: customerGroupMap[jsonCustomer.tier] || customerGroupMap.bronze,
    preferences: {
      language: 'en',
      communicationChannels: jsonCustomer.preferences.smsNotifications && jsonCustomer.preferences.pushNotifications 
        ? ['email', 'sms', 'push']
        : jsonCustomer.preferences.smsNotifications 
        ? ['email', 'sms']
        : ['email'],
      productCategories: jsonCustomer.preferences.preferredCategories,
      brands: ['CHRONOS'],
      priceRange: {
        min: jsonCustomer.customerScore.pricesSensitivity > 0.5 ? 5000 : 10000,
        max: jsonCustomer.customerScore.pricesSensitivity > 0.5 ? 50000 : 500000
      },
      shippingPreference: 'express',
      paymentMethods: ['credit-card', 'wire-transfer']
    },
    analytics: {
      purchaseHistory,
      searchHistory,
      browsingHistory: [],
      cartAbandonments,
      productInterests: searchHistory.flatMap((s: any) => 
        s.clickedResults.map((productId: string, index: number) => ({
          productId,
          interestScore: 90 - (index * 10),
          lastInteraction: s.timestamp,
          interactionCount: 1,
          addedToWishlist: false,
          purchasedBefore: purchaseHistory.some((p: any) => 
            p.products.some((pr: any) => pr.productId === productId)
          )
        }))
      ),
      behavioralInsights,
      segmentIds: [
        jsonCustomer.tier,
        ...jsonCustomer.inferredInterests?.fromSocialMedia || [],
        jsonCustomer.customerScore.loyaltyScore > 8 ? 'vip-customers' : 'regular-customers'
      ]
    }
  };
}

// Read customers from JSON file
function getCustomersFromFile(): Customer[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'customers.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const jsonCustomers = JSON.parse(fileContent);
    return jsonCustomers.map(transformJsonToCustomer);
  } catch (error) {
    console.error('Error reading customers from file:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const email = searchParams.get('email');
    const tag = searchParams.get('tag');
    const state = searchParams.get('state');
    const segment = searchParams.get('segment');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Get customers from JSON file
    const customers = getCustomersFromFile();
    let filteredCustomers = [...customers];
    
    if (email) {
      filteredCustomers = filteredCustomers.filter(c => 
        c.email.toLowerCase().includes(email.toLowerCase())
      );
    }
    
    if (tag) {
      filteredCustomers = filteredCustomers.filter(c => 
        c.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
      );
    }
    
    if (state) {
      filteredCustomers = filteredCustomers.filter(c => c.state === state);
    }
    
    if (segment) {
      filteredCustomers = filteredCustomers.filter(c => 
        c.analytics?.segmentIds.includes(segment)
      );
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCustomers = filteredCustomers.filter(c => 
        c.email.toLowerCase().includes(searchLower) ||
        c.firstName.toLowerCase().includes(searchLower) ||
        c.lastName.toLowerCase().includes(searchLower) ||
        c.tags.some(t => t.toLowerCase().includes(searchLower))
      );
    }
    
    if (sortBy) {
      switch (sortBy) {
        case 'spent-desc':
          filteredCustomers.sort((a, b) => b.totalSpent - a.totalSpent);
          break;
        case 'spent-asc':
          filteredCustomers.sort((a, b) => a.totalSpent - b.totalSpent);
          break;
        case 'orders-desc':
          filteredCustomers.sort((a, b) => b.ordersCount - a.ordersCount);
          break;
        case 'orders-asc':
          filteredCustomers.sort((a, b) => a.ordersCount - b.ordersCount);
          break;
        case 'newest':
          filteredCustomers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
        case 'oldest':
          filteredCustomers.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
          break;
        case 'last-order':
          filteredCustomers.sort((a, b) => 
            (b.lastOrderDate?.getTime() || 0) - (a.lastOrderDate?.getTime() || 0)
          );
          break;
      }
    }
    
    const total = filteredCustomers.length;
    const paginatedCustomers = filteredCustomers.slice(offset, offset + limit);
    
    return NextResponse.json({
      customers: paginatedCustomers,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}