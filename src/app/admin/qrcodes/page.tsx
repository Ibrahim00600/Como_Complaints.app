'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type Location = {
  id: string;
  name: string;
  type: string;
  qrCodeUrl: string;
};

export default function QRCodesPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selected, setSelected] = useState<Location | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/locations').then(r => r.ok ? r.json() : []).then(setLocations).catch(console.error);
  }, []);

  const generateQR = async (loc: Location) => {
    setSelected(loc);
    setLoading(true);
    try {
      const res = await fetch(`/api/locations/${loc.qrCodeUrl}/qrcode`);
      if (res.ok) {
        const blob = await res.blob();
        setQrDataUrl(URL.createObjectURL(blob));
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const downloadQR = () => {
    if (!qrDataUrl || !selected) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR-${selected.name.replace(/\s+/g, '-')}.png`;
    a.click();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">QR Code Generator</h1>
        <p className="text-white/50 mt-1">Select a location to generate and download its QR code.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Location list */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">Select a Location</h2>
          </div>
          {locations.length === 0 ? (
            <div className="p-12 text-center text-white/30">
              No locations found. <a href="/admin/locations" className="text-gold underline">Add one first →</a>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {locations.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => generateQR(loc)}
                  className={`w-full text-left px-6 py-4 hover:bg-white/10 transition-colors flex justify-between items-center ${selected?.id === loc.id ? 'bg-gold/10 border-l-2 border-gold' : ''}`}
                >
                  <div>
                    <p className="text-white font-medium">{loc.name}</p>
                    <p className="text-white/40 text-xs mt-0.5">{loc.type}</p>
                  </div>
                  <svg className="w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* QR Preview */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          {!selected && (
            <div className="text-white/30 space-y-3">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <p>Select a location to preview its QR code</p>
            </div>
          )}
          {selected && loading && <div className="text-white/50 animate-pulse">Generating QR Code…</div>}
          {selected && !loading && qrDataUrl && (
            <div className="space-y-4 w-full">
              <h3 className="text-white font-bold text-lg">{selected.name}</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-gold/10 text-gold border border-gold/20">{selected.type}</span>
              <div className="bg-white rounded-xl p-4 mx-auto w-48 h-48 flex items-center justify-center">
                <img src={qrDataUrl} alt="QR Code" className="w-full h-full object-contain" />
              </div>
              <button
                onClick={downloadQR}
                className="w-full px-6 py-3 bg-gold text-brand-dark font-bold rounded-xl hover:bg-gold-light transition-colors"
              >
                ⬇ Download QR Code
              </button>
              <button
                onClick={() => window.print()}
                className="w-full px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors"
              >
                🖨 Print QR Code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
