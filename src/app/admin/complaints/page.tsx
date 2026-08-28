import prisma from '@/lib/prisma';
import Link from 'next/link';

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
        <h1 className="text-3xl font-bold text-gray-800">Complaints</h1>
        
        {/* Simple Filters - in a real app, these would update the URL params using a client component */}
        <div className="flex gap-2">
          <Link href="/admin/complaints" className={`px-3 py-1 text-sm rounded border ${!status ? 'bg-brand text-white' : 'bg-white text-gray-700'}`}>All</Link>
          <Link href="/admin/complaints?status=PENDING" className={`px-3 py-1 text-sm rounded border ${status === 'PENDING' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700'}`}>Pending</Link>
          <Link href="/admin/complaints?status=IN_PROGRESS" className={`px-3 py-1 text-sm rounded border ${status === 'IN_PROGRESS' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}>In Progress</Link>
          <Link href="/admin/complaints?status=RESOLVED" className={`px-3 py-1 text-sm rounded border ${status === 'RESOLVED' ? 'bg-green-500 text-white' : 'bg-white text-gray-700'}`}>Resolved</Link>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {complaints.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">No complaints found matching criteria.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-sm font-medium text-gray-600">ID</th>
                <th className="p-4 text-sm font-medium text-gray-600">Location</th>
                <th className="p-4 text-sm font-medium text-gray-600">Type & Desc</th>
                <th className="p-4 text-sm font-medium text-gray-600">Status</th>
                <th className="p-4 text-sm font-medium text-gray-600">Date</th>
                <th className="p-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {complaints.map(complaint => (
                <tr key={complaint.id} className="hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-500 font-mono">
                    {complaint.id.substring(0, 8)}
                  </td>
                  <td className="p-4 text-sm font-medium">
                    {complaint.location?.name || 'Unknown'}
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-sm block">{complaint.type}</span>
                    <span className="text-sm text-gray-600 line-clamp-2">{complaint.description}</span>
                  </td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      complaint.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      complaint.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-sm">
                    <Link href={`/admin/complaints/${complaint.id}`} className="text-brand hover:underline font-medium">
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
