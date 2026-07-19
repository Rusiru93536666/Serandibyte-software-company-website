'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Edit, Save, X, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const initialPage = searchParams.get('page') || 'home';
  
  const [pages] = useState(['home', 'about', 'services', 'contact']);
  const [selectedPage, setSelectedPage] = useState(initialPage);
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [editType, setEditType] = useState<'text' | 'textarea' | 'image'>('text');
  const [previewImage, setPreviewImage] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/verify');
        const data = await response.json();
        if (!data.authenticated) {
          router.push('/admin');
        }
      } catch {
        router.push('/admin');
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/content/${selectedPage}`);
        const data = await response.json();
        if (data.success) {
          setContent(data.data || {});
        } else {
          setContent({});
        }
      } catch (error) {
        console.error('Failed to load content:', error);
        setContent({});
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, [selectedPage]);

  const handleSaveField = async (path: string, value: any) => {
    if (!content) return;
    
    const updatedContent = JSON.parse(JSON.stringify(content));
    const pathParts = path.split('.');
    let current = updatedContent;
    
    for (let i = 0; i < pathParts.length - 1; i++) {
      if (!current[pathParts[i]]) {
        current[pathParts[i]] = {};
      }
      current = current[pathParts[i]];
    }
    current[pathParts[pathParts.length - 1]] = value;

    try {
      setSaving(true);
      const response = await fetch(`/api/content/${selectedPage}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContent),
      });

      const data = await response.json();
      if (data.success) {
        setContent(updatedContent);
        setMessage({ type: 'success', text: 'Content saved successfully!' });
        setTimeout(() => setMessage(null), 3000);
        setEditingPath(null);
        return true;
      } else {
        setMessage({ type: 'error', text: 'Failed to save content' });
        return false;
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save content' });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = async (path: string, template: any = {}) => {
    const updatedContent = JSON.parse(JSON.stringify(content));
    const pathParts = path.split('.');
    let current = updatedContent;
    
    for (let i = 0; i < pathParts.length - 1; i++) {
      if (!current[pathParts[i]]) {
        current[pathParts[i]] = {};
      }
      current = current[pathParts[i]];
    }
    
    const key = pathParts[pathParts.length - 1];
    if (!current[key]) {
      current[key] = [];
    }
    current[key].push(template);
    
    await handleSaveField(path, current[key]);
  };

  const handleDeleteItem = async (path: string, index: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    const updatedContent = JSON.parse(JSON.stringify(content));
    const pathParts = path.split('.');
    let current = updatedContent;
    
    for (let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]];
    }
    
    const key = pathParts[pathParts.length - 1];
    current[key].splice(index, 1);
    
    await handleSaveField(path, current[key]);
  };

  const handleUploadImage = async (file: File, path: string) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setSaving(true);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        await handleSaveField(path, data.data.url);
        setMessage({ type: 'success', text: 'Image uploaded successfully!' });
        setTimeout(() => setMessage(null), 3000);
        setEditingPath(null);
      } else {
        setMessage({ type: 'error', text: 'Failed to upload image' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload image' });
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (path: string, value: any, type: 'text' | 'textarea' | 'image' = 'text') => {
    setEditingPath(path);
    setEditType(type);
    if (typeof value === 'string') {
      setEditValue(value);
      setPreviewImage(value);
    } else {
      setEditValue(JSON.stringify(value));
    }
  };

  const cancelEditing = () => {
    setEditingPath(null);
    setEditValue('');
    setPreviewImage('');
  };

  const renderEditableField = (data: any, path: string = '') => {
    if (data === null || data === undefined) return null;

    const isEditing = editingPath === path;
    const isImage = typeof data === 'string' && (data.startsWith('/uploads/') || data.startsWith('http'));

    if (typeof data === 'string') {
      return (
        <div className="group relative p-2 rounded-lg hover:bg-white/5 transition-colors">
          {isEditing ? (
            <div className="space-y-2">
              {editType === 'image' ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadImage(file, path);
                      }}
                      className="flex-1 text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-black hover:file:bg-cyan-400"
                    />
                    <button
                      onClick={cancelEditing}
                      className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {previewImage && (
                    <img src={previewImage} alt="Preview" className="max-h-32 rounded-lg object-cover" />
                  )}
                </div>
              ) : editType === 'textarea' ? (
                <div className="space-y-2">
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-white/10 text-white min-h-[100px]"
                    placeholder="Enter content..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveField(path, editValue)}
                      disabled={saving}
                      className="flex-1 px-4 py-2 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-white/10 text-white"
                    placeholder="Enter text..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveField(path, editValue)}
                      disabled={saving}
                      className="flex-1 px-4 py-2 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {isImage ? (
                <div className="flex-1">
                  <img src={data} alt={path} className="max-h-20 rounded-lg object-contain" />
                </div>
              ) : (
                <p className="flex-1 text-slate-300">{data || <span className="text-slate-500 italic">Empty</span>}</p>
              )}
              <button
                onClick={() => startEditing(path, data, isImage ? 'image' : data.length > 100 ? 'textarea' : 'text')}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-cyan-500/20 text-cyan-400 transition-opacity"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      );
    }

    if (Array.isArray(data)) {
      return (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="border border-white/10 rounded-lg p-4 relative group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1">
                <button
                  onClick={() => handleDeleteItem(path, index)}
                  className="p-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-2">
                {Object.entries(item).map(([key, value]) => {
                  // Skip empty keys or show them as editable
                  if (key === 'id' || key === '_id') return null;
                  return (
                    <div key={key}>
                      <label className="text-xs text-slate-400 uppercase tracking-wider">{key}</label>
                      {renderEditableField(value, `${path}[${index}].${key}`)}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
          {/* Add Item Button */}
          <button
            onClick={() => {
              const pathParts = path.split('.');
              const lastKey = pathParts[pathParts.length - 1];
              const template = lastKey === 'services' 
                ? { title: 'New Service', description: 'Service description', details: 'Technologies • Tools', image: '/software.png' }
                : {};
              handleAddItem(path, template);
            }}
            className="w-full p-4 border-2 border-dashed border-white/10 rounded-lg hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      );
    }

    if (typeof data === 'object' && data !== null) {
      return (
        <div className="space-y-2">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="ml-4">
              <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{key}</label>
              {renderEditableField(value, path ? `${path}.${key}` : key)}
            </div>
          ))}
        </div>
      );
    }

    return <span className="text-slate-500">{String(data)}</span>;
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  };

  const handlePageChange = (page: string) => {
    setSelectedPage(page);
    setEditingPath(null);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('page', page);
    window.history.pushState({}, '', url.toString());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 min-h-screen p-4 border-r border-white/10 flex flex-col">
        <h2 className="text-2xl font-bold text-cyan-400 mb-8">Admin Panel</h2>
        
        <div className="flex-1">
          <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Pages</label>
          <nav className="space-y-1">
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  selectedPage === page 
                    ? 'bg-cyan-500 text-black font-semibold' 
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 overflow-y-auto max-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-cyan-400">
            Edit {selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)}
          </h1>
          {saving && <span className="text-slate-400">Saving...</span>}
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'success' 
              ? 'bg-green-500/20 border border-green-500 text-green-400' 
              : 'bg-red-500/20 border border-red-500 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-slate-900/50 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Content Editor</h3>
              {editingPath && (
                <span className="text-xs text-slate-400">Editing: {editingPath}</span>
              )}
            </div>
            {renderEditableField(content)}
          </div>

          <div className="bg-slate-900/50 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Tips</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• Hover over any text or image to see the edit button</li>
              <li>• Click the edit button to modify content</li>
              <li>• For images, you can upload new images directly</li>
              <li>• For lists (like services), you can add or remove items</li>
              <li>• All changes are saved to the database instantly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}