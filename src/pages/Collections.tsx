import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Search } from 'lucide-react';
import { cn } from '../lib/utils';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
}

export default function Collections() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Expected array, got:', data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products', err);
        setLoading(false);
      });
  }, []);

  const categories = ['All', 'Shoes', 'Bags', 'Clothes'];

  const filteredProducts = products.filter(p => {
    const matchesCategory = filter === 'All' || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-20 pb-24 bg-brand-bg min-h-screen">
      {/* Header */}
      <div className="bg-brand-charcoal text-white py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif mb-6"
          >
            Our Collections
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-brand-celadon-light max-w-2xl mx-auto text-lg"
          >
            Explore our carefully curated selection of premium shoes, handbags, and clothing.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex space-x-2 overflow-x-auto pb-2 w-full md:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                  filter === cat 
                    ? "bg-brand-green text-white" 
                    : "bg-white text-brand-charcoal hover:bg-brand-celadon/20"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search collections..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green bg-white"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-brand-celadon border-t-brand-green rounded-full animate-spin"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group flex flex-col h-full border border-gray-100"
              >
                <div className="relative h-64 overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <ShoppingBag className="w-12 h-12 text-gray-300" />
                  )}
                  {!product.isAvailable && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-brand-charcoal text-white px-4 py-2 rounded-full text-sm font-medium tracking-wide">
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-xs font-medium text-brand-green uppercase tracking-wider mb-2">
                    {product.category}
                  </div>
                  <h3 className="text-lg font-serif font-medium text-brand-charcoal mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
                    {product.description}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-auto">
                    <span className="text-xl font-medium text-brand-charcoal">
                      ₦{product.price.toLocaleString()}
                    </span>
                    <a 
                      href={`https://wa.me/2348064292639?text=Hello MAMA KAY, I am interested in ordering the ${encodeURIComponent(product.name)} (₦${product.price.toLocaleString()}).`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-brand-green hover:text-brand-rosy transition-colors flex items-center gap-1 whitespace-nowrap"
                    >
                      Order Now
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-brand-charcoal mb-2">No items found</h3>
            <p className="text-gray-500">We couldn't find any items matching your criteria.</p>
            <button 
              onClick={() => { setFilter('All'); setSearch(''); }}
              className="mt-6 text-brand-green font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
