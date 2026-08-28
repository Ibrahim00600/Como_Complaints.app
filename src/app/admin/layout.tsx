import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-transparent relative z-10">
      <aside className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 text-white flex flex-col shadow-[4px_0_24px_0_rgba(0,0,0,0.2)]">
        <div className="p-6 text-xl font-bold border-b border-white/10 text-gold-light flex items-center gap-3">
          <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          CUCS Admin
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <Link href="/admin" className="block px-4 py-3 rounded-lg hover:bg-gold/10 hover:text-gold transition-colors font-medium">
            Dashboard
          </Link>
          <Link href="/admin/complaints" className="block px-4 py-3 rounded-lg hover:bg-gold/10 hover:text-gold transition-colors font-medium">
            Complaints
          </Link>
          <Link href="/admin/locations" className="block px-4 py-3 rounded-lg hover:bg-gold/10 hover:text-gold transition-colors font-medium">
            Locations & QR Codes
          </Link>
          <Link href="/admin/users" className="block px-4 py-3 rounded-lg hover:bg-gold/10 hover:text-gold transition-colors font-medium">
            Users
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="absolute inset-0 bg-brand-dark/30 -z-10"></div>
        {children}
      </main>
    </div>
  );
}
