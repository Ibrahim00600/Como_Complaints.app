'use client';

import { useState, useRef } from 'react';

export default function ProfilePage() {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); setError('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      const body: Record<string, string> = {};
      if (email) body.email = email;
      if (currentPassword && newPassword) {
        body.currentPassword = currentPassword;
        body.newPassword = newPassword;
      }
      if (avatar) body.avatarBase64 = avatar;

      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Profile updated successfully!');
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        setTimeout(() => setMessage(''), 4000);
      } else {
        setError(data.error || 'Failed to update profile.');
      }
    } catch (e) { setError('An unexpected error occurred.'); }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        <p className="text-white/50 mt-1">Update your account details and password.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-6">
          <div
            className="w-24 h-24 rounded-full bg-white/10 border-2 border-gold/40 flex items-center justify-center overflow-hidden cursor-pointer hover:border-gold transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {avatar ? (
              <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-12 h-12 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          <div>
            <p className="text-white font-semibold">Profile Photo</p>
            <p className="text-white/40 text-sm mt-0.5">Click the avatar to upload a new photo</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-gold text-sm hover:underline"
            >
              Change photo →
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        {/* Email */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gold">Email Address</h2>
          <div>
            <label className="text-white/60 text-sm block mb-2">New Email</label>
            <input
              type="email"
              placeholder="admin@cosmopolitan.edu"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        {/* Password */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gold">Change Password</h2>
          <div>
            <label className="text-white/60 text-sm block mb-2">Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="text-white/60 text-sm block mb-2">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="text-white/60 text-sm block mb-2">Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        {message && <div className="text-green-400 text-sm">{message}</div>}
        {error && <div className="text-red-400 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 bg-gold text-brand-dark font-bold rounded-xl hover:bg-gold-light transition-colors text-lg disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
