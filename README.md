# Your task

Welcome to Chronos, a luxury watch store. Except the management system isn't very luxourious, in fact it doesn't exist at all. This is not good. We need a management system so that this luxury Swiss watch dealer can manage orders, customers, products, sales, analytics and more. Think like a custom management backend similar to shopify. 

Anyway, the backend is entirely built out, and the data is minimal. You are given just products and customers in JSON files in ./data. You need to make descisions on what other data you want to make for these base set of customers and products (orders is likely a good start) and operate with the goal of making this backend dashboard comprehensive and tailored towards the specific watch store. Other reccommendations include sales, you should make a tab for managing on site sales. Maybe also customer support, high profile clients need quick and well-managed support. 

Most of the base data can be static, you can just add JSON files to the ./data directory of what you want to include. What needs to be done properly is the interpretation of this data, and how it is fetched and displayed to the shop manager. You can also make changes to the main landing page to extend functionality, how about a basic checkout page for discount coupons? Or extends the products catalogue to include free flights to Zurich with the purchase of any watch.

There is a for-you endpoint in the base project, you should work out a way to top 4 reccommend products to customer based off of their data. The front end sends the simulated users id (you can set this in db tab, it appends to localStorage then front end gets it and sends with request to for you endpoint). If you can, let the admin manage this logic in the dashboard as well. 

The choice is yours, your job is to come up with functionally difficult and useful business components related to the management backend. Start with basic interpretation of the existing product and customer data - maybe some charts - then expand to revenue optimizing features and logistic management displays.  

## Run
To run: npm run dev

