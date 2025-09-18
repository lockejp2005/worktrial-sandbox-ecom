import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types/product';
import fs from 'fs';
import path from 'path';

// Transform JSON product to match Product type
function transformJsonToProduct(jsonProduct: any): Product {
  return {
    id: jsonProduct.id,
    name: jsonProduct.name,
    description: jsonProduct.description,
    price: jsonProduct.price,
    currency: 'USD',
    images: jsonProduct.images || [],
    category: jsonProduct.category,
    subcategory: jsonProduct.subcategory,
    tags: jsonProduct.tags || [],
    sku: jsonProduct.sku,
    inventory: {
      quantity: jsonProduct.inventory?.inStock || 0,
      trackingEnabled: true,
      lowStockThreshold: jsonProduct.inventory?.reorderPoint || 10
    },
    variants: jsonProduct.variants || [],
    weight: jsonProduct.weight,
    dimensions: jsonProduct.dimensions,
    seo: jsonProduct.seo || {
      title: jsonProduct.name,
      description: jsonProduct.description,
      keywords: jsonProduct.tags || []
    },
    status: jsonProduct.status || 'active',
    createdAt: new Date(jsonProduct.createdAt || Date.now()),
    updatedAt: new Date(jsonProduct.updatedAt || Date.now()),
    discountable: jsonProduct.discountable !== false,
    requiresShipping: jsonProduct.requiresShipping !== false,
    taxable: jsonProduct.taxable !== false,
    compareAtPrice: jsonProduct.compareAtPrice,
    costPerItem: jsonProduct.cost
  };
}

// Read products from JSON file
function getProductsFromFile(): Product[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'products.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const jsonProducts = JSON.parse(fileContent);
    return jsonProducts.map(transformJsonToProduct);
  } catch (error) {
    console.error('Error reading products from file:', error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;
    
    // TODO: Implement personalized product recommendations based on userId
    // 
    // Implement your own algorithmic logic to return products personalized to each user.
    
    // For now, return the top 4 products as a placeholder
    const products = getProductsFromFile();
    const topProducts = products.slice(0, 4);
    
    return NextResponse.json({
      products: topProducts,
      userId: userId, // Echo back the userId to confirm it was received
      message: "Currently returning top 4 products. Implement personalization logic here."
    });
  } catch (error) {
    console.error('Error generating personalized products:', error);
    return NextResponse.json(
      { error: 'Failed to generate personalized recommendations' },
      { status: 500 }
    );
  }
}