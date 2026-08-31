'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function ComplaintForm({ locationId, locationName }: { locationId: string, locationName: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('OTHER');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('locationId', locationId);
      formData.append('reporterName', name);
      formData.append('reporterEmail', email);
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
          onClick={() => {
            setSuccess(false);
            setName('');
            setEmail('');
            setDescription('');
            setImage(null);
            setImagePreview(null);
          }}
          className="mt-6 px-6 py-2 bg-brand text-white rounded-lg hover:bg-opacity-90 font-medium transition-colors shadow-sm"
        >
          Submit Another Report
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
          <input 
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all text-gray-900 bg-white"
            placeholder="John Doe"
            style={{ color: '#111827', backgroundColor: '#ffffff' }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
          <input 
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all text-gray-900 bg-white"
            placeholder="john@example.com"
            style={{ color: '#111827', backgroundColor: '#ffffff' }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all text-gray-900 bg-white"
          style={{ color: '#111827', backgroundColor: '#ffffff' }}
        >
          <option value="CLEANING">Cleaning & Janitorial</option>
          <option value="PLUMBING">Plumbing Issue</option>
          <option value="ELECTRICAL">Electrical Issue</option>
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
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all resize-none text-gray-900 bg-white"
          placeholder="Please describe the issue in detail..."
          style={{ color: '#111827', backgroundColor: '#ffffff' }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo (Optional)</label>
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-brand transition-all group overflow-hidden relative"
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <>
              <svg className="w-8 h-8 text-gray-400 group-hover:text-brand mb-2 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-500 font-medium group-hover:text-brand transition-colors">Tap to upload from Gallery or take a photo</span>
            </>
          )}
        </div>
        <input 
          type="file" 
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
        {image && (
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className="text-brand font-medium truncate max-w-[200px]">{image.name}</span>
            <button 
              type="button" 
              onClick={() => { setImage(null); setImagePreview(null); }}
              className="text-red-500 hover:text-red-700 font-medium"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full py-3 px-4 rounded-xl shadow-md disabled:opacity-70 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2 mt-4"
        style={{ backgroundColor: '#002B49', color: '#ffffff', fontWeight: 'bold', fontSize: '1.125rem' }}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </>
        ) : (
          'Submit Complaint'
        )}
      </button>
    </form>
  );
}
