'use client';

import { useState, useEffect } from 'react';

export interface CustomerContext {
  customerId: string;
  isGuest: boolean;
  customer?: any; // Full customer data if available
}

export function useCustomerContext(): CustomerContext {
  const [customerId, setCustomerId] = useState<string>('guest');
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    // Get customer ID from localStorage
    const savedCustomerId = localStorage.getItem('debugCustomerId') || 'guest';
    setCustomerId(savedCustomerId);

    // Fetch customer data if not a guest
    if (savedCustomerId !== 'guest') {
      fetch(`/api/customers`)
        .then(res => res.json())
        .then(data => {
          const customers = data.customers || [];
          const foundCustomer = customers.find((c: any) => c.id === savedCustomerId);
          if (foundCustomer) {
            setCustomer(foundCustomer);
          }
        })
        .catch(console.error);
    }
  }, []);

  return {
    customerId,
    isGuest: customerId === 'guest',
    customer,
  };
}