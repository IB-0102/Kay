import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-charcoal text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-serif font-bold text-brand-celadon mb-6">MAMA KAY</h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Discover premium shoes, bags, and clothing designed for women who appreciate elegance, quality, and timeless beauty.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/1AHaUYU6N6/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-rosy transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://wa.me/2348064292639" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-rosy transition-colors">
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-serif mb-6 text-brand-celadon-light">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm">Home</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">Contact</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors text-sm">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-serif mb-6 text-brand-celadon-light">Contact Information</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="text-brand-rosy mt-1 mr-3 shrink-0" size={18} />
                <span className="text-gray-300 text-sm">MAMA KAY Luxury Boutique<br />Imo State, Nigeria</span>
              </li>
              <li className="flex items-center">
                <Phone className="text-brand-rosy mr-3 shrink-0" size={18} />
                <span className="text-gray-300 text-sm">08064292639</span>
              </li>
              <li className="flex items-center">
                <Mail className="text-brand-rosy mr-3 shrink-0" size={18} />
                <span className="text-gray-300 text-sm">adjim1990@gmail.com</span>
              </li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-xs mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} MAMA KAY. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
