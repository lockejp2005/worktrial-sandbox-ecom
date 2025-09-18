export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  addresses: Address[];
  defaultAddressId?: string;
  tags: string[];
  notes?: string;
  verifiedEmail: boolean;
  acceptsMarketing: boolean;
  marketingOptInLevel?: 'single-opt-in' | 'confirmed-opt-in' | 'unknown';
  smsMarketingConsent?: {
    state: 'subscribed' | 'not-subscribed' | 'pending' | 'unsubscribed';
    optInLevel: 'single-opt-in' | 'confirmed-opt-in' | 'unknown';
    consentUpdatedAt?: Date;
    consentCollectedFrom?: string;
  };
  state: 'disabled' | 'invited' | 'enabled' | 'declined';
  taxExempt: boolean;
  taxExemptions?: string[];
  totalSpent: number;
  ordersCount: number;
  lastOrderDate?: Date;
  averageOrderValue?: number;
  createdAt: Date;
  updatedAt: Date;
  currency: string;
  multipassIdentifier?: string;
  customerGroup?: CustomerGroup;
  preferences?: CustomerPreferences;
  analytics?: CustomerAnalytics;
  customFields?: Record<string, any>;
}

export interface Address {
  id: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  country: string;
  zip: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  provinceCode?: string;
  countryCode: string;
  countryName: string;
  default: boolean;
}

export interface CustomerGroup {
  id: string;
  name: string;
  benefits?: string[];
  discountPercentage?: number;
  minimumSpend?: number;
}

export interface CustomerPreferences {
  language: string;
  communicationChannels: ('email' | 'sms' | 'push' | 'postal')[];
  productCategories: string[];
  brands: string[];
  priceRange: {
    min: number;
    max: number;
  };
  shippingPreference: 'standard' | 'express' | 'overnight';
  paymentMethods: string[];
}

export interface CustomerAnalytics {
  purchaseHistory: PurchaseHistoryItem[];
  searchHistory: SearchHistoryItem[];
  browsingHistory: BrowsingHistoryItem[];
  cartAbandonments: CartAbandonment[];
  productInterests: ProductInterest[];
  behavioralInsights?: BehavioralInsight[];
  predictedChurn?: number;
  lifetimeValue?: number;
  nextPurchasePrediction?: {
    date: Date;
    category: string;
    confidence: number;
  };
  segmentIds: string[];
}

export interface PurchaseHistoryItem {
  orderId: string;
  date: Date;
  products: {
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  paymentMethod: string;
  fulfillmentStatus: string;
}

export interface SearchHistoryItem {
  query: string;
  timestamp: Date;
  resultsCount: number;
  clickedResults: string[];
  device: string;
  location?: {
    city?: string;
    region?: string;
    country?: string;
  };
}

export interface BrowsingHistoryItem {
  productId: string;
  timestamp: Date;
  duration: number;
  source: 'direct' | 'search' | 'email' | 'social' | 'ad' | 'other';
  actions: ('view' | 'add-to-cart' | 'add-to-wishlist' | 'share')[];
}

export interface CartAbandonment {
  id: string;
  date: Date;
  products: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  totalValue: number;
  recoveryAttempts: number;
  recovered: boolean;
}

export interface ProductInterest {
  productId: string;
  interestScore: number;
  lastInteraction: Date;
  interactionCount: number;
  addedToWishlist: boolean;
  purchasedBefore: boolean;
}

export interface BehavioralInsight {
  type: 'brand-loyalty' | 'price-sensitivity' | 'trend-follower' | 'bulk-buyer' | 'window-shopper' | 'impulse-buyer';
  score: number;
  evidence: string[];
  detectedAt: Date;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria[];
  customerCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SegmentCriteria {
  field: string;
  operator: 'equals' | 'not-equals' | 'greater-than' | 'less-than' | 'contains' | 'not-contains' | 'in' | 'not-in';
  value: any;
}