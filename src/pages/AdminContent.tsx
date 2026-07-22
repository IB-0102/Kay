import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Save, Loader2, Check } from 'lucide-react';

export default function AdminContent() {
  const { token } = useAuth();
  const [aboutUs, setAboutUs] = useState('');
  const [vision, setVision] = useState('');
  const [privacyPolicy, setPrivacyPolicy] = useState('');
  const [termsConditions, setTermsConditions] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        setAboutUs(data.about_us || '');
        setVision(data.vision || '');
        setPrivacyPolicy(data.privacy_policy || '');
        setTermsConditions(data.terms_conditions || '');
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch content:', err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          about_us: aboutUs, 
          vision: vision,
          privacy_policy: privacyPolicy,
          terms_conditions: termsConditions
        })
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update content', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Page Content</h1>
        <p className="text-gray-500 mt-1">Manage the content displayed on your website's About and Vision pages.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            About Us Content
          </label>
          <textarea
            value={aboutUs}
            onChange={(e) => setAboutUs(e.target.value)}
            rows={10}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent resize-y"
            placeholder="Write about your brand history and mission here..."
          />
          <p className="text-sm text-gray-500 mt-2">This content will be displayed on the About Us page.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Our Vision
          </label>
          <textarea
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent resize-y"
            placeholder="Write about your brand's vision and future goals..."
          />
          <p className="text-sm text-gray-500 mt-2">This content will be displayed below the About Us section.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Privacy Policy
          </label>
          <textarea
            value={privacyPolicy}
            onChange={(e) => setPrivacyPolicy(e.target.value)}
            rows={10}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent resize-y"
            placeholder="Write your Privacy Policy here..."
          />
          <p className="text-sm text-gray-500 mt-2">This content will be displayed on the Privacy Policy page.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Terms & Conditions
          </label>
          <textarea
            value={termsConditions}
            onChange={(e) => setTermsConditions(e.target.value)}
            rows={10}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent resize-y"
            placeholder="Write your Terms and Conditions here..."
          />
          <p className="text-sm text-gray-500 mt-2">This content will be displayed on the Terms & Conditions page.</p>
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-gray-100">
          {saveSuccess && (
            <span className="flex items-center text-brand-green mr-4 text-sm font-medium">
              <Check size={16} className="mr-1" />
              Saved successfully
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-6 py-3 bg-brand-green text-white rounded-lg font-medium hover:bg-brand-charcoal transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            Save Content
          </button>
        </div>
      </form>
    </div>
  );
}
