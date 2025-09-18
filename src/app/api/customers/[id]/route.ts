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
    id: jsonCustomer.id.replace('cust_', ''),
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
function getCustomerFromFile(customerId: string): Customer | null {
  try {
    const filePath = path.join(process.cwd(), 'data', 'customers.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const jsonCustomers = JSON.parse(fileContent);
    
    // Find customer by id (supporting both with and without 'cust_' prefix)
    const jsonCustomer = jsonCustomers.find((c: any) => 
      c.id === customerId || 
      c.id === `cust_${customerId}` || 
      c.id.replace('cust_', '') === customerId
    );
    
    if (!jsonCustomer) {
      return null;
    }
    
    return transformJsonToCustomer(jsonCustomer);
  } catch (error) {
    console.error('Error reading customer from file:', error);
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customer = getCustomerFromFile(id);
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}