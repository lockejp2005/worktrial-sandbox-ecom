# Chronos Management Backend

Welcome to **Chronos**, a luxury Swiss watch store.  
Except the management system isn’t very luxurious. In fact, it doesn’t exist. This is not good.  

Your job: build a **custom management backend** (think Shopify, but bespoke) so Chronos can manage orders, customers, products, and more.  

---

## 📦 What You’re Given

- **Products** → `./data/products.json`  
- **Customers** → `./data/customers.json`  

That’s it. The rest is up to you. It is highly reccommend you make new data to work with. 

---

## 🎯 Core Requirement

- **For You Engine**  
  - Implement the `/for-you` endpoint to recommend the top 4 products for a given customer.  
  - The frontend passes a simulated user ID (stored in `localStorage`).  
  - Bonus: let admins adjust the recommendation logic in the dashboard.  

---

## 🧩 Optional Components

Pick 2 from this list to build beyond the basics:  

- Orders management  
- On-site sale/promo manager
- Customer support (VIP clients need fast responses)  
- Basic Checkout with extensions (discounts, promos, free Zurich flights)  
- Inventory management (stock levels, suppliers, alerts)  
- Logistics & shipping tracking  
- Tax & compliance reporting (VAT etc)
- Loyalty programs & VIP tiers  
- Revenue optimization tools  

---

## 🚀 Run

```bash
npm install
npm run dev
