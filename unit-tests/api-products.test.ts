import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { NextRequest } from 'next/server';
import { GET as getProducts } from '../src/app/api/products/route';
import { GET as getProductById } from '../src/app/api/products/[id]/route';

describe('Products API', () => {
  describe('GET /api/products', () => {
    it('should return all products with default pagination', async () => {
      const request = new NextRequest('http://localhost:3000/api/products');
      const response = await getProducts(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.products).toBeDefined();
      expect(Array.isArray(data.products)).toBe(true);
      expect(data.products.length).toBeLessThanOrEqual(10); // default limit
      expect(data.pagination).toBeDefined();
      expect(data.pagination.limit).toBe(10);
      expect(data.pagination.offset).toBe(0);
    });

    it('should filter products by category', async () => {
      const request = new NextRequest('http://localhost:3000/api/products?category=Electronics');
      const response = await getProducts(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      data.products.forEach((product: any) => {
        expect(product.category).toBe('Electronics');
      });
    });

    it('should filter products by price range', async () => {
      const request = new NextRequest('http://localhost:3000/api/products?minPrice=100&maxPrice=300');
      const response = await getProducts(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      data.products.forEach((product: any) => {
        expect(product.price).toBeGreaterThanOrEqual(100);
        expect(product.price).toBeLessThanOrEqual(300);
      });
    });

    it('should support pagination', async () => {
      const request = new NextRequest('http://localhost:3000/api/products?limit=2&offset=2');
      const response = await getProducts(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.products.length).toBeLessThanOrEqual(2);
      expect(data.pagination.limit).toBe(2);
      expect(data.pagination.offset).toBe(2);
    });

    it('should sort products by price ascending', async () => {
      const request = new NextRequest('http://localhost:3000/api/products?sortBy=price-asc');
      const response = await getProducts(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      for (let i = 1; i < data.products.length; i++) {
        expect(data.products[i].price).toBeGreaterThanOrEqual(data.products[i - 1].price);
      }
    });

    it('should search products by name', async () => {
      const request = new NextRequest('http://localhost:3000/api/products?search=headphones');
      const response = await getProducts(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      data.products.forEach((product: any) => {
        const searchableText = `${product.name} ${product.description} ${product.tags.join(' ')}`.toLowerCase();
        expect(searchableText).toContain('headphones');
      });
    });

    it('should handle errors gracefully', async () => {
      // Test with invalid query parameters
      const request = new NextRequest('http://localhost:3000/api/products?limit=invalid');
      const response = await getProducts(request);
      
      // Should still return 200 as the API handles invalid params gracefully
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/products/[id]', () => {
    it('should return a product by id', async () => {
      const request = new NextRequest('http://localhost:3000/api/products/1');
      const params = Promise.resolve({ id: '1' });
      const response = await getProductById(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe('1');
      expect(data.name).toBeDefined();
      expect(data.price).toBeDefined();
    });

    it('should return 404 for non-existent product', async () => {
      const request = new NextRequest('http://localhost:3000/api/products/999');
      const params = Promise.resolve({ id: '999' });
      const response = await getProductById(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Product not found');
    });

    it('should validate product structure', async () => {
      const request = new NextRequest('http://localhost:3000/api/products/1');
      const params = Promise.resolve({ id: '1' });
      const response = await getProductById(request, { params });
      const product = await response.json();

      expect(product).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        currency: expect.any(String),
        images: expect.any(Array),
        category: expect.any(String),
        tags: expect.any(Array),
        sku: expect.any(String),
        inventory: expect.any(Object),
        status: expect.any(String),
      });
    });

    it('should have valid inventory structure', async () => {
      const request = new NextRequest('http://localhost:3000/api/products/1');
      const params = Promise.resolve({ id: '1' });
      const response = await getProductById(request, { params });
      const product = await response.json();

      expect(product.inventory).toMatchObject({
        quantity: expect.any(Number),
        trackingEnabled: expect.any(Boolean),
      });
    });
  });
});