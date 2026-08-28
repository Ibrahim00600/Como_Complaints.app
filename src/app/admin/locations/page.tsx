'use client';

import { useState, useEffect } from 'react';

type Location = {
  id: string;
  name: string;
  type: string;
  qrCodeUrl: string;
};

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('CAMPUS');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchLocations(); }, []);

  const fetchLocations = async () => {
    try {
      const res = await fetch('/api/locations');
      if (res.ok) setLocations(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type }),
      });
      if (res.ok) {
        setName('');
        setMessage('✅ Location created successfully!');
        fetchLocations();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this location?')) return;
    await fetch(`/api/locations/${id}`, { method: 'DELETE' });
    fetchLocations();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Locations</h1>
        <p className="text-white/50 mt-1">Add and manage campus locations. QR codes are generated automatically.</p>
      </div>

      {/* Add form */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-gold mb-4">Add New Location</h2>
        {message && <div className="mb-4 text-green-400 text-sm">{message}</div>}
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="e.g. Science Building – 1st Floor"
            value={name}
            onChange={e => setName(e.target.value)}
            className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-gold"
            required
          />
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-gold"
          >
            <option value="CAMPUS" className="bg-gray-900">Campus</option>
            <option value="BUILDING" className="bg-gray-900">Building</option>
            <option value="FLOOR" className="bg-gray-900">Floor</option>
            <option value="AREA" className="bg-gray-900">Area / Room</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gold text-brand-dark font-bold rounded-xl hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {loading ? 'Adding…' : 'Add Location'}
          </button>
        </form>
      </div>

      {/* Locations table */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">{locations.length} Location{locations.length !== 1 ? 's' : ''}</h2>
        </div>
        {locations.length === 0 ? (
          <div className="p-12 text-center text-white/30">No locations added yet.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-white/40 text-xs uppercase tracking-wider border-b border-white/10">
                <th className="text-left px-6 py-3">Name</th>
                <th className="text-left px-6 py-3">Type</th>
                <th className="text-left px-6 py-3">QR ID</th>
                <th className="text-right px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations.map(loc => (
                <tr key={loc.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{loc.name}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-gold/10 text-gold border border-gold/20">{loc.type}</span>
                  </td>
                  <td className="px-6 py-4 text-white/40 text-sm font-mono">{loc.qrCodeUrl.slice(0, 16)}…</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(loc.id)}
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
