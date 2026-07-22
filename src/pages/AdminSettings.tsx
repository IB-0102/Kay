import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { KeyRound, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminSettings() {
  const { token } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ newPassword })
      });

      if (res.ok) {
        setMessage('Password updated successfully');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update password');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-serif text-brand-charcoal font-bold mb-8">Admin Settings</h1>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mr-4">
            <KeyRound size={24} />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-brand-charcoal">Change Password</h2>
            <p className="text-sm text-gray-500">Update your administrator password</p>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                {error}
              </div>
            </motion.div>
          )}
          {message && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
              <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm flex items-center">
                <CheckCircle2 size={18} className="mr-2" />
                {message}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">New Password</label>
            <input 
              type="password" 
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">Confirm New Password</label>
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-brand-charcoal hover:bg-brand-green text-white font-medium px-6 py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-6">
          <h2 className="text-lg font-serif font-bold text-brand-charcoal mb-4">Business Information</h2>
          <p className="text-sm text-gray-500 mb-6">Business information settings are managed via the code configuration currently.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
             <div>
                <span className="font-medium">Business Name:</span> MAMA KAY
             </div>
             <div>
                <span className="font-medium">Email:</span> adjim1990@gmail.com
             </div>
             <div>
                <span className="font-medium">Phone:</span> 08064292639
             </div>
          </div>
      </div>
    </div>
  );
}
