import prisma from '@/lib/prisma';
import Link from 'next/link';

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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-gray-500 text-sm uppercase tracking-wider">Total Complaints</h2>
          <p className="text-3xl font-bold mt-2">{totalComplaints}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-gray-500 text-sm uppercase tracking-wider">Pending</h2>
          <p className="text-3xl font-bold mt-2 text-yellow-600">{pendingComplaints}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-gray-500 text-sm uppercase tracking-wider">Resolved</h2>
          <p className="text-3xl font-bold mt-2 text-green-600">{resolvedComplaints}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Recent Complaints</h2>
          <Link href="/admin/complaints" className="text-brand hover:underline text-sm">
            View All
          </Link>
        </div>
        <div className="p-0">
          {recentComplaints.length === 0 ? (
            <p className="p-6 text-gray-500">No complaints yet.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 text-sm font-medium text-gray-600">Location</th>
                  <th className="p-4 text-sm font-medium text-gray-600">Type</th>
                  <th className="p-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="p-4 text-sm font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.map(complaint => (
                  <tr key={complaint.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 text-sm">{complaint.location?.name || 'Unknown'}</td>
                    <td className="p-4 text-sm">{complaint.type}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        complaint.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        complaint.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
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
