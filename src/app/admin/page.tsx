import prisma from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const totalComplaints = await prisma.complaint.count();
  const pendingComplaints = await prisma.complaint.count({ where: { status: 'PENDING' } });
  const inProgressComplaints = await prisma.complaint.count({ where: { status: 'IN_PROGRESS' } });
  const resolvedComplaints = await prisma.complaint.count({ where: { status: 'RESOLVED' } });

  const recentComplaints = await prisma.complaint.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { location: true },
  });

  const stats = [
    { label: 'Total Complaints', value: totalComplaints, valueColor: '#ffffff', bg: 'rgba(255,255,255,0.12)', border: 'rgba(255,255,255,0.2)' },
    { label: 'Pending', value: pendingComplaints, valueColor: '#fde68a', bg: 'rgba(245,193,60,0.15)', border: 'rgba(245,193,60,0.35)' },
    { label: 'In Progress', value: inProgressComplaints, valueColor: '#93c5fd', bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.35)' },
    { label: 'Resolved', value: resolvedComplaints, valueColor: '#86efac', bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.35)' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white drop-shadow-sm">Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.60)' }}>
          Welcome back — here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, valueColor, bg, border }) => (
          <div
            key={label}
            className="p-6 rounded-2xl shadow-xl"
            style={{ background: bg, border: `1px solid ${border}`, backdropFilter: 'blur(12px)' }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              {label}
            </p>
            <p className="text-4xl font-bold mt-2" style={{ color: valueColor }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Recent Complaints ── */}
      <div
        className="rounded-2xl shadow-xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div
          className="px-6 py-4 flex justify-between items-center"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.10)', background: 'rgba(0,0,0,0.15)' }}
        >
          <h2 className="text-lg font-bold text-white">Recent Complaints</h2>
          <Link
            href="/admin/complaints"
            className="text-sm font-semibold px-3 py-1 rounded-lg transition-all hover:opacity-80"
            style={{ color: '#fde68a', background: 'rgba(245,193,60,0.12)', border: '1px solid rgba(245,193,60,0.25)' }}
          >
            View All →
          </Link>
        </div>

        {recentComplaints.length === 0 ? (
          <p className="p-8 text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>
            No complaints yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.10)' }}>
                  {['Location', 'Type', 'Status', 'Date'].map(h => (
                    <th
                      key={h}
                      className="px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'rgba(255,255,255,0.55)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentComplaints.map(c => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-white">
                      {c.location?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: 'rgba(255,255,255,0.80)' }}>
                      {c.type}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={
                          c.status === 'PENDING'
                            ? { background: 'rgba(245,193,60,0.2)', color: '#fde68a', border: '1px solid rgba(245,193,60,0.4)' }
                            : c.status === 'RESOLVED'
                            ? { background: 'rgba(34,197,94,0.2)', color: '#86efac', border: '1px solid rgba(34,197,94,0.4)' }
                            : { background: 'rgba(59,130,246,0.2)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.4)' }
                        }
                      >
                        {c.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
