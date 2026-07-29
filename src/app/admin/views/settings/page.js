"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../components/AdminLayout';

// Every field here maps 1:1 to a `setting_key` row in the `settings` table.
// Add a new field here + it will be created in the DB on first save.
const FIELDS = [
  { key: 'contact_website', label: 'Contact Section — Website label', group: 'contact' },
  { key: 'contact_phone', label: 'Contact Section — Phone', group: 'contact' },
  { key: 'contact_email', label: 'Contact Section — Email', group: 'contact' },
  { key: 'footer_phone', label: 'Footer — Phone', group: 'contact' },
  { key: 'footer_email', label: 'Footer — Email / Website', group: 'contact' },
  { key: 'footer_description', label: 'Footer — Description', group: 'general', textarea: true },
  { key: 'footer_copyright', label: 'Footer — Copyright line', group: 'general' },
  { key: 'social_instagram', label: 'Instagram URL', group: 'social' },
  { key: 'social_facebook', label: 'Facebook URL', group: 'social' },
];

export default function AdminSettings() {
  const router = useRouter();
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/views/login');
      return;
    }
    fetchSettings();
  }, [router]);

  const fetchSettings = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/admin/routes/settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setValues(data || {});
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const token = localStorage.getItem('adminToken');

    // Group fields by their `group` so each PUT call updates the right rows.
    const groups = {};
    FIELDS.forEach(({ key, group }) => {
      groups[group] = groups[group] || {};
      groups[group][key] = values[key] ?? '';
    });

    try {
      await Promise.all(
        Object.entries(groups).map(([group, settings]) =>
          fetch(`/admin/routes/settings?group=${group}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ settings })
          })
        )
      );
      setMessage('✅ Settings saved successfully! Changes are now live on the site.');
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-white">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8 max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Site Settings</h1>
            <p className="text-gray-400 mt-1">
              Controls the Contact section and Footer on the public site.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {message && (
          <div className={`mb-6 px-4 py-3 rounded-lg ${
            message.includes('✅') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 space-y-5">
          {FIELDS.map(({ key, label, textarea }) => (
            <div key={key}>
              <label className="block text-gray-300 mb-2 text-sm">{label}</label>
              {textarea ? (
                <textarea
                  rows={3}
                  value={values[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={values[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
