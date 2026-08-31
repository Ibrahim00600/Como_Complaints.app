import prisma from '@/lib/prisma';
import Link from 'next/link';
import StatusSelect from './StatusSelect';

export const dynamic = 'force-dynamic';

export default async function ComplaintsAdminPage({
  searchParams,
}: {
  searchParams: { status?: string; type?: string }
}) {
  const { status, type } = await searchParams;
  
  const whereClause: any = {};
  if (status) whereClause.status = status;
  if (type) whereClause.type = type;

  const complaints = await prisma.complaint.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: { location: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Complaints</h1>
          <p className="text-sm text-gray-500 mt-1">
            {complaints.length} complaint{complaints.length !== 1 ? 's' : ''} found
            {status ? ` · Filtered by: ${status.replace('_', ' ')}` : ''}
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2">
          <Link
            href="/admin/complaints"
            className={`px-3 py-1 text-sm rounded border transition-colors ${
              !status ? 'bg-brand text-white border-brand' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            All
          </Link>
          <Link
            href="/admin/complaints?status=PENDING"
            className={`px-3 py-1 text-sm rounded border transition-colors ${
              status === 'PENDING' ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Pending
          </Link>
          <Link
            href="/admin/complaints?status=IN_PROGRESS"
            className={`px-3 py-1 text-sm rounded border transition-colors ${
              status === 'IN_PROGRESS' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            In Progress
          </Link>
          <Link
            href="/admin/complaints?status=RESOLVED"
            className={`px-3 py-1 text-sm rounded border transition-colors ${
              status === 'RESOLVED' ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Resolved
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {complaints.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400 text-lg">No complaints found.</p>
            <p className="text-gray-300 text-sm mt-1">Try a different filter.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type &amp; Description</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {complaints.map(complaint => (
                <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm text-gray-700 font-mono">
                    {complaint.id.substring(0, 8)}
                  </td>
                  <td className="p-4 text-sm font-semibold text-gray-900">
                    {complaint.location?.name || 'Unknown'}
                  </td>
                  <td className="p-4 max-w-xs">
                    <span className="font-semibold text-sm block text-gray-800">{complaint.type}</span>
                    <span className="text-sm text-gray-600 line-clamp-2">{complaint.description}</span>
                  </td>

                  {/* ── Inline status changer ── */}
                  <td className="p-4">
                    <StatusSelect
                      complaintId={complaint.id}
                      currentStatus={complaint.status}
                      compact
                    />
                  </td>

                  <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-sm">
                    <Link
                      href={`/admin/complaints/${complaint.id}`}
                      className="text-brand hover:underline font-medium"
                    >
                      View
                    </Link>
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
