import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function Privacy() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        setContent(data.privacy_policy || '');
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
    <div className="pt-24 pb-20 bg-brand-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 prose prose-lg prose-p:text-gray-600 prose-headings:text-brand-charcoal prose-headings:font-serif max-w-none"
        >
          <h1 className="text-4xl mb-8">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: July 2026</p>

          <div className="whitespace-pre-line">
            {content}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
