import prisma from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const totalComplaints = await prisma.complaint.count();
  const pendingComplaints = await prisma.complaint.count({ where: { status: 'PENDING' } });
  const resolvedComplaints = await prisma.complaint.count({ where: { status: 'RESOLVED' } });
  
  const recentComplaints = await prisma.complaint.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { location: true },
  });

  return (
    <div className="space-y-6 relative z-10">
      <h1 className="text-3xl font-bold text-white drop-shadow-sm">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20">
          <h2 className="text-gray-300 text-sm uppercase tracking-wider font-semibold">Total Complaints</h2>
          <p className="text-3xl font-bold mt-2 text-white">{totalComplaints}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20">
          <h2 className="text-gray-300 text-sm uppercase tracking-wider font-semibold">Pending</h2>
          <p className="text-3xl font-bold mt-2 text-gold">{pendingComplaints}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20">
          <h2 className="text-gray-300 text-sm uppercase tracking-wider font-semibold">Resolved</h2>
          <p className="text-3xl font-bold mt-2 text-green-400">{resolvedComplaints}</p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/10">
          <h2 className="text-lg font-semibold text-white">Recent Complaints</h2>
          <Link href="/admin/complaints" className="text-gold hover:text-gold-light hover:underline text-sm font-medium transition-colors">
            View All
          </Link>
        </div>
        <div className="p-0">
          {recentComplaints.length === 0 ? (
            <p className="p-6 text-gray-300">No complaints yet.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/5">
                  <th className="p-4 text-sm font-medium text-gray-300">Location</th>
                  <th className="p-4 text-sm font-medium text-gray-300">Type</th>
                  <th className="p-4 text-sm font-medium text-gray-300">Status</th>
                  <th className="p-4 text-sm font-medium text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.map(complaint => (
                  <tr key={complaint.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-sm text-gray-200">{complaint.location?.name || 'Unknown'}</td>
                    <td className="p-4 text-sm text-gray-200">{complaint.type}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold shadow-sm ${
                        complaint.status === 'PENDING' ? 'bg-gold/20 text-gold border border-gold/30' :
                        complaint.status === 'RESOLVED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
