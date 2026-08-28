'use client';

import { useState, useEffect } from 'react';

type User = {
  id: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STAFF');
  const [message, setMessage] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      if (res.ok) setUsers(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      if (res.ok) {
        setMessage('✅ User created successfully!');
        setEmail(''); setPassword(''); setShowForm(false);
        fetchUsers();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const d = await res.json();
        setMessage(`❌ ${d.error || 'Failed to create user'}`);
      }
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  const roleBadge = (role: string) => {
    const colors: Record<string, string> = {
      SUPER_ADMIN: 'bg-red-500/20 text-red-300 border-red-500/30',
      ADMIN: 'bg-gold/20 text-gold border-gold/30',
      STAFF: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    };
    return colors[role] || 'bg-white/10 text-white/60 border-white/20';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className="text-white/50 mt-1">Manage admin and staff accounts.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-gold text-brand-dark font-bold rounded-xl hover:bg-gold-light transition-colors"
        >
          + Add User
        </button>
      </div>

      {message && <div className="text-sm text-green-400">{message}</div>}

      {showForm && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gold mb-4">New User</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-gold"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-gold"
              required
            />
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-gold"
            >
              <option value="STAFF" className="bg-gray-900">Staff</option>
              <option value="ADMIN" className="bg-gray-900">Admin</option>
            </select>
            <div className="sm:col-span-3 flex gap-3">
              <button type="submit" className="px-6 py-2.5 bg-gold text-brand-dark font-bold rounded-xl hover:bg-gold-light transition-colors">
                Create User
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-white/30 animate-pulse">Loading users…</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-white/30">No users found.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-white/40 text-xs uppercase tracking-wider border-b border-white/10">
                <th className="text-left px-6 py-3">Email</th>
                <th className="text-left px-6 py-3">Role</th>
                <th className="text-left px-6 py-3">Joined</th>
                <th className="text-right px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full border ${roleBadge(user.role)}`}>{user.role}</span>
                  </td>
                  <td className="px-6 py-4 text-white/40 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-400 hover:text-red-300 text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
