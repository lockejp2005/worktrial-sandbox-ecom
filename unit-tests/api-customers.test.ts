import { describe, it, expect } from '@jest/globals';
import { NextRequest } from 'next/server';
import { GET as getCustomers } from '../src/app/api/customers/route';

describe('Customers API', () => {
  describe('GET /api/customers', () => {
    it('should return all customers with default pagination', async () => {
      const request = new NextRequest('http://localhost:3000/api/customers');
      const response = await getCustomers(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.customers).toBeDefined();
      expect(Array.isArray(data.customers)).toBe(true);
      expect(data.customers.length).toBeGreaterThan(0);
      expect(data.pagination).toBeDefined();
      expect(data.pagination.limit).toBe(10);
      expect(data.pagination.offset).toBe(0);
    });

    it('should filter customers by email', async () => {
      const request = new NextRequest('http://localhost:3000/api/customers?email=sarah.johnson@email.com');
      const response = await getCustomers(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.customers.length).toBeGreaterThan(0);
      expect(data.customers[0].email).toBe('sarah.johnson@email.com');
    });

    it('should filter customers by tag', async () => {
      const request = new NextRequest('http://localhost:3000/api/customers?tag=vip');
      const response = await getCustomers(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      data.customers.forEach((customer: any) => {
        expect(customer.tags).toContain('vip');
      });
    });

    it('should validate customer structure', async () => {
      const request = new NextRequest('http://localhost:3000/api/customers');
      const response = await getCustomers(request);
      const data = await response.json();
      const customer = data.customers[0];

      expect(customer).toMatchObject({
        id: expect.any(String),
        email: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
        addresses: expect.any(Array),
        tags: expect.any(Array),
        verifiedEmail: expect.any(Boolean),
        acceptsMarketing: expect.any(Boolean),
        state: expect.any(String),
        totalSpent: expect.any(Number),
        ordersCount: expect.any(Number),
        currency: expect.any(String),
      });
    });

    it('should have valid address structure', async () => {
      const request = new NextRequest('http://localhost:3000/api/customers');
      const response = await getCustomers(request);
      const data = await response.json();
      const address = data.customers[0].addresses[0];

      expect(address).toMatchObject({
        id: expect.any(String),
        address1: expect.any(String),
        city: expect.any(String),
        country: expect.any(String),
        zip: expect.any(String),
        countryCode: expect.any(String),
        countryName: expect.any(String),
        default: expect.any(Boolean),
      });
    });

    it('should have valid analytics structure', async () => {
      const request = new NextRequest('http://localhost:3000/api/customers');
      const response = await getCustomers(request);
      const data = await response.json();
      const analytics = data.customers[0].analytics;

      expect(analytics).toMatchObject({
        purchaseHistory: expect.any(Array),
        searchHistory: expect.any(Array),
        browsingHistory: expect.any(Array),
        cartAbandonments: expect.any(Array),
        productInterests: expect.any(Array),
        behavioralInsights: expect.any(Array),
        segmentIds: expect.any(Array),
      });
    });

    it('should have valid behavioral insights', async () => {
      const request = new NextRequest('http://localhost:3000/api/customers');
      const response = await getCustomers(request);
      const data = await response.json();
      const insights = data.customers[0].analytics.behavioralInsights;

      expect(insights.length).toBeGreaterThan(0);
      insights.forEach((insight: any) => {
        expect(insight).toMatchObject({
          type: expect.any(String),
          score: expect.any(Number),
          evidence: expect.any(Array),
          detectedAt: expect.any(String),
        });
        expect(['brand-loyalty', 'price-sensitivity', 'trend-follower', 'bulk-buyer', 'window-shopper', 'impulse-buyer']).toContain(insight.type);
      });
    });

    it('should support pagination', async () => {
      const request = new NextRequest('http://localhost:3000/api/customers?limit=1&offset=1');
      const response = await getCustomers(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.customers.length).toBe(1);
      expect(data.pagination.limit).toBe(1);
      expect(data.pagination.offset).toBe(1);
    });

    it('should sort customers by total spent', async () => {
      const request = new NextRequest('http://localhost:3000/api/customers?sortBy=totalSpent-desc');
      const response = await getCustomers(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      for (let i = 1; i < data.customers.length; i++) {
        expect(data.customers[i - 1].totalSpent).toBeGreaterThanOrEqual(data.customers[i].totalSpent);
      }
    });

    it('should search customers by name', async () => {
      const request = new NextRequest('http://localhost:3000/api/customers?search=Sarah');
      const response = await getCustomers(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.customers.length).toBeGreaterThan(0);
      data.customers.forEach((customer: any) => {
        const searchableText = `${customer.firstName} ${customer.lastName} ${customer.email}`.toLowerCase();
        expect(searchableText).toContain('sarah');
      });
    });

    it('should have customer group information for VIP customers', async () => {
      const request = new NextRequest('http://localhost:3000/api/customers?tag=vip');
      const response = await getCustomers(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      const vipCustomer = data.customers[0];
      expect(vipCustomer.customerGroup).toBeDefined();
      expect(vipCustomer.customerGroup).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        benefits: expect.any(Array),
      });
    });
  });
});