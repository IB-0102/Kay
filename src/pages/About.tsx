import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function About() {
  const [content, setContent] = useState({
    about_us: '',
    vision: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        setContent({
          about_us: data.about_us || '',
          vision: data.vision || ''
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch content:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-brand-bg">
        <Loader2 className="w-10 h-10 animate-spin text-brand-green" />
      </div>
    );
  }

  return (
    <div className="py-20 bg-brand-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif text-brand-charcoal mb-6">About MAMA KAY</h1>
          <div className="w-24 h-1 bg-brand-celadon mx-auto rounded-full"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-brand-celadon/20 mb-12 prose prose-lg prose-p:text-brand-charcoal/80 max-w-none"
        >
          <p className="text-xl font-medium text-brand-green mb-6">Welcome to MAMA KAY.</p>
          {content.about_us.split('\n').map((paragraph, idx) => (
            paragraph.trim() ? <p key={idx}>{paragraph}</p> : <br key={idx} />
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-brand-charcoal text-white p-8 md:p-12 rounded-3xl shadow-xl text-center"
        >
          <h2 className="text-3xl font-serif text-brand-celadon mb-6">Our Vision</h2>
          {content.vision.split('\n').map((paragraph, idx) => (
             paragraph.trim() ? <p key={idx} className="text-lg text-gray-300 leading-relaxed mb-4">{paragraph}</p> : null
          ))}
        </motion.div>

      </div>
    </div>
  );
}
