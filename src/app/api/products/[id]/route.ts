import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types/product';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with active noise cancellation and 30-hour battery life.',
    price: 299.99,
    currency: 'USD',
    images: [
      '/images/products/headphones-1.jpg',
      '/images/products/headphones-2.jpg',
      '/images/products/headphones-3.jpg'
    ],
    category: 'Electronics',
    subcategory: 'Audio',
    tags: ['wireless', 'noise-cancelling', 'premium', 'bluetooth'],
    sku: 'WH-1000XM4',
    inventory: {
      quantity: 150,
      trackingEnabled: true,
      lowStockThreshold: 20
    },
    variants: [
      {
        id: 'v1',
        title: 'Black',
        price: 299.99,
        sku: 'WH-1000XM4-BLK',
        position: 1,
        inventoryPolicy: 'deny',
        fulfillmentService: 'manual',
        taxable: true,
        inventoryQuantity: 75,
        requiresShipping: true,
        option1: 'Black'
      },
      {
        id: 'v2',
        title: 'Silver',
        price: 299.99,
        sku: 'WH-1000XM4-SLV',
        position: 2,
        inventoryPolicy: 'deny',
        fulfillmentService: 'manual',
        taxable: true,
        inventoryQuantity: 75,
        requiresShipping: true,
        option1: 'Silver'
      }
    ],
    weight: 254,
    dimensions: {
      width: 18.0,
      height: 22.0,
      depth: 8.0,
      unit: 'cm'
    },
    seo: {
      title: 'Premium Wireless Headphones | Best Noise Cancelling',
      description: 'Experience premium sound quality with our wireless headphones featuring industry-leading noise cancellation.',
      keywords: ['wireless headphones', 'noise cancelling', 'bluetooth headphones']
    },
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-20'),
    discountable: true,
    requiresShipping: true,
    taxable: true,
    compareAtPrice: 349.99,
    costPerItem: 125.00
  },
  {
    id: '2',
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable organic cotton t-shirt available in multiple colors.',
    price: 29.99,
    currency: 'USD',
    images: [
      '/images/products/tshirt-1.jpg',
      '/images/products/tshirt-2.jpg'
    ],
    category: 'Apparel',
    subcategory: 'Tops',
    tags: ['organic', 'cotton', 'sustainable', 'basic'],
    sku: 'OCT-001',
    inventory: {
      quantity: 500,
      trackingEnabled: true,
      lowStockThreshold: 50
    },
    status: 'active',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-15'),
    discountable: true,
    requiresShipping: true,
    taxable: true
  },
  {
    id: '3',
    name: 'Smart Home Security Camera',
    description: 'AI-powered security camera with night vision, motion detection, and cloud storage.',
    price: 199.99,
    currency: 'USD',
    images: [
      '/images/products/camera-1.jpg',
      '/images/products/camera-2.jpg'
    ],
    category: 'Smart Home',
    subcategory: 'Security',
    tags: ['security', 'smart-home', 'ai', 'camera'],
    sku: 'SHC-2024',
    inventory: {
      quantity: 200,
      trackingEnabled: true,
      lowStockThreshold: 30
    },
    status: 'active',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-03-18'),
    discountable: true,
    requiresShipping: true,
    taxable: true,
    compareAtPrice: 249.99
  },
  {
    id: '4',
    name: 'Ergonomic Office Chair',
    description: 'Professional ergonomic office chair with lumbar support and adjustable height.',
    price: 449.99,
    currency: 'USD',
    images: [
      '/images/products/chair-1.jpg',
      '/images/products/chair-2.jpg',
      '/images/products/chair-3.jpg'
    ],
    category: 'Furniture',
    subcategory: 'Office',
    tags: ['ergonomic', 'office', 'chair', 'professional'],
    sku: 'EOC-PRO',
    inventory: {
      quantity: 50,
      trackingEnabled: true,
      lowStockThreshold: 10
    },
    weight: 15000,
    dimensions: {
      width: 68.0,
      height: 120.0,
      depth: 68.0,
      unit: 'cm'
    },
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-03-22'),
    discountable: true,
    requiresShipping: true,
    taxable: true,
    compareAtPrice: 599.99,
    costPerItem: 225.00
  },
  {
    id: '5',
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
    price: 34.99,
    currency: 'USD',
    images: [
      '/images/products/bottle-1.jpg',
      '/images/products/bottle-2.jpg'
    ],
    category: 'Home & Kitchen',
    subcategory: 'Drinkware',
    tags: ['water-bottle', 'insulated', 'eco-friendly', 'reusable'],
    sku: 'SSWB-500',
    inventory: {
      quantity: 300,
      trackingEnabled: true,
      lowStockThreshold: 40
    },
    status: 'active',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-03-19'),
    discountable: true,
    requiresShipping: true,
    taxable: true
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = mockProducts.find(p => p.id === id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}