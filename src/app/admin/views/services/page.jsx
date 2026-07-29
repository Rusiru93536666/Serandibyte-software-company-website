"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../components/AdminLayout';

export default function AdminServices() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/views/login');
      return;
    }

    fetchServices();
  }, [router]);

  const fetchServices = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/admin/routes/services', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (serviceData) => {
    const token = localStorage.getItem('adminToken');
    const method = editing?.id ? 'PUT' : 'POST';
    const url = editing?.id 
      ? `/admin/routes/services/${editing.id}`
      : '/admin/routes/services';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(serviceData)
      });

      if (res.ok) {
        setMessage('✅ Service saved successfully!');
        setEditing(null);
        fetchServices();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const error = await res.json();
        setMessage(`❌ Error: ${error.message}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/admin/routes/services/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setMessage('✅ Service deleted successfully!');
        fetchServices();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const error = await res.json();
        setMessage(`❌ Error: ${error.message}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Services</h1>
            <p className="text-gray-400 mt-1">Manage your services</p>
          </div>
          <button
            onClick={() => setEditing({})}
            className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition"
          >
            + Add New Service
          </button>
        </div>

        {message && (
          <div className={`mb-4 px-4 py-3 rounded-lg ${
            message.includes('✅') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {message}
          </div>
        )}

        {/* Service List */}
        {services.length === 0 ? (
          <div className="bg-[#1a1a1a] p-8 rounded-xl border border-white/10 text-center text-gray-400">
            No services found. Click "Add New Service" to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 hover:border-white/20 transition">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{service.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(service)}
                      className="px-3 py-1 text-sm bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-2 line-clamp-2">{service.description}</p>
                <div className="flex gap-2 text-xs">
                  <span className={`px-2 py-1 rounded ${
                    service.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {service.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="px-2 py-1 bg-white/10 text-gray-400 rounded">
                    Order: {service.display_order}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit/Create Modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] p-8 rounded-xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editing.id ? 'Edit Service' : 'Create New Service'}
              </h2>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSave({
                  title: formData.get('title'),
                  description: formData.get('description'),
                  icon: formData.get('icon'),
                  image: formData.get('image'),
                  details: formData.get('details'),
                  is_active: formData.get('is_active') === 'true',
                  display_order: parseInt(formData.get('display_order')) || 0
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Title *</label>
                    <input
                      name="title"
                      type="text"
                      defaultValue={editing.title || ''}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Description</label>
                    <textarea
                      name="description"
                      rows={3}
                      defaultValue={editing.description || ''}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Icon (Lucide icon name)</label>
                    <input
                      name="icon"
                      type="text"
                      defaultValue={editing.icon || 'Rocket'}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Image URL</label>
                    <input
                      name="image"
                      type="text"
                      defaultValue={editing.image || '/test.png'}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Details</label>
                    <textarea
                      name="details"
                      rows={2}
                      defaultValue={editing.details || ''}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Active</label>
                      <select
                        name="is_active"
                        defaultValue={editing.is_active !== undefined ? String(editing.is_active) : 'true'}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Display Order</label>
                      <input
                        name="display_order"
                        type="number"
                        defaultValue={editing.display_order || 0}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition"
                    >
                      Save Service
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                      className="flex-1 px-4 py-3 border border-white/20 text-white font-bold rounded-lg hover:bg-white/10 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}