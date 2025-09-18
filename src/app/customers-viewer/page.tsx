'use client';

import { useState, useEffect } from 'react';

export default function CustomersViewer() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers');
      const data = await res.json();
      setCustomers(data.customers);
      if (data.customers.length > 0) {
        setSelectedCustomer(data.customers[0]);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading customer data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Data Viewer</h1>
            <p className="text-gray-600">Explore detailed customer profiles and analytics data</p>
          </div>
          <a
            href="/data-browser"
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Open Data Browser →
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Customer List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800">Customers ({customers.length})</h2>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {customers.map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      selectedCustomer?.id === customer.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="font-medium text-gray-900">
                      {customer.firstName} {customer.lastName}
                    </div>
                    <div className="text-sm text-gray-600">{customer.email}</div>
                    <div className="flex items-center gap-2 mt-2">
                      {customer.tags.slice(0, 2).map((tag: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                      {customer.tags.length > 2 && (
                        <span className="text-xs text-gray-500">+{customer.tags.length - 2}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Details */}
          {selectedCustomer && (
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedCustomer.firstName} {selectedCustomer.lastName}
                      </h2>
                      <p className="text-gray-600">{selectedCustomer.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {selectedCustomer.verifiedEmail && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Verified
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded ${
                          selectedCustomer.state === 'enabled' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedCustomer.state}
                        </span>
                        {selectedCustomer.customerGroup && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                            {selectedCustomer.customerGroup.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ${selectedCustomer.totalSpent.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">Total spent</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {selectedCustomer.ordersCount} orders
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex">
                    {['details', 'analytics', 'behavior', 'preferences'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-sm font-medium capitalize ${
                          activeTab === tab
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'details' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Contact Information</h3>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm text-gray-600">Phone</dt>
                            <dd className="text-sm font-medium text-gray-900">{selectedCustomer.phone || 'N/A'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-gray-600">Date of Birth</dt>
                            <dd className="text-sm font-medium text-gray-900">
                              {selectedCustomer.dateOfBirth 
                                ? new Date(selectedCustomer.dateOfBirth).toLocaleDateString()
                                : 'N/A'}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm text-gray-600">Gender</dt>
                            <dd className="text-sm font-medium text-gray-900 capitalize">
                              {selectedCustomer.gender || 'N/A'}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Address</h3>
                        {selectedCustomer.addresses.map((address: any) => (
                          <div key={address.id} className="text-sm">
                            <p className="font-medium text-gray-900">{address.address1}</p>
                            {address.address2 && <p className="text-gray-600">{address.address2}</p>}
                            <p className="text-gray-600">
                              {address.city}, {address.province} {address.zip}
                            </p>
                            <p className="text-gray-600">{address.country}</p>
                            {address.default && (
                              <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                Default
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="md:col-span-2">
                        <h3 className="font-semibold text-gray-800 mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCustomer.tags.map((tag: string) => (
                            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'analytics' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Purchase History</h3>
                        <div className="space-y-2">
                          {selectedCustomer.analytics.purchaseHistory.map((purchase: any) => (
                            <div key={purchase.orderId} className="bg-gray-50 p-4 rounded">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-gray-900">Order {purchase.orderId}</p>
                                  <p className="text-sm text-gray-600">
                                    {new Date(purchase.date).toLocaleDateString()}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {purchase.products.length} items • {purchase.paymentMethod}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900">${purchase.totalAmount.toFixed(2)}</p>
                                  <p className="text-sm text-gray-600">{purchase.fulfillmentStatus}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Product Interests</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedCustomer.analytics.productInterests.map((interest: any) => (
                            <div key={interest.productId} className="bg-gray-50 p-3 rounded">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-900">
                                  Product #{interest.productId}
                                </span>
                                <div className="flex items-center gap-2">
                                  <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{ width: `${interest.interestScore}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-gray-600">{interest.interestScore}%</span>
                                </div>
                              </div>
                              <div className="flex gap-2 mt-2">
                                {interest.addedToWishlist && (
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                    Wishlisted
                                  </span>
                                )}
                                {interest.purchasedBefore && (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    Purchased
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'behavior' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Behavioral Insights</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedCustomer.analytics.behavioralInsights.map((insight: any) => (
                            <div key={insight.type} className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-gray-900 capitalize">
                                  {insight.type.replace(/-/g, ' ')}
                                </h4>
                                <span className="text-lg font-bold text-purple-600">{insight.score}%</span>
                              </div>
                              <ul className="space-y-1">
                                {insight.evidence.map((evidence: string, idx: number) => (
                                  <li key={idx} className="text-sm text-gray-700">• {evidence}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Search History</h3>
                        <div className="space-y-2">
                          {selectedCustomer.analytics.searchHistory.slice(0, 5).map((search: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                              <div>
                                <p className="text-sm font-medium text-gray-900">"{search.query}"</p>
                                <p className="text-xs text-gray-600">
                                  {new Date(search.timestamp).toLocaleDateString()} • 
                                  {search.resultsCount} results • 
                                  {search.device}
                                </p>
                              </div>
                              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                {search.clickedResults.length} clicked
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'preferences' && selectedCustomer.preferences && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Communication</h3>
                        <div className="space-y-2">
                          <div>
                            <dt className="text-sm text-gray-600">Language</dt>
                            <dd className="text-sm font-medium text-gray-900 uppercase">
                              {selectedCustomer.preferences.language}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm text-gray-600 mb-1">Channels</dt>
                            <dd className="flex flex-wrap gap-1">
                              {selectedCustomer.preferences.communicationChannels.map((channel: string) => (
                                <span key={channel} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  {channel}
                                </span>
                              ))}
                            </dd>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Shopping Preferences</h3>
                        <div className="space-y-2">
                          <div>
                            <dt className="text-sm text-gray-600">Price Range</dt>
                            <dd className="text-sm font-medium text-gray-900">
                              ${selectedCustomer.preferences.priceRange.min} - 
                              ${selectedCustomer.preferences.priceRange.max}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm text-gray-600">Shipping</dt>
                            <dd className="text-sm font-medium text-gray-900 capitalize">
                              {selectedCustomer.preferences.shippingPreference}
                            </dd>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <h3 className="font-semibold text-gray-800 mb-3">Preferred Categories</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCustomer.preferences.productCategories.map((category: string) => (
                            <span key={category} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>

                      {selectedCustomer.preferences.brands.length > 0 && (
                        <div className="md:col-span-2">
                          <h3 className="font-semibold text-gray-800 mb-3">Preferred Brands</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedCustomer.preferences.brands.map((brand: string) => (
                              <span key={brand} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                                {brand}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}