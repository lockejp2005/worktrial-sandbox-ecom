export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  subcategory?: string;
  tags: string[];
  sku: string;
  inventory: {
    quantity: number;
    trackingEnabled: boolean;
    lowStockThreshold?: number;
  };
  variants?: ProductVariant[];
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  status: 'active' | 'draft' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  vendorId?: string;
  discountable: boolean;
  requiresShipping: boolean;
  taxable: boolean;
  compareAtPrice?: number;
  costPerItem?: number;
  customFields?: Record<string, any>;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  sku: string;
  position: number;
  inventoryPolicy: 'deny' | 'continue';
  compareAtPrice?: number;
  fulfillmentService: string;
  inventoryManagement?: string;
  option1?: string;
  option2?: string;
  option3?: string;
  taxable: boolean;
  barcode?: string;
  grams?: number;
  imageId?: string;
  weight?: number;
  weightUnit?: string;
  inventoryItemId?: string;
  inventoryQuantity: number;
  oldInventoryQuantity?: number;
  requiresShipping: boolean;
}

export interface ProductCollection {
  id: string;
  title: string;
  description?: string;
  image?: string;
  products: string[];
  rules?: CollectionRule[];
  sortOrder: 'manual' | 'best-selling' | 'title-ascending' | 'title-descending' | 'price-ascending' | 'price-descending' | 'created-ascending' | 'created-descending';
  publishedAt?: Date;
}

export interface CollectionRule {
  column: string;
  relation: 'equals' | 'not-equals' | 'contains' | 'not-contains' | 'starts-with' | 'ends-with' | 'greater-than' | 'less-than';
  condition: string;
}