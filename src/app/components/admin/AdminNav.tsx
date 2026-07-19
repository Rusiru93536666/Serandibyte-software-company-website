'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNav() {
  const pathname = usePathname();
  const pages = ['home', 'about', 'services', 'contact'];

  return (
    <nav className="bg-slate-900 border-b border-white/10 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="text-cyan-400 font-bold">
            Admin Panel
          </Link>
          <div className="flex gap-2">
            {pages.map((page) => (
              <Link
                key={page}
                href={`/admin/dashboard?page=${page}`}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  pathname.includes(page) 
                    ? 'bg-cyan-500 text-black' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </Link>
            ))}
          </div>
        </div>
        <button
          onClick={async () => {
            await fetch('/api/admin/logout', { method: 'POST' });
            window.location.href = '/admin';
          }}
          className="text-sm text-slate-400 hover:text-white"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}