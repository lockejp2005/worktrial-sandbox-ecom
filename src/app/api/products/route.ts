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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Get products from JSON file
    const products = getProductsFromFile();
    let filteredProducts = [...products];
    
    if (category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (tag) {
      filteredProducts = filteredProducts.filter(p => 
        p.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
      );
    }
    
    if (minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
    }
    
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
    }
    
    if (status) {
      filteredProducts = filteredProducts.filter(p => p.status === status);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags.some(t => t.toLowerCase().includes(searchLower))
      );
    }
    
    if (sortBy) {
      switch (sortBy) {
        case 'price-asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'name-asc':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'newest':
          filteredProducts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
        case 'oldest':
          filteredProducts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
          break;
      }
    }
    
    const total = filteredProducts.length;
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);
    
    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}