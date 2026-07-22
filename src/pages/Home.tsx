import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Star, ShieldCheck, Diamond, Heart, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';

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

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Just take the first 3 products to show on the homepage, or filter by isFeatured
          const top = data.slice(0, 3);
          setFeaturedProducts(top);
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

  const features = [
    { icon: Diamond, title: 'Premium Quality', desc: 'Only the finest materials.' },
    { icon: Star, title: 'Elegant Designs', desc: 'Timeless and sophisticated.' },
    { icon: ShieldCheck, title: 'Trusted Brand', desc: 'Nigeria\'s premier luxury choice.' },
    { icon: Heart, title: 'Excellent Service', desc: 'We care about your experience.' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-brand-bg overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-brand-celadon/10 flex items-center justify-center">
            <span className="text-brand-charcoal/20 font-serif text-2xl tracking-widest uppercase">Hero Image Placeholder</span>
          </div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto backdrop-blur-sm bg-white/30 p-6 md:p-12 rounded-3xl border border-white/50 shadow-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-serif text-brand-charcoal mb-6 leading-tight"
          >
            Luxury Fashion That <br/><span className="text-brand-green italic">Defines Your Style</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-brand-charcoal/80 mb-10 max-w-2xl mx-auto"
          >
            Discover premium shoes, bags, and clothing designed for women who appreciate elegance, quality, and timeless beauty.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/collections" className="bg-brand-celadon hover:bg-brand-rosy hover:text-white text-brand-charcoal px-8 py-4 rounded-full font-display font-medium tracking-wide transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl w-full sm:w-auto">
              Shop Collections <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/contact" className="bg-transparent border border-brand-charcoal hover:border-brand-rosy hover:text-brand-rosy text-brand-charcoal px-8 py-4 rounded-full font-display font-medium tracking-wide transition-all duration-300 w-full sm:w-auto text-center">
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Collection Preview */}
      <section id="collection" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-brand-charcoal mb-4">Luxury Collection</h2>
            <div className="w-24 h-1 bg-brand-celadon mx-auto rounded-full"></div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="w-10 h-10 border-4 border-brand-celadon border-t-brand-green rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {featuredProducts.map((product, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2, duration: 0.6 }}
                  key={product.id} 
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group flex flex-col h-full border border-gray-100"
                >
                  <div className="relative h-80 overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <ShoppingBag className="w-12 h-12 text-gray-300" />
                    )}
                    <div className="absolute inset-0 bg-brand-charcoal/0 group-hover:bg-brand-charcoal/10 transition-colors duration-500"></div>
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
                    <h3 className="text-xl font-serif text-brand-charcoal mb-2 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-grow">{product.description}</p>
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-auto">
                      <span className="text-xl font-medium text-brand-charcoal">
                        ₦{product.price.toLocaleString()}
                      </span>
                      <a 
                        href={`https://wa.me/2348064292639?text=Hello MAMA KAY, I am interested in ordering the ${encodeURIComponent(product.name)} (₦${product.price.toLocaleString()}).`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-brand-charcoal hover:bg-brand-green text-white text-sm px-5 py-2.5 rounded-full font-medium transition-colors whitespace-nowrap"
                      >
                        Order Now
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link to="/collections" className="inline-flex items-center text-brand-green font-medium hover:text-brand-rosy transition-colors">
              View All Collections <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-brand-bg border-y border-brand-celadon/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-brand-charcoal mb-4">Why Choose MAMA KAY</h2>
            <div className="w-24 h-1 bg-brand-celadon mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-brand-celadon/20 rounded-full flex items-center justify-center mb-6 text-brand-green">
                    <Icon size={24} />
                  </div>
                  <h4 className="text-xl font-serif text-brand-charcoal mb-3">{feat.title}</h4>
                  <p className="text-brand-charcoal/60">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-brand-charcoal mb-16">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="bg-brand-bg p-8 rounded-2xl flex flex-col h-full">
              <div className="flex justify-center text-brand-rosy mb-4">
                {[...Array(5)].map((_, idx) => <Star key={idx} size={16} fill="currentColor" />)}
              </div>
              <p className="text-brand-charcoal/80 italic mb-6 flex-grow">"The quality of the bags I ordered from MAMA KAY is simply unmatched. The attention to detail and customer service is phenomenal. Highly recommended!"</p>
              <div>
                <h5 className="font-serif font-bold text-brand-charcoal">Aisha B.</h5>
                <span className="text-sm text-gray-500">Port Harcourt, Nigeria</span>
              </div>
            </div>
            
            {/* Review 2 */}
            <div className="bg-brand-bg p-8 rounded-2xl flex flex-col h-full">
              <div className="flex justify-center text-brand-rosy mb-4">
                {[...Array(5)].map((_, idx) => <Star key={idx} size={16} fill="currentColor" />)}
              </div>
              <p className="text-brand-charcoal/80 italic mb-6 flex-grow">"I wore their luxury shoes to a wedding last weekend and received so many compliments. MAMA KAY truly understands elegance and comfort."</p>
              <div>
                <h5 className="font-serif font-bold text-brand-charcoal">Chika O.</h5>
                <span className="text-sm text-gray-500">Lagos, Nigeria</span>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-brand-bg p-8 rounded-2xl flex flex-col h-full">
              <div className="flex justify-center text-brand-rosy mb-4">
                {[...Array(5)].map((_, idx) => <Star key={idx} size={16} fill="currentColor" />)}
              </div>
              <p className="text-brand-charcoal/80 italic mb-6 flex-grow">"Fast delivery and premium packaging. The dress I bought fits perfectly and looks even better in person. I will definitely be shopping here again."</p>
              <div>
                <h5 className="font-serif font-bold text-brand-charcoal">Folake A.</h5>
                <span className="text-sm text-gray-500">Ibadan, Nigeria</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Newsletter */}
      <section className="py-24 bg-brand-green text-white text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">Elevate Your Style Today.</h2>
          <p className="text-brand-celadon-light mb-10 text-lg">Join our newsletter to receive exclusive updates on new collections and private sales.</p>
          <form action="https://formsubmit.co/adjim1990@gmail.com" method="POST" className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <input type="hidden" name="_subject" value="New Newsletter Subscription for MAMA KAY" />
            <input type="hidden" name="_captcha" value="false" />
            <input 
              type="email" 
              name="email"
              required
              placeholder="Your email address" 
              className="px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-brand-celadon w-full"
            />
            <button type="submit" className="bg-brand-celadon hover:bg-brand-rosy text-brand-charcoal font-medium px-8 py-4 rounded-full transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
