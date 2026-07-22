import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingBag, Box, Footprints, Shirt } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalShoes: 0,
    totalBags: 0,
    totalClothes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [token]);

  const cards = [
    { title: 'Total Products', value: stats.totalProducts, icon: Box, color: 'bg-blue-50 text-blue-600' },
    { title: 'Total Shoes', value: stats.totalShoes, icon: Footprints, color: 'bg-emerald-50 text-emerald-600' },
    { title: 'Total Bags', value: stats.totalBags, icon: ShoppingBag, color: 'bg-rose-50 text-rose-600' },
    { title: 'Total Clothes', value: stats.totalClothes, icon: Shirt, color: 'bg-purple-50 text-purple-600' }
  ];

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif text-brand-charcoal font-bold mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div 
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mr-4 ${card.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                <h3 className="text-3xl font-serif font-bold text-gray-900">{card.value}</h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px] flex items-center justify-center">
         <div className="text-center">
            <h3 className="text-xl font-medium text-gray-400 mb-2">Order/Inquiry Management</h3>
            <p className="text-sm text-gray-400">Ready for future integration</p>
         </div>
      </div>
    </div>
  );
}
