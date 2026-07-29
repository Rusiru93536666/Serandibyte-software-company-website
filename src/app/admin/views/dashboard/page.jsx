"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../components/AdminLayout';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    pages: 0,
    services: 0,
    messages: 0
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/views/login');
      return;
    }

    // Get user from localStorage
    const userData = localStorage.getItem('adminUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const [pagesRes, servicesRes, messagesRes] = await Promise.all([
        fetch('/admin/routes/pages', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/admin/routes/services', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/admin/routes/messages?status=pending', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const pages = await pagesRes.json();
      const services = await servicesRes.json();
      const messages = await messagesRes.json();

      setStats({
        pages: Array.isArray(pages) ? pages.length : 0,
        services: Array.isArray(services) ? services.length : 0,
        messages: messages.total || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">Dashboard</h2>
          <p className="text-gray-400">Welcome back, {user?.username || 'Admin'}! Manage your website content from here.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10">
            <h3 className="text-gray-400 text-sm">Total Pages</h3>
            <p className="text-3xl font-bold text-white mt-2">{stats.pages}</p>
          </div>
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10">
            <h3 className="text-gray-400 text-sm">Services</h3>
            <p className="text-3xl font-bold text-white mt-2">{stats.services}</p>
          </div>
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10">
            <h3 className="text-gray-400 text-sm">Pending Messages</h3>
            <p className="text-3xl font-bold text-white mt-2">{stats.messages}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <a href="/admin/views/pages" className="block w-full text-left px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition text-white">
                Edit Homepage Content
              </a>
              <a href="/admin/views/services" className="block w-full text-left px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition text-white">
                Manage Services
              </a>
              <a href="/admin/views/messages" className="block w-full text-left px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition text-white">
                View Messages
              </a>
            </div>
          </div>
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Quick Tips</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <p>• Edit page content in the Pages section</p>
              <p>• Add or remove services in Services tab</p>
              <p>• Check and reply to messages</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}