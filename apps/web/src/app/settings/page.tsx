'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/lib/auth-context';
import { updateProfile, updatePassword, uploadAvatar } from '@/lib/api';

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    avatarUrl: '',
    currentPassword: '',
    newPassword: '',
  });

  // Pre-fill form when user loads
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        title: user.title || '',
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || '',
      }));
    }
  }, [user]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      setErrorMsg('');
      const { avatarUrl } = await uploadAvatar(file);
      setFormData(prev => ({ ...prev, avatarUrl }));
      if (user) {
        setUser({ ...user, avatarUrl });
      }
      setSuccessMsg('Profile photo updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload photo');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      // 1. Update Profile (Name, Title, Bio, AvatarUrl)
      const updatedUser = await updateProfile({
        name: formData.name,
        title: formData.title || null,
        bio: formData.bio || null,
        avatarUrl: formData.avatarUrl || null,
      });
      setUser(updatedUser);

      // 2. Update Password if provided
      if (formData.currentPassword && formData.newPassword) {
        await updatePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        });
      }

      setSuccessMsg('Settings updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">
            Settings
          </h1>
          <p className="text-secondary mt-2">
            Manage your profile details and security preferences.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Profile Section */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/20 space-y-6">
            <h2 className="text-xl font-bold text-primary border-b border-outline-variant/10 pb-4">Public Profile</h2>
            
            <div className="space-y-3">
              <label className="text-sm font-bold text-primary">Profile Photo</label>
              <div className="flex gap-4 items-center">
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt="Avatar Preview" className="w-16 h-16 rounded-full object-cover bg-surface-container" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-3xl">person</span>
                  </div>
                )}
                <div className="flex-1">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-surface-container text-primary font-bold rounded-lg hover:bg-outline-variant/20 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">upload</span>
                    {uploadingAvatar ? 'Uploading...' : 'Upload Photo'}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={uploadingAvatar}
                    />
                  </label>
                  <p className="text-xs text-secondary mt-2">Recommended: Square JPG or PNG, max 5MB.</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-primary">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-surface-container rounded-xl text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all placeholder:font-normal placeholder:text-secondary"
                placeholder="E.g. Alex Carter"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-primary">Professional Title</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-surface-container rounded-xl text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all placeholder:font-normal placeholder:text-secondary"
                placeholder="E.g. Senior Product Designer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-primary">Biography</label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 bg-surface-container rounded-xl text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all placeholder:font-normal placeholder:text-secondary resize-none"
                placeholder="Tell clients about your expertise..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/20 space-y-6">
            <h2 className="text-xl font-bold text-primary border-b border-outline-variant/10 pb-4">Security</h2>
            
            <p className="text-sm text-secondary">Leave blank if you do not want to change your password.</p>

            <div className="space-y-2">
              <label className="text-sm font-bold text-primary">Current Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-surface-container rounded-xl text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all placeholder:font-normal placeholder:text-secondary"
                placeholder="••••••••"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-primary">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-surface-container rounded-xl text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all placeholder:font-normal placeholder:text-secondary"
                placeholder="••••••••"
                value={formData.newPassword}
                min={6}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 bg-error-container text-on-error-container rounded-xl text-sm font-medium">
              {errorMsg}
            </div>
          )}
          
          {successMsg && (
            <div className="p-4 bg-[#E3F2FD] text-[#002147] rounded-xl text-sm font-medium">
              {successMsg}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`bg-primary-container text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 active:scale-[0.98]'
              }`}
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
