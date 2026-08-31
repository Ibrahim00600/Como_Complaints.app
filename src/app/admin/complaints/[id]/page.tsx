import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import StatusSelect from './StatusSelect';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function ComplaintDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const complaint = await prisma.complaint.findUnique({
    where: { id },
    include: { location: true },
  });

  if (!complaint) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin/complaints"
          className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-500 hover:text-brand transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Complaint Details</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 font-mono mb-1">ID: {complaint.id}</p>
            <h2 className="text-2xl font-bold text-gray-900">{complaint.type} Issue</h2>
            <p className="text-gray-600 mt-1 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {complaint.location?.name || 'Unknown Location'}
            </p>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-2">
            <p className="text-sm text-gray-500">Current Status</p>
            <StatusSelect complaintId={complaint.id} currentStatus={complaint.status} />
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Description
              </h3>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{complaint.description}</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Reporter Details
              </h3>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{complaint.reporterName || 'Anonymous'}</p>
                </div>
                {complaint.reporterEmail && (
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href={`mailto:${complaint.reporterEmail}`} className="font-medium text-brand hover:underline">
                      {complaint.reporterEmail}
                    </a>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Reported On</p>
                  <p className="font-medium text-gray-900">{new Date(complaint.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </section>
          </div>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Attached Media
            </h3>
            {complaint.imageUrl ? (
              <a 
                href={complaint.imageUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-brand transition-colors group"
              >
                <Image 
                  src={complaint.imageUrl} 
                  alt="Complaint attached image" 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-brand px-4 py-2 rounded-lg font-medium shadow-sm transition-opacity">
                    View Full Image
                  </span>
                </div>
              </a>
            ) : (
              <div className="aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                <svg className="w-12 h-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>No media attached</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
