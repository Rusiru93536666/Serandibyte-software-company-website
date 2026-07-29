"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../components/AdminLayout';

export default function AdminPages() {
  const router = useRouter();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState(null);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/views/login');
      return;
    }

    fetchPages();
  }, [router]);

  const fetchPages = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/admin/routes/pages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setPages(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPage = async (pageName) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/admin/routes/pages/${pageName}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setSelectedPage(data);
      setContent(JSON.stringify(data.content_json, null, 2));
      setMessage('');
    } catch (error) {
      console.error('Error loading page:', error);
      setMessage('❌ Error loading page');
    }
  };

  const savePage = async () => {
    if (!selectedPage) return;
    
    setSaving(true);
    setMessage('');
    const token = localStorage.getItem('adminToken');
    try {
      // Validate JSON
      JSON.parse(content);
      
      const res = await fetch(`/admin/routes/pages/${selectedPage.page_name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content_json: JSON.parse(content) })
      });
      
      if (res.ok) {
        setMessage('✅ Page saved successfully!');
        await fetchPages();
      } else {
        const error = await res.json();
        setMessage(`❌ Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error saving page:', error);
      setMessage('❌ Invalid JSON format. Please check your syntax.');
    } finally {
      setSaving(false);
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
      <div className="p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Page Editor</h1>

        {message && (
          <div className={`mb-4 px-4 py-3 rounded-lg ${
            message.includes('✅') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Page List */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Pages</h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {pages.length === 0 ? (
                  <p className="text-gray-400 text-sm">No pages found</p>
                ) : (
                  pages.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => loadPage(page.page_name)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition ${
                        selectedPage?.page_name === page.page_name
                          ? 'bg-white/20 text-white'
                          : 'hover:bg-white/10 text-gray-400'
                      }`}
                    >
                      <div className="font-medium capitalize">{page.page_name}</div>
                      <div className="text-xs text-gray-500">
                        Updated: {new Date(page.updated_at).toLocaleDateString()}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="lg:col-span-3">
            {selectedPage ? (
              <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white capitalize">
                    Editing: {selectedPage.page_name}
                  </h3>
                  <button
                    onClick={savePage}
                    disabled={saving}
                    className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Page'}
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Content (JSON)</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-[500px] px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-white/30 resize-none"
                    spellCheck={false}
                  />
                </div>

                <div className="text-xs text-gray-500">
                  💡 Tip: Edit the JSON content carefully. Invalid JSON will cause errors.
                </div>
              </div>
            ) : (
              <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 text-center text-gray-400">
                Select a page from the left to start editing
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}