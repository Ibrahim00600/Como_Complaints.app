'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StatusSelect({ 
  complaintId, 
  currentStatus 
}: { 
  complaintId: string; 
  currentStatus: string; 
}) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/complaints/${complaintId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to update status');
        setStatus(currentStatus);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while updating');
      setStatus(currentStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={handleStatusChange}
        disabled={isUpdating}
        className={`px-4 py-2 border rounded-lg font-medium shadow-sm transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-brand ${
          status === 'PENDING' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
          status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-800 border-blue-200' :
          'bg-green-50 text-green-800 border-green-200'
        }`}
      >
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="RESOLVED">Resolved</option>
      </select>
      {isUpdating && <span className="text-sm text-gray-500 animate-pulse">Updating...</span>}
    </div>
  );
}
