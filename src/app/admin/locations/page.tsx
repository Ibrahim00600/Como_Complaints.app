'use client';

import { useState, useEffect } from 'react';

type Location = {
  id: string;
  name: string;
  type: string;
  qrCodeUrl: string;
};

export default function LocationsAdminPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('CAMPUS');

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await fetch('/api/locations');
      if (res.ok) {
        const data = await res.json();
        setLocations(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type }),
      });
      if (res.ok) {
        setName('');
        fetchLocations();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Locations & QR Codes</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Add New Location</h2>
        <form onSubmit={handleCreate} className="flex gap-4">
          <input 
            type="text" 
            placeholder="Location Name (e.g. Science Building 1st Floor)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded focus:ring-brand focus:border-brand"
            required
          />
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:ring-brand focus:border-brand"
          >
            <option value="CAMPUS">Campus</option>
            <option value="BUILDING">Building</option>
            <option value="FLOOR">Floor</option>
            <option value="AREA">Area/Room</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-brand text-white font-medium rounded hover:bg-opacity-90">
            Create Location
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map(loc => (
          <div key={loc.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center">
            <h3 className="font-bold text-lg mb-1">{loc.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{loc.type}</p>
            {/* Display QR code image fetched dynamically based on URL, assuming an API endpoint exists, or fallback text */}
            <div className="w-32 h-32 bg-gray-100 flex items-center justify-center mb-4 rounded border border-gray-200 p-2">
               <img src={`/api/locations/${loc.qrCodeUrl}/qrcode`} alt={`QR Code for ${loc.name}`} className="w-full h-full object-contain" />
            </div>
            <button 
              onClick={() => window.print()} 
              className="mt-auto px-4 py-2 border border-brand text-brand rounded hover:bg-brand hover:text-white transition-colors text-sm w-full"
            >
              Print QR Code
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
