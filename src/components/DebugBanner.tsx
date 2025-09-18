'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  customerGroup?: {
    name: string;
  };
}

export default function DebugBanner() {
  const [isOpen, setIsOpen] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('guest');
  const pathname = usePathname();
  
  const isStoreFront = pathname === '/' || (!pathname.startsWith('/admin') && !pathname.startsWith('/api-explorer') && !pathname.startsWith('/data-browser'));

  useEffect(() => {
    // Load customers from data directory
    fetch('/data/customers.json')
      .then(res => res.json())
      .then(data => setCustomers(data))
      .catch(() => {
        // If direct file fetch fails, try the API
        fetch('/api/customers')
          .then(res => res.json())
          .then(data => setCustomers(data.customers || []))
          .catch(console.error);
      });

    // Load saved customer from localStorage
    const savedCustomer = localStorage.getItem('debugCustomerId');
    if (savedCustomer) {
      setSelectedCustomerId(savedCustomer);
    }
  }, []);

  const handleCustomerChange = (customerId: string) => {
    setSelectedCustomerId(customerId);
    localStorage.setItem('debugCustomerId', customerId);
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('customerChanged'));
    // Note: storage event will handle cross-tab updates
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-0 left-1/2 transform -translate-x-1/2 z-[100] bg-yellow-500 text-black px-3 py-1 text-xs font-mono rounded-b-md shadow-lg hover:bg-yellow-400 transition-all opacity-30 hover:opacity-100"
      >
        ▼ Debug
      </button>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-yellow-500 text-black opacity-50 hover:opacity-100 transition-opacity duration-200">
      <div className="w-full px-3 py-1.5 md:py-2">
        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono">🔧</span>
              <div className="flex gap-1.5">
                <a href="/" className="px-2 py-0.5 bg-black/80 text-yellow-300 rounded text-xs font-mono">Store</a>
                <a href="/admin" className="px-2 py-0.5 bg-black/80 text-yellow-300 rounded text-xs font-mono">Admin</a>
                <a href="/api-explorer" className="px-2 py-0.5 bg-black/80 text-yellow-300 rounded text-xs font-mono">API</a>
                <a href="/data-browser" className="px-2 py-0.5 bg-black/80 text-yellow-300 rounded text-xs font-mono hidden min-[400px]:inline-block">Data</a>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-black hover:text-gray-700 text-sm font-bold ml-2"
            >
              ✕
            </button>
          </div>
          {isStoreFront && (
            <div className="mt-1.5 flex items-center gap-1.5 bg-white/90 px-2 py-1 rounded text-xs">
              <span className="font-mono text-gray-700">👤</span>
              <select
                value={selectedCustomerId}
                onChange={(e) => handleCustomerChange(e.target.value)}
                className="bg-transparent text-gray-900 font-mono text-xs focus:outline-none cursor-pointer flex-1 min-w-0"
              >
                <option value="guest">Guest</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.firstName} {customer.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Tablet & Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-bold font-mono text-sm">🔧 DEBUG MODE</span>
            <div className="flex items-center gap-2">
              <a href="/" className="px-3 py-1 bg-black text-yellow-500 rounded hover:bg-gray-800 transition-colors text-sm font-mono">
                Store Front
              </a>
              <a href="/admin" className="px-3 py-1 bg-black text-yellow-500 rounded hover:bg-gray-800 transition-colors text-sm font-mono">
                Admin Dashboard
              </a>
              <a href="/api-explorer" className="px-3 py-1 bg-black text-yellow-500 rounded hover:bg-gray-800 transition-colors text-sm font-mono">
                API Explorer
              </a>
              <a href="/data-browser" className="px-3 py-1 bg-black text-yellow-500 rounded hover:bg-gray-800 transition-colors text-sm font-mono">
                Data Browser
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isStoreFront && (
              <div className="flex items-center gap-2 bg-white px-3 py-1 rounded shadow-md">
                <span className="font-mono text-sm text-gray-700">👤 Browsing as:</span>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  className="bg-transparent text-gray-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer"
                >
                  <option value="guest">Guest User</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.firstName} {customer.lastName}
                      {customer.customerGroup && ` (${customer.customerGroup.name})`}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-black hover:text-gray-700 font-mono text-sm px-2"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}