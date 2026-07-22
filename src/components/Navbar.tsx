import { Link, useLocation } from 'react-router-dom';
import { Lock, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/collections' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-brand-celadon/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-serif font-bold text-brand-green tracking-wide">
              MAMA KAY
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-sm uppercase tracking-widest transition-colors hover:text-brand-rosy",
                  location.pathname === link.path ? "text-brand-green font-medium" : "text-brand-charcoal/80"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/admin/login" className="text-brand-charcoal/40 hover:text-brand-rosy transition-colors ml-4" title="Admin Dashboard">
              <Lock size={16} />
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-brand-charcoal">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-3 rounded-md text-base font-medium transition-colors",
                    location.pathname === link.path ? "bg-brand-celadon/10 text-brand-green" : "text-brand-charcoal hover:bg-gray-50"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                to="/admin/login" 
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3 text-brand-charcoal/60 hover:text-brand-rosy flex items-center space-x-2"
              >
                <Lock size={16} />
                <span>Admin</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
