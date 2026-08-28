import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ComplaintForm from './ComplaintForm';

export default async function ScanPage({ params }: { params: { qrId: string } }) {
  const { qrId } = await params;
  
  const location = await prisma.location.findUnique({
    where: { qrCodeUrl: qrId },
    include: {
      parent: true,
    }
  });

  if (!location) {
    return notFound();
  }

  // Construct full location name if it has a parent
  const fullLocationName = location.parent 
    ? `${location.parent.name} - ${location.name}`
    : location.name;

  return (
    <main className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand">Report an Issue</h1>
        <p className="text-gray-600 mt-2">
          Location: <span className="font-semibold text-gray-800">{fullLocationName}</span>
        </p>
      </div>
      
      <ComplaintForm locationId={location.id} locationName={fullLocationName} />
    </main>
  );
}
