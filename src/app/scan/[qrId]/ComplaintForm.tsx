'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ComplaintForm({ locationId, locationName }: { locationId: string, locationName: string }) {
  const [type, setType] = useState('OTHER');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('locationId', locationId);
      formData.append('type', type);
      formData.append('description', description);
      if (image) {
        formData.append('image', image);
      }

      const res = await fetch('/api/complaints', {
        method: 'POST',
        body: formData,
      });
      
      if (res.ok) {
        setSuccess(true);
      } else {
        alert('Failed to submit complaint');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
        <h3 className="text-xl font-semibold text-green-700 mb-2">Complaint Submitted!</h3>
        <p className="text-green-600">Thank you for reporting the issue at {locationName}. Our team has been notified.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-4 px-4 py-2 bg-brand text-white rounded hover:bg-opacity-90"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-brand focus:border-brand"
        >
          <option value="CLEANING">Cleaning</option>
          <option value="PLUMBING">Plumbing</option>
          <option value="ELECTRICAL">Electrical</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea 
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-brand focus:border-brand"
          placeholder="Please describe the issue in detail..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Attach Photo (Optional)</label>
        <input 
          type="file" 
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-brand focus:border-brand bg-white"
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-brand text-white font-medium rounded hover:bg-opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
      </button>
    </form>
  );
}
