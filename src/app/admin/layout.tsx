import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-brand text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-white/20">
          CUCS Admin
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-2 rounded hover:bg-white/10">
            Dashboard
          </Link>
          <Link href="/admin/complaints" className="block px-4 py-2 rounded hover:bg-white/10">
            Complaints
          </Link>
          <Link href="/admin/locations" className="block px-4 py-2 rounded hover:bg-white/10">
            Locations & QR Codes
          </Link>
          <Link href="/admin/users" className="block px-4 py-2 rounded hover:bg-white/10">
            Users
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
