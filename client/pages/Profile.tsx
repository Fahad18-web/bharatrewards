import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/storageService';
import { changePassword, refreshCurrentUser, saveUser as saveUserApi } from '../services/apiService';
import { User } from '../types';
import { AdUnit } from '../components/AdUnit';
import SEO from '../components/SEO';

interface StatusMessage {
  type: 'success' | 'error';
  message: string;
}

// Avatar options - emoji-based avatars
const AVATARS = [
  { id: 'default', emoji: '👤', label: 'Default' },
  { id: 'man', emoji: '👨', label: 'Man' },
  { id: 'woman', emoji: '👩', label: 'Woman' },
  { id: 'boy', emoji: '👦', label: 'Boy' },
  { id: 'girl', emoji: '👧', label: 'Girl' },
  { id: 'ninja', emoji: '🥷', label: 'Ninja' },
  { id: 'astronaut', emoji: '🧑‍🚀', label: 'Astronaut' },
  { id: 'scientist', emoji: '🧑‍🔬', label: 'Scientist' },
  { id: 'technologist', emoji: '🧑‍💻', label: 'Technologist' },
  { id: 'artist', emoji: '🧑‍🎨', label: 'Artist' },
  { id: 'student', emoji: '🧑‍🎓', label: 'Student' },
  { id: 'teacher', emoji: '🧑‍🏫', label: 'Teacher' },
  { id: 'superhero', emoji: '🦸', label: 'Superhero' },
  { id: 'wizard', emoji: '🧙', label: 'Wizard' },
  { id: 'genie', emoji: '🧞', label: 'Genie' },
  { id: 'robot', emoji: '🤖', label: 'Robot' },
  { id: 'alien', emoji: '👽', label: 'Alien' },
  { id: 'ghost', emoji: '👻', label: 'Ghost' },
  { id: 'lion', emoji: '🦁', label: 'Lion' },
  { id: 'tiger', emoji: '🐯', label: 'Tiger' },
  { id: 'fox', emoji: '🦊', label: 'Fox' },
  { id: 'wolf', emoji: '🐺', label: 'Wolf' },
  { id: 'panda', emoji: '🐼', label: 'Panda' },
  { id: 'koala', emoji: '🐨', label: 'Koala' },
  { id: 'unicorn', emoji: '🦄', label: 'Unicorn' },
  { id: 'dragon', emoji: '🐉', label: 'Dragon' },
  { id: 'eagle', emoji: '🦅', label: 'Eagle' },
  { id: 'owl', emoji: '🦉', label: 'Owl' },
  { id: 'butterfly', emoji: '🦋', label: 'Butterfly' },
  { id: 'rocket', emoji: '🚀', label: 'Rocket' },
];

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    avatar: ''
  });
  const [profileStatus, setProfileStatus] = useState<StatusMessage | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

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
      setProfileForm({ name: cachedUser.name, email: cachedUser.email, avatar: cachedUser.avatar || '' });
      setLoading(false);

      try {
        const latest = await refreshCurrentUser();
        if (latest) {
          setUser(latest);
          setProfileForm({ name: latest.name, email: latest.email, avatar: latest.avatar || '' });
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

  const currentAvatar = useMemo(() => {
    const avatarId = profileForm.avatar || user?.avatar;
    return AVATARS.find(a => a.id === avatarId) || null;
  }, [profileForm.avatar, user?.avatar]);

  const handleAvatarSelect = (avatarId: string) => {
    setProfileForm(prev => ({ ...prev, avatar: avatarId }));
    setShowAvatarPicker(false);
  };

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    setSavingProfile(true);
    setProfileStatus(null);

    try {
      const trimmedName = profileForm.name.trim();
      const trimmedEmail = profileForm.email.trim().toLowerCase();
      const updatedUser = await saveUserApi({ 
        ...user, 
        name: trimmedName, 
        email: trimmedEmail,
        avatar: profileForm.avatar || undefined
      });
      setUser(updatedUser);
      setProfileForm({ name: updatedUser.name, email: updatedUser.email, avatar: updatedUser.avatar || '' });
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

  const hasProfileChanges = user && (
    user.name !== profileForm.name || 
    user.email !== profileForm.email ||
    (user.avatar || '') !== profileForm.avatar
  );

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in-up">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 border-8 border-gray-100 dark:border-white/10 rounded-full"></div>
          <div className="absolute inset-0 border-8 border-t-india-saffron border-b-india-green border-l-transparent border-r-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Loading your profile...</p>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Profile" 
        description="View and edit your profile, change password, and manage your account settings."
        canonicalPath="/profile"
      />
      <div className="space-y-12 pb-12">
      <section className="glass-card p-10 rounded-[3rem] flex flex-col lg:flex-row gap-10 items-center">
        {/* Avatar Section */}
        <div className="relative">
          <div 
            onClick={() => setShowAvatarPicker(true)}
            className="relative w-36 h-36 rounded-[2rem] bg-gradient-to-br from-india-blue to-blue-900 text-white flex items-center justify-center text-5xl font-black shadow-2xl border-4 border-white/30 cursor-pointer hover:scale-105 transition-transform group"
          >
            {currentAvatar ? (
              <span className="text-6xl">{currentAvatar.emoji}</span>
            ) : (
              initials
            )}
            <div className="absolute inset-0 bg-black/40 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-bold">Change</span>
            </div>
          </div>
          <div className="absolute -bottom-3 right-6 bg-white dark:bg-slate-700 text-green-500 dark:text-green-400 rounded-full px-4 py-1 text-xs font-black uppercase tracking-wide shadow-lg">
            {user.role === 'ADMIN' ? 'Admin' : 'Player'}
          </div>
          <button
            onClick={() => setShowAvatarPicker(true)}
            className="absolute -bottom-3 -left-2 bg-india-saffron text-white rounded-full p-2 shadow-lg hover:bg-orange-600 transition-colors"
            title="Change Avatar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 text-center lg:text-left">
          <p className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-2">Account Overview</p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-800 dark:text-white mb-4">{user.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">{user.email}</p>
          {user.role !== 'ADMIN' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-inner">
                <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Points</p>
                <p className="text-3xl font-black text-india-green dark:text-green-400">{user.points.toLocaleString()}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-inner">
                <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Questions Solved</p>
                <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{user.solvedCount}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-inner">
                <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Wallet Balance</p>
                <p className="text-3xl font-black text-gray-800 dark:text-white">₹ {(user.walletBalance ?? 0).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAvatarPicker(false)}>
          <div 
            className="glass-card dark:glass-card rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-800 dark:text-white">Choose Your Avatar</h2>
              <button 
                onClick={() => setShowAvatarPicker(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => handleAvatarSelect(avatar.id)}
                  className={`relative aspect-square rounded-2xl flex items-center justify-center text-3xl sm:text-4xl transition-all hover:scale-110 ${
                    profileForm.avatar === avatar.id
                      ? 'bg-india-blue/20 dark:bg-india-blue/40 ring-4 ring-india-blue shadow-lg'
                      : 'bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-gray-100 dark:border-white/10'
                  }`}
                  title={avatar.label}
                >
                  {avatar.emoji}
                  {profileForm.avatar === avatar.id && (
                    <div className="absolute -top-1 -right-1 bg-india-blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setProfileForm(prev => ({ ...prev, avatar: '' }));
                  setShowAvatarPicker(false);
                }}
                className="px-6 py-3 rounded-xl text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                Remove Avatar
              </button>
              <button
                onClick={() => setShowAvatarPicker(false)}
                className="px-6 py-3 rounded-xl bg-india-blue text-white font-bold hover:bg-blue-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <form onSubmit={handleProfileSubmit} className="glass-card dark:glass-card p-10 rounded-[2.5rem] space-y-8">
          <div>
            <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-1">Profile</p>
            <h2 className="text-2xl font-black text-gray-800 dark:text-white">Personal Information</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Update how your name and email appear across the platform.</p>
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
              <span className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-2 block">Full Name</span>
              <input
                type="text"
                value={profileForm.name}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, name: event.target.value }))}
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-slate-800/50 text-gray-900 dark:text-white focus:border-india-blue focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition-all font-medium"
                placeholder="Your name"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-2 block">Email Address</span>
              <input
                type="email"
                value={profileForm.email}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-slate-800/50 text-gray-900 dark:text-white focus:border-india-blue focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition-all font-medium"
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
                ? 'bg-gray-300 dark:bg-slate-700 border-gray-200 dark:border-slate-600 cursor-not-allowed text-gray-500 dark:text-gray-400'
                : 'bg-gradient-to-r from-india-blue to-blue-900 border-blue-800 hover:shadow-blue-500/40 hover:-translate-y-0.5'
            }`}
          >
            {savingProfile ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        <form onSubmit={handlePasswordSubmit} className="glass-card dark:glass-card p-10 rounded-[2.5rem] space-y-8">
          <div>
            <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-1">Security</p>
            <h2 className="text-2xl font-black text-gray-800 dark:text-white">Password</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Keep your account secure by using a unique password.</p>
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
              <span className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-2 block">Current Password</span>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(event) => setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-slate-800/50 text-gray-900 dark:text-white focus:border-india-blue focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition-all font-medium"
                placeholder="••••••"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-2 block">New Password</span>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-slate-800/50 text-gray-900 dark:text-white focus:border-india-blue focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition-all font-medium"
                placeholder="At least 4 characters"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-2 block">Confirm Password</span>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-slate-800/50 text-gray-900 dark:text-white focus:border-india-blue focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition-all font-medium"
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
                ? 'bg-gray-300 dark:bg-slate-700 border-gray-200 dark:border-slate-600 cursor-not-allowed text-gray-500 dark:text-gray-400'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-600 hover:shadow-emerald-500/30 hover:-translate-y-0.5'
            }`}
          >
            {savingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </section>

      <AdUnit />
    </div>
    </>
  );
};
