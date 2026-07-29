"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../components/AdminLayout';

export default function AdminMessages() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/views/login');
      return;
    }

    fetchMessages();
  }, [router, statusFilter]);

  const fetchMessages = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const url = statusFilter 
        ? `/admin/routes/messages?status=${statusFilter}`
        : '/admin/routes/messages';
      
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setMessages(data.messages || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/admin/routes/messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        setMessage('✅ Status updated successfully!');
        fetchMessages();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const error = await res.json();
        setMessage(`❌ Error: ${error.message}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      read: 'bg-blue-500/20 text-blue-400',
      replied: 'bg-green-500/20 text-green-400',
      archived: 'bg-gray-500/20 text-gray-400'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: '🟡 Pending',
      read: '🔵 Read',
      replied: '🟢 Replied',
      archived: '⚪ Archived'
    };
    return badges[status] || status;
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
            <h1 className="text-3xl font-bold text-white">Contact Messages</h1>
            <p className="text-gray-400 mt-1">Total: {total} messages</p>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
            >
              <option value="">All Status</option>
              <option value="pending">🟡 Pending</option>
              <option value="read">🔵 Read</option>
              <option value="replied">🟢 Replied</option>
              <option value="archived">⚪ Archived</option>
            </select>
            <button
              onClick={() => fetchMessages()}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-4 px-4 py-3 rounded-lg ${
            message.includes('✅') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {message}
          </div>
        )}

        {messages.length === 0 ? (
          <div className="bg-[#1a1a1a] p-8 rounded-xl border border-white/10 text-center text-gray-400">
            {statusFilter ? `No ${statusFilter} messages found` : 'No messages found'}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 hover:border-white/20 transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{msg.email}</h3>
                    <p className="text-sm text-gray-400">
                      Service: {msg.service} • Company: {msg.company || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(msg.status)}`}>
                      {getStatusBadge(msg.status)}
                    </span>
                  </div>
                </div>

                {msg.phone && (
                  <p className="text-sm text-gray-400 mb-2">📞 Phone: {msg.phone}</p>
                )}

                <p className="text-gray-300 mb-4 whitespace-pre-wrap">{msg.message}</p>

                <div className="flex gap-2 flex-wrap">
                  {msg.status !== 'read' && (
                    <button
                      onClick={() => updateStatus(msg.id, 'read')}
                      className="px-3 py-1 text-sm bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition"
                    >
                      Mark as Read
                    </button>
                  )}
                  {msg.status !== 'replied' && (
                    <button
                      onClick={() => updateStatus(msg.id, 'replied')}
                      className="px-3 py-1 text-sm bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition"
                    >
                      Mark as Replied
                    </button>
                  )}
                  {msg.status !== 'archived' && (
                    <button
                      onClick={() => updateStatus(msg.id, 'archived')}
                      className="px-3 py-1 text-sm bg-gray-500/20 text-gray-400 rounded hover:bg-gray-500/30 transition"
                    >
                      Archive
                    </button>
                  )}
                  {msg.status !== 'pending' && (
                    <button
                      onClick={() => updateStatus(msg.id, 'pending')}
                      className="px-3 py-1 text-sm bg-yellow-500/20 text-yellow-400 rounded hover:bg-yellow-500/30 transition"
                    >
                      Set Pending
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}