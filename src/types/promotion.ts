export interface Promotion {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'scheduled' | 'expired' | 'disabled';
  type: 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_x_get_y';
  value: number;
  code?: string;
  
  // Usage limits
  usageLimit?: number;
  usageCount: number;
  customerUsageLimit?: number;
  
  // Date constraints
  startsAt?: Date;
  endsAt?: Date;
  
  // Targeting
  targetType: 'all' | 'specific_products' | 'specific_collections' | 'minimum_amount';
  targetedProductIds?: string[];
  targetedCollectionIds?: string[];
  minimumAmount?: number;
  
  // Customer eligibility
  customerEligibility: 'all' | 'specific_groups' | 'specific_customers';
  eligibleCustomerGroupIds?: string[];
  eligibleCustomerIds?: string[];
  
  // Prerequisites
  prerequisiteType?: 'none' | 'minimum_amount' | 'minimum_quantity';
  prerequisiteAmount?: number;
  prerequisiteQuantity?: number;
  
  // Buy X Get Y specific
  buyXGetY?: {
    buyQuantity: number;
    getQuantity: number;
    buyProductIds?: string[];
    getProductIds?: string[];
  };
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface PromotionUsage {
  id: string;
  promotionId: string;
  orderId: string;
  customerId: string;
  discountAmount: number;
  usedAt: Date;
}

export interface PromotionAnalytics {
  promotionId: string;
  title: string;
  totalUsage: number;
  totalRevenue: number;
  totalDiscount: number;
  conversionRate: number;
  averageOrderValue: number;
}