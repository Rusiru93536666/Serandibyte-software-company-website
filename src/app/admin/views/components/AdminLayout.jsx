"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Layout, FileText, Settings, MessageSquare, LogOut, Home, Sliders } from 'lucide-react';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      router.replace('/admin/views/login');
      return;
    }

    // Verify token with backend
    fetch('/admin/routes/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          setLoading(false);
        } else {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          router.replace('/admin/views/login');
        }
      })
      .catch(() => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.replace('/admin/views/login');
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/views/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#151515] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isActive = (path) => {
    return pathname === path ? 'bg-white/20' : 'hover:bg-white/10';
  };

  return (
    <div className="min-h-screen bg-[#151515] text-white">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-[#1a1a1a] border-r border-white/10 p-6 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">SerandiByte</h1>
          <p className="text-sm text-gray-400">Admin Panel</p>
          <p className="text-xs text-gray-500 mt-1">Welcome, {user.username}</p>
        </div>

        <nav className="space-y-2">
          <a
            href="/admin/views/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition text-white ${isActive('/admin/views/dashboard')}`}
          >
            <Layout size={20} />
            Dashboard
          </a>
          <a
            href="/admin/views/pages"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition text-white ${isActive('/admin/views/pages')}`}
          >
            <FileText size={20} />
            Pages
          </a>
          <a
            href="/admin/views/services"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition text-white ${isActive('/admin/views/services')}`}
          >
            <Settings size={20} />
            Services
          </a>
          <a
            href="/admin/views/messages"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition text-white ${isActive('/admin/views/messages')}`}
          >
            <MessageSquare size={20} />
            Messages
          </a>
          <a
            href="/admin/views/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition text-white ${isActive('/admin/views/settings')}`}
          >
            <Sliders size={20} />
            Site Settings
          </a>
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-white"
          >
            <Home size={20} />
            View Site
          </a>
        </nav>

        <button
          onClick={handleLogout}
          className="absolute bottom-6 left-6 right-6 flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {children}
      </div>
    </div>
  );
}
