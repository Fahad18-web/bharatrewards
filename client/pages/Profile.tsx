import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/storageService';
import { changePassword, refreshCurrentUser, saveUser as saveUserApi } from '../services/apiService';
import { User } from '../types';
import { AdUnit } from '../components/AdUnit';

interface StatusMessage {
  type: 'success' | 'error';
  message: string;
}

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: ''
  });
  const [profileStatus, setProfileStatus] = useState<StatusMessage | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordStatus, setPasswordStatus] = useState<StatusMessage | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      const cachedUser = getCurrentUser();
      if (!cachedUser) {
        navigate('/auth');
        return;
      }

      setUser(cachedUser);
      setProfileForm({ name: cachedUser.name, email: cachedUser.email });
      setLoading(false);

      try {
        const latest = await refreshCurrentUser();
        if (latest) {
          setUser(latest);
          setProfileForm({ name: latest.name, email: latest.email });
        }
      } catch (error) {
        console.warn('Failed to refresh profile', error);
      }
    };

    hydrate();
  }, [navigate]);

  const initials = useMemo(() => {
    if (!user?.name) return 'BR';
    return user.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }, [user]);

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    setSavingProfile(true);
    setProfileStatus(null);

    try {
      const trimmedName = profileForm.name.trim();
      const trimmedEmail = profileForm.email.trim().toLowerCase();
      const updatedUser = await saveUserApi({ ...user, name: trimmedName, email: trimmedEmail });
      setUser(updatedUser);
      setProfileForm({ name: updatedUser.name, email: updatedUser.email });
      setProfileStatus({ type: 'success', message: 'Profile updated successfully.' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile.';
      setProfileStatus({ type: 'error', message });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordStatus(null);

    if (passwordForm.newPassword.length < 4) {
      setPasswordStatus({ type: 'error', message: 'Password must be at least 4 characters.' });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    setSavingPassword(true);

    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordStatus({ type: 'success', message: 'Password updated successfully.' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update password.';
      setPasswordStatus({ type: 'error', message });
    } finally {
      setSavingPassword(false);
    }
  };

  const hasProfileChanges = user && (user.name !== profileForm.name || user.email !== profileForm.email);

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in-up">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 border-8 border-gray-100 rounded-full"></div>
          <div className="absolute inset-0 border-8 border-t-india-saffron border-b-india-green border-l-transparent border-r-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-500 font-medium">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      <section className="glass-card p-10 rounded-[3rem] flex flex-col lg:flex-row gap-10 items-center">
        <div className="relative w-36 h-36 rounded-[2rem] bg-gradient-to-br from-india-blue to-blue-900 text-white flex items-center justify-center text-5xl font-black shadow-2xl border-4 border-white/30">
          {initials}
          <div className="absolute -bottom-3 right-6 bg-white text-green-500 rounded-full px-4 py-1 text-xs font-black uppercase tracking-wide shadow-lg">
            {user.role === 'ADMIN' ? 'Admin' : 'Player'}
          </div>
        </div>
        <div className="flex-1 text-center lg:text-left">
          <p className="text-sm font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Account Overview</p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">{user.name}</h1>
          <p className="text-gray-500 text-lg font-medium">{user.email}</p>
          {user.role !== 'ADMIN' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-inner">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Points</p>
                <p className="text-3xl font-black text-india-green">{user.points.toLocaleString()}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-inner">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Questions Solved</p>
                <p className="text-3xl font-black text-indigo-600">{user.solvedCount}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-inner">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Wallet Balance</p>
                <p className="text-3xl font-black text-gray-800">₹ {(user.walletBalance ?? 0).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <form onSubmit={handleProfileSubmit} className="glass-card p-10 rounded-[2.5rem] space-y-8">
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Profile</p>
            <h2 className="text-2xl font-black text-gray-800">Personal Information</h2>
            <p className="text-gray-500 text-sm mt-1">Update how your name and email appear across the platform.</p>
          </div>

          {profileStatus && (
            <div className={`p-4 rounded-2xl font-medium ${
              profileStatus.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-100'
                : 'bg-red-50 text-red-600 border border-red-100'
            }`}>
              {profileStatus.message}
            </div>
          )}

          <div className="space-y-5">
            <label className="block">
              <span className="text-sm font-bold text-gray-600 mb-2 block">Full Name</span>
              <input
                type="text"
                value={profileForm.name}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, name: event.target.value }))}
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-india-blue focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                placeholder="Your name"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-gray-600 mb-2 block">Email Address</span>
              <input
                type="email"
                value={profileForm.email}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-india-blue focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                placeholder="name@email.com"
                required
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={savingProfile || !hasProfileChanges}
            className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition-all shadow-lg border ${
              savingProfile || !hasProfileChanges
                ? 'bg-gray-300 border-gray-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-india-blue to-blue-900 border-blue-800 hover:shadow-blue-500/40 hover:-translate-y-0.5'
            }`}
          >
            {savingProfile ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        <form onSubmit={handlePasswordSubmit} className="glass-card p-10 rounded-[2.5rem] space-y-8">
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Security</p>
            <h2 className="text-2xl font-black text-gray-800">Password</h2>
            <p className="text-gray-500 text-sm mt-1">Keep your account secure by using a unique password.</p>
          </div>

          {passwordStatus && (
            <div className={`p-4 rounded-2xl font-medium ${
              passwordStatus.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-100'
                : 'bg-red-50 text-red-600 border border-red-100'
            }`}>
              {passwordStatus.message}
            </div>
          )}

          <div className="space-y-5">
            <label className="block">
              <span className="text-sm font-bold text-gray-600 mb-2 block">Current Password</span>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(event) => setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-india-blue focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                placeholder="••••••"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-gray-600 mb-2 block">New Password</span>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-india-blue focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                placeholder="At least 4 characters"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-gray-600 mb-2 block">Confirm Password</span>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-india-blue focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                placeholder="Repeat new password"
                required
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition-all shadow-lg border ${
              savingPassword
                ? 'bg-gray-300 border-gray-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-600 hover:shadow-emerald-500/30 hover:-translate-y-0.5'
            }`}
          >
            {savingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </section>

      <AdUnit />
    </div>
  );
};
