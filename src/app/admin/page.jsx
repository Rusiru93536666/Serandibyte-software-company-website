"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // If already logged in, go to dashboard
      router.replace('/admin/views/dashboard');
    } else {
      // Otherwise go to login
      router.replace('/admin/views/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#151515] flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );
}