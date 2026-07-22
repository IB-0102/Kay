import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-react';

export default function Contact() {
  return (
    <div className="py-20 bg-brand-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif text-brand-charcoal mb-6">Contact Us</h1>
          <div className="w-24 h-1 bg-brand-celadon mx-auto rounded-full"></div>
          <p className="mt-6 text-brand-charcoal/60 text-lg max-w-2xl mx-auto">
            We'd love to hear from you. Reach out to us for inquiries, orders, or styling advice.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
          >
            <h2 className="text-2xl font-serif text-brand-charcoal mb-8">Send us a Message</h2>
            <form className="space-y-6" action="https://formsubmit.co/adjim1990@gmail.com" method="POST">
              <input type="hidden" name="_subject" value="New Contact Form Submission from MAMA KAY" />
              <input type="hidden" name="_captcha" value="false" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-2">Full Name</label>
                  <input type="text" name="name" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-celadon" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-2">Email Address</label>
                  <input type="email" name="email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-celadon" placeholder="jane@example.com" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-2">Phone Number</label>
                  <input type="tel" name="phone" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-celadon" placeholder="08064292639" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-2">Subject</label>
                  <input type="text" name="subject" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-celadon" placeholder="Order Inquiry" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-2">Message</label>
                <textarea name="message" required rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-celadon resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className="w-full bg-brand-charcoal hover:bg-brand-green text-white font-medium px-8 py-4 rounded-xl transition-colors">
                Send Message
              </button>
            </form>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="bg-brand-green text-white p-8 rounded-3xl shadow-xl">
              <h2 className="text-2xl font-serif text-brand-celadon mb-8">Business Information</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="text-brand-rosy mt-1 mr-4 shrink-0" size={24} />
                  <div>
                    <h3 className="font-medium text-lg mb-1">MAMA KAY Boutique</h3>
                    <p className="text-gray-300">Imo State, Nigeria</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="text-brand-rosy mr-4 shrink-0" size={24} />
                  <div>
                    <h3 className="font-medium text-lg mb-1">Phone</h3>
                    <p className="text-gray-300">08064292639</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="text-brand-rosy mr-4 shrink-0" size={24} />
                  <div>
                    <h3 className="font-medium text-lg mb-1">Email</h3>
                    <a href="mailto:adjim1990@gmail.com" className="text-gray-300 hover:text-white hover:underline transition-colors">adjim1990@gmail.com</a>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/20">
                <h3 className="font-medium text-lg mb-4 text-brand-celadon-light">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a href="https://www.facebook.com/share/1AHaUYU6N6/" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-rosy transition-colors">
                    <Facebook size={20} />
                  </a>
                  <a href="https://wa.me/2348064292639" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-rosy transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gray-200 h-64 rounded-3xl w-full flex items-center justify-center relative overflow-hidden">
              <span className="text-gray-500 font-medium">Interactive Google Map Placeholder</span>
              <div className="absolute inset-0 bg-brand-charcoal/5 mix-blend-multiply"></div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
