'use client';

import { useState, useEffect } from 'react';

// Luxury watch products
const luxuryWatches = [
  {
    id: '1',
    name: 'Chronomaster Elite',
    description: 'Swiss automatic movement with moonphase complication',
    price: 8500,
    category: 'Automatic',
    image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&h=600&fit=crop',
    collection: 'Heritage',
    rating: 5,
    reviews: 12
  },
  {
    id: '2',
    name: 'Meridian Perpetual',
    description: 'Perpetual calendar with platinum case',
    price: 45000,
    category: 'Complication',
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=600&fit=crop',
    collection: 'Prestige',
    rating: 5,
    reviews: 8
  },
  {
    id: '3',
    name: 'Ocean Explorer',
    description: 'Professional dive watch, 300m water resistance',
    price: 12000,
    category: 'Sport',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&h=600&fit=crop',
    collection: 'Sport',
    rating: 4.9,
    reviews: 24
  },
  {
    id: '4',
    name: 'Classic Reserve',
    description: 'Minimalist design with 8-day power reserve',
    price: 6800,
    category: 'Dress',
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&h=600&fit=crop',
    collection: 'Classic',
    rating: 4.8,
    reviews: 31
  },
  {
    id: '5',
    name: 'Aviator Chronograph',
    description: 'Pilot watch with slide rule bezel',
    price: 9200,
    category: 'Sport',
    image: 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=600&h=600&fit=crop',
    collection: 'Heritage',
    rating: 4.7,
    reviews: 19
  },
  {
    id: '6',
    name: 'Grand Tourbillon',
    description: 'Flying tourbillon with open heart dial',
    price: 75000,
    category: 'Haute Horlogerie',
    image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600&h=600&fit=crop',
    collection: 'Prestige',
    rating: 5,
    reviews: 5
  },
  {
    id: '7',
    name: 'Racing Carbon',
    description: 'Lightweight carbon fiber case, motorsport inspired',
    price: 15500,
    category: 'Sport',
    image: 'https://images.unsplash.com/photo-1526045431048-f857369baa09?w=600&h=600&fit=crop',
    collection: 'Sport',
    rating: 4.8,
    reviews: 27
  },
  {
    id: '8',
    name: 'Platinum Dress',
    description: 'Ultra-thin profile with platinum case',
    price: 32000,
    category: 'Dress',
    image: 'https://images.unsplash.com/photo-1594534475308-b18dd0c54b70?w=600&h=600&fit=crop',
    collection: 'Prestige',
    rating: 5,
    reviews: 11
  },
  {
    id: '9',
    name: 'Heritage 1886',
    description: 'Limited edition commemorative piece',
    price: 18500,
    category: 'Limited Edition',
    image: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600&h=600&fit=crop',
    collection: 'Heritage',
    rating: 4.9,
    reviews: 15
  },
  {
    id: '10',
    name: 'Submersible Pro',
    description: 'Professional dive watch, helium escape valve',
    price: 14800,
    category: 'Sport',
    image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&h=600&fit=crop',
    collection: 'Sport',
    rating: 4.8,
    reviews: 33
  },
  {
    id: '11',
    name: 'Moonphase Master',
    description: 'Astronomical moonphase accurate for 122 years',
    price: 22500,
    category: 'Complication',
    image: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=600&h=600&fit=crop',
    collection: 'Classic',
    rating: 5,
    reviews: 9
  },
  {
    id: '12',
    name: 'Skeleton Royale',
    description: 'Full skeleton dial with hand-engraved bridges',
    price: 55000,
    category: 'Haute Horlogerie',
    image: 'https://images.unsplash.com/photo-1597228642435-66ad917302c1?w=600&h=600&fit=crop',
    collection: 'Prestige',
    rating: 5,
    reviews: 7
  },
  {
    id: '13',
    name: 'Field Explorer',
    description: 'Military-inspired with tritium lume',
    price: 7500,
    category: 'Sport',
    image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=600&h=600&fit=crop',
    collection: 'Heritage',
    rating: 4.6,
    reviews: 41
  },
  {
    id: '14',
    name: 'Regulator Classic',
    description: 'Traditional regulator dial layout',
    price: 11200,
    category: 'Classic',
    image: 'https://images.unsplash.com/photo-1509941943102-10c232535736?w=600&h=600&fit=crop',
    collection: 'Classic',
    rating: 4.7,
    reviews: 18
  },
  {
    id: '15',
    name: 'Chronometer COSC',
    description: 'COSC certified chronometer movement',
    price: 9800,
    category: 'Automatic',
    image: 'https://images.unsplash.com/photo-1595328229678-756c5e8e7b62?w=600&h=600&fit=crop',
    collection: 'Classic',
    rating: 4.8,
    reviews: 25
  },
  {
    id: '16',
    name: 'Minute Repeater',
    description: 'Chiming complication with cathedral gongs',
    price: 125000,
    category: 'Haute Horlogerie',
    image: 'https://images.unsplash.com/photo-1619134778706-7015533a6150?w=600&h=600&fit=crop',
    collection: 'Prestige',
    rating: 5,
    reviews: 3
  },
  {
    id: '17',
    name: 'GMT Navigator',
    description: 'Dual timezone with rotating bezel',
    price: 13500,
    category: 'Travel',
    image: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?w=600&h=600&fit=crop',
    collection: 'Sport',
    rating: 4.7,
    reviews: 29
  },
  {
    id: '18',
    name: 'Art Deco Square',
    description: 'Rectangular case with art deco design',
    price: 16800,
    category: 'Dress',
    image: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=600&h=600&fit=crop',
    collection: 'Heritage',
    rating: 4.9,
    reviews: 14
  },
  {
    id: '19',
    name: 'Perpetual Calendar',
    description: 'Complete calendar with leap year indicator',
    price: 68000,
    category: 'Haute Horlogerie',
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&h=600&fit=crop',
    collection: 'Prestige',
    rating: 5,
    reviews: 6
  },
  {
    id: '20',
    name: 'Urban Titanium',
    description: 'Ultralight titanium with DLC coating',
    price: 10500,
    category: 'Sport',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=600&fit=crop',
    collection: 'Modern',
    rating: 4.6,
    reviews: 38
  }
];

export default function Home() {
  const [products, setProducts] = useState<typeof luxuryWatches>([]);
  const [forYouProducts, setForYouProducts] = useState<typeof luxuryWatches>([]);
  const [loadingForYou, setLoadingForYou] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    // Fetch all products from the API
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?limit=20');
        
        if (response.ok) {
          const data = await response.json();
          // Map API products to match the local format
          const mappedProducts = data.products.map((product: any) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category || 'Luxury',
            image: product.images?.[0] || `https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&h=600&fit=crop`,
            collection: product.subcategory || 'Classic',
            rating: 5,
            reviews: Math.floor(Math.random() * 30) + 5
          }));
          setProducts(mappedProducts);
        } else {
          // Fallback to hardcoded products if API fails
          setProducts(luxuryWatches);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to hardcoded products on error
        setProducts(luxuryWatches);
      } finally {
        setLoadingProducts(false);
      }
    };

    // Fetch personalized products from the API
    const fetchForYouProducts = async () => {
      try {
        // Get userId from localStorage (set via debug banner)
        const userId = localStorage.getItem('debugCustomerId') || 'guest'; // Default to 'guest' if not set
        
        const response = await fetch('/api/products/for-you', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });
        
        if (response.ok) {
          const data = await response.json();
          // Map API products to match the local format
          const mappedProducts = data.products.map((product: any) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category || 'Luxury',
            image: product.images?.[0] || `https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&h=600&fit=crop`,
            collection: product.subcategory || 'Classic',
            rating: 5,
            reviews: Math.floor(Math.random() * 30) + 5
          }));
          setForYouProducts(mappedProducts);
        } else {
          // Fallback to first 4 products if API fails
          setForYouProducts(products.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching personalized products:', error);
        // Fallback to first 4 products on error
        setForYouProducts(products.slice(0, 4));
      } finally {
        setLoadingForYou(false);
      }
    };

    fetchProducts();
    fetchForYouProducts();

    // Listen for storage changes (when user changes customer in debug banner)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'debugCustomerId' && e.newValue) {
        fetchForYouProducts();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events in case the change happens in the same tab
    const handleCustomerChange = () => {
      fetchForYouProducts();
    };
    window.addEventListener('customerChanged', handleCustomerChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('customerChanged', handleCustomerChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-white text-2xl font-light tracking-[0.2em]">CHRONOS</h1>
            <div className="flex items-center gap-8">
              <a href="#" className="text-white/80 hover:text-white transition-colors text-sm tracking-wider">COLLECTIONS</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors text-sm tracking-wider">HERITAGE</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors text-sm tracking-wider">CONTACT</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-slow top-20 -left-48"></div>
          <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-slow animation-delay-2 bottom-20 -right-48"></div>
          <div className="absolute w-64 h-64 bg-white/5 rounded-full blur-2xl animate-float-slow animation-delay-4 top-1/2 left-1/3"></div>
        </div>
        
        {/* Watch mechanism animation */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="relative w-96 h-96">
            <div className="absolute inset-0 border border-white/30 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-4 border border-white/20 rounded-full animate-spin-reverse-slow"></div>
            <div className="absolute inset-8 border border-white/20 rounded-full animate-spin-slow"></div>
          </div>
        </div>
        
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
          <p className="text-sm tracking-[0.3em] mb-4 text-gray-300 animate-fade-in">SWISS EXCELLENCE SINCE 1886</p>
          <h1 className="text-5xl md:text-7xl font-extralight text-center mb-6 tracking-[0.1em] animate-fade-in-delay">
            TIMELESS ELEGANCE
          </h1>
          <p className="text-lg font-light text-center mb-12 max-w-2xl text-gray-300 animate-fade-in-delay-2">
            Discover our collection of exceptional timepieces
          </p>
          <button className="px-12 py-4 border border-white/50 text-white font-light tracking-[0.2em] hover:bg-white hover:text-gray-900 transition-all duration-500 animate-fade-in-delay-2 relative group overflow-hidden">
            <span className="relative z-10">EXPLORE COLLECTION</span>
            <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          </button>
        </div>
        
        {/* Scroll prompt */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center text-white/60 animate-bounce-slow">
            <p className="text-xs tracking-[0.2em] mb-2">SCROLL TO DISCOVER</p>
            <div className="w-6 h-10 border border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-scroll-down"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection - Showcase 4 premium pieces */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.3em] text-gray-500 mb-4">CURATED</p>
            <h2 className="text-4xl font-extralight tracking-[0.1em] text-gray-900">FOR YOU</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {loadingForYou ? (
              // Loading state
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-500">Loading personalized recommendations...</p>
              </div>
            ) : (
              forYouProducts.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                </div>
                <div className="py-8">
                  <p className="text-xs tracking-[0.2em] text-gray-500 mb-2">{product.collection.toUpperCase()}</p>
                  <h3 className="text-2xl font-light mb-2 text-gray-900 tracking-wide">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 font-light">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-light text-gray-900">${product.price.toLocaleString()}</span>
                    <button className="text-sm tracking-[0.2em] text-gray-700 hover:text-black transition-colors pb-1 border-b border-transparent hover:border-black">
                      DISCOVER
                    </button>
                  </div>
                </div>
              </div>
            ))
            )}
          </div>
        </div>
      </section>

      {/* Complete Collection Grid */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.3em] text-gray-500 mb-4">THE COLLECTION</p>
            <h2 className="text-4xl font-extralight tracking-[0.1em] text-gray-900">ALL TIMEPIECES</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {loadingProducts ? (
              // Loading state
              Array.from({ length: 20 }).map((_, index) => (
                <div key={index} className="group cursor-pointer animate-pulse">
                  <div className="relative overflow-hidden bg-gray-200 aspect-square"></div>
                  <div className="py-6">
                    <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-1 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))
            ) : (
              products.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden bg-white aspect-square">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    {product.price > 50000 && (
                      <div className="absolute top-4 right-4 bg-black text-white text-xs px-2 py-1 tracking-wider">
                        EXCLUSIVE
                      </div>
                    )}
                  </div>
                  <div className="py-6">
                    <p className="text-xs tracking-[0.15em] text-gray-500 mb-1">{product.category.toUpperCase()}</p>
                    <h3 className="text-lg font-light mb-1 text-gray-900">{product.name}</h3>
                    <p className="text-lg font-light text-gray-700">${product.price.toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="text-center mt-16">
            <button className="px-12 py-4 border border-gray-300 text-gray-700 font-light tracking-[0.2em] hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300">
              VIEW FULL CATALOG
            </button>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extralight tracking-[0.1em] mb-8 text-gray-900">THE ART OF WATCHMAKING</h2>
            <p className="text-lg font-light leading-relaxed text-gray-700 mb-12">
              Each timepiece is a testament to centuries of Swiss craftsmanship. Our master watchmakers combine 
              traditional techniques with innovative technology to create instruments that transcend time itself.
            </p>
            <div className="grid grid-cols-3 gap-12">
              <div>
                <div className="text-3xl font-extralight text-gray-900 mb-2">186</div>
                <p className="text-sm tracking-[0.1em] text-gray-600">YEARS OF HERITAGE</p>
              </div>
              <div>
                <div className="text-3xl font-extralight text-gray-900 mb-2">72</div>
                <p className="text-sm tracking-[0.1em] text-gray-600">HOUR POWER RESERVE</p>
              </div>
              <div>
                <div className="text-3xl font-extralight text-gray-900 mb-2">∞</div>
                <p className="text-sm tracking-[0.1em] text-gray-600">LIFETIME WARRANTY</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Showcase */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.3em] text-gray-500 mb-4">SAVOIR-FAIRE</p>
            <h2 className="text-4xl font-extralight tracking-[0.1em] text-gray-900">MASTER CRAFTSMANSHIP</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="relative aspect-[4/3] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300"></div>
              <div className="absolute inset-0 flex items-end p-8">
                <div>
                  <h3 className="text-3xl font-light text-gray-900 mb-2">Movement Assembly</h3>
                  <p className="text-gray-700 font-light">Each component hand-assembled by master horologists</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400"></div>
              <div className="absolute inset-0 flex items-end p-8">
                <div>
                  <h3 className="text-3xl font-light text-gray-900 mb-2">Case Finishing</h3>
                  <p className="text-gray-700 font-light">Mirror polishing and brushed surfaces crafted to perfection</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-lg font-light text-gray-700 max-w-3xl mx-auto">
              In our ateliers, time-honored techniques meet cutting-edge innovation. Every timepiece undergoes 
              over 500 hours of meticulous craftsmanship before earning the CHRONOS seal of excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-light tracking-[0.2em] mb-2 text-gray-900">LIFETIME SERVICE</h3>
              <p className="text-sm text-gray-600 font-light">Complimentary maintenance for life</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-sm font-light tracking-[0.2em] mb-2 text-gray-900">AUTHENTICITY</h3>
              <p className="text-sm text-gray-600 font-light">Certified Swiss movements</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-sm font-light tracking-[0.2em] mb-2 text-gray-900">WORLDWIDE DELIVERY</h3>
              <p className="text-sm text-gray-600 font-light">Secure shipping globally</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-sm font-light tracking-[0.2em] mb-2 text-gray-900">PERSONALIZATION</h3>
              <p className="text-sm text-gray-600 font-light">Bespoke engraving services</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-extralight tracking-[0.1em] mb-4">STAY INFORMED</h2>
          <p className="text-lg font-light mb-8 text-gray-400">Be the first to discover our latest collections</p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-3 bg-transparent border border-gray-700 focus:border-gray-500 focus:outline-none text-white placeholder-gray-500 font-light"
            />
            <button className="px-8 py-3 bg-white text-gray-900 font-light tracking-[0.1em] hover:bg-gray-100 transition-colors">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black text-gray-400">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-white font-light tracking-[0.2em] mb-6">CHRONOS</h3>
              <p className="text-sm font-light">Swiss luxury watchmaking since 1886</p>
            </div>
            <div>
              <h4 className="text-white font-light tracking-[0.1em] mb-4">COLLECTIONS</h4>
              <ul className="space-y-2 text-sm font-light">
                <li><a href="#" className="hover:text-white transition-colors">Sport</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Classic</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Prestige</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Limited Edition</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-light tracking-[0.1em] mb-4">SERVICES</h4>
              <ul className="space-y-2 text-sm font-light">
                <li><a href="#" className="hover:text-white transition-colors">Maintenance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Authenticity</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Personalization</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Heritage</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-light tracking-[0.1em] mb-4">CONTACT</h4>
              <ul className="space-y-2 text-sm font-light">
                <li>Bahnhofstrasse 1</li>
                <li>8001 Zürich, Switzerland</li>
                <li>+41 44 123 45 67</li>
                <li>contact@chronos.swiss</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="text-sm font-light">&copy; 2024 CHRONOS. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-15px) scale(1.02);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse-slow {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(-10px);
          }
        }

        @keyframes scroll-down {
          0% {
            opacity: 0;
            transform: translateY(-5px);
          }
          30% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(10px);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.3s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 1s ease-out 0.6s both;
        }

        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 90s linear infinite;
        }

        .animate-spin-reverse-slow {
          animation: spin-reverse-slow 120s linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-scroll-down {
          animation: scroll-down 1.5s ease-in-out infinite;
        }

        .animation-delay-2 {
          animation-delay: 2s;
        }

        .animation-delay-4 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}