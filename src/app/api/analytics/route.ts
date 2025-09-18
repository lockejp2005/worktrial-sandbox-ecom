import { NextRequest, NextResponse } from 'next/server';
import { Order } from '@/types/order';
import { Product } from '@/types/product';
import { Customer } from '@/types/customer';
import fs from 'fs';
import path from 'path';

// Helper function to transform and load data
function loadDataFromFiles() {
  try {
    // Load orders
    const ordersFilePath = path.join(process.cwd(), 'data', 'orders.json');
    const ordersContent = fs.readFileSync(ordersFilePath, 'utf8');
    const orders = JSON.parse(ordersContent);

    // Load products
    const productsFilePath = path.join(process.cwd(), 'data', 'products.json');
    const productsContent = fs.readFileSync(productsFilePath, 'utf8');
    const products = JSON.parse(productsContent);

    // Load customers
    const customersFilePath = path.join(process.cwd(), 'data', 'customers.json');
    const customersContent = fs.readFileSync(customersFilePath, 'utf8');
    const customers = JSON.parse(customersContent);

    return { orders, products, customers };
  } catch (error) {
    console.error('Error loading data files:', error);
    return { orders: [], products: [], customers: [] };
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const type = searchParams.get('type') || 'overview';

    const { orders, products, customers } = loadDataFromFiles();

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(period));

    // Filter orders by date range
    const filteredOrders = orders.filter((order: any) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });

    switch (type) {
      case 'overview':
        const totalRevenue = filteredOrders.reduce((sum: number, order: any) => sum + order.total, 0);
        const totalOrders = filteredOrders.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const totalProducts = products.length;
        const totalCustomers = customers.length;

        // Calculate conversion rate (mock data)
        const conversionRate = 0.032;

        // Calculate growth compared to previous period
        const previousPeriodStart = new Date(startDate);
        previousPeriodStart.setDate(previousPeriodStart.getDate() - parseInt(period));
        const previousPeriodOrders = orders.filter((order: any) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= previousPeriodStart && orderDate < startDate;
        });
        const previousRevenue = previousPeriodOrders.reduce((sum: number, order: any) => sum + order.total, 0);
        const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

        return NextResponse.json({
          totalRevenue,
          totalOrders,
          totalProducts,
          totalCustomers,
          averageOrderValue,
          conversionRate,
          revenueGrowth,
          period: parseInt(period)
        });

      case 'sales':
        // Calculate sales by day
        const salesByDay = [];
        for (let i = parseInt(period) - 1; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dayStart = new Date(date);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(date);
          dayEnd.setHours(23, 59, 59, 999);

          const dayOrders = filteredOrders.filter((order: any) => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= dayStart && orderDate <= dayEnd;
          });

          const dayRevenue = dayOrders.reduce((sum: number, order: any) => sum + order.total, 0);
          
          salesByDay.push({
            date: date.toISOString().split('T')[0],
            revenue: dayRevenue,
            orders: dayOrders.length
          });
        }

        return NextResponse.json({ salesByDay });

      case 'products':
        // Calculate top products by revenue
        const productSales: Record<string, { quantity: number; revenue: number; title: string }> = {};

        filteredOrders.forEach((order: any) => {
          order.items.forEach((item: any) => {
            if (!productSales[item.productId]) {
              productSales[item.productId] = {
                quantity: 0,
                revenue: 0,
                title: item.title
              };
            }
            productSales[item.productId].quantity += item.quantity;
            productSales[item.productId].revenue += item.linePrice;
          });
        });

        const topProducts = Object.entries(productSales)
          .map(([productId, data]) => ({
            productId,
            title: data.title,
            quantity: data.quantity,
            revenue: data.revenue
          }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 10);

        return NextResponse.json({ topProducts });

      case 'customers':
        // Calculate top customers by total spent
        const customerSpending: Record<string, { orders: number; totalSpent: number; name: string }> = {};

        filteredOrders.forEach((order: any) => {
          if (!customerSpending[order.customerId]) {
            customerSpending[order.customerId] = {
              orders: 0,
              totalSpent: 0,
              name: `${order.customer.firstName} ${order.customer.lastName}`
            };
          }
          customerSpending[order.customerId].orders += 1;
          customerSpending[order.customerId].totalSpent += order.total;
        });

        const topCustomers = Object.entries(customerSpending)
          .map(([customerId, data]) => ({
            customerId,
            name: data.name,
            orders: data.orders,
            totalSpent: data.totalSpent
          }))
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, 10);

        return NextResponse.json({ topCustomers });

      case 'categories':
        // Calculate revenue by category
        const categoryRevenue: Record<string, number> = {};

        filteredOrders.forEach((order: any) => {
          order.items.forEach((item: any) => {
            // Find the product to get its category
            const product = products.find((p: any) => p.id === item.productId);
            if (product) {
              const category = product.category || 'Other';
              if (!categoryRevenue[category]) {
                categoryRevenue[category] = 0;
              }
              categoryRevenue[category] += item.linePrice;
            }
          });
        });

        const revenueByCategory = Object.entries(categoryRevenue)
          .map(([category, revenue]) => ({ category, revenue }))
          .sort((a, b) => b.revenue - a.revenue);

        return NextResponse.json({ revenueByCategory });

      default:
        return NextResponse.json({ error: 'Invalid analytics type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error generating analytics:', error);
    return NextResponse.json(
      { error: 'Failed to generate analytics' },
      { status: 500 }
    );
  }
}