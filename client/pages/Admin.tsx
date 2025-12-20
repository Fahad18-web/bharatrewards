import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/storageService';
import {
  getUsers as fetchUsers,
  getRedeemRequests as fetchRedeemRequests,
  updateRedeemRequest as updateRedeemRequestApi,
  getSettings as fetchSettings,
  saveSettings as saveSettingsApi,
  getCustomQuestions as fetchCustomQuestions,
  addCustomQuestion as addCustomQuestionApi,
  deleteCustomQuestion as deleteCustomQuestionApi,
  adminDeleteUser,
  adminToggleUserBan,
  getAdminAnnouncements as fetchAnnouncements,
  createAnnouncement as createAnnouncementApi,
  updateAnnouncement as updateAnnouncementApi,
  deleteAnnouncement as deleteAnnouncementApi,
  toggleAnnouncementStatus as toggleAnnouncementStatusApi,
  getAdminFeedback as fetchFeedback,
  updateFeedback as updateFeedbackApi,
  deleteFeedback as deleteFeedbackApi
} from '../services/apiService';
import { User, RedeemRequest, UserRole, AppSettings, Question, Announcement, Feedback } from '../types';
import SEO from '../components/SEO';

type Tab = 'DASHBOARD' | 'USERS' | 'QUESTIONS' | 'SETTINGS' | 'COMMUNITY';

const DEFAULT_SETTINGS: AppSettings = {
  minRedeemPoints: 15000,
  pointsPerQuestion: 10,
  currencyRate: 35
};

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('DASHBOARD');
  const [admin, setAdmin] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [redeems, setRedeems] = useState<RedeemRequest[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [initializing, setInitializing] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [qType, setQType] = useState<'MATH' | 'QUIZ' | 'PUZZLE' | 'TYPING' | 'CAPTCHA'>('MATH');
  const [qText, setQText] = useState('');
  const [qAnswer, setQAnswer] = useState('');
  const [qOptions, setQOptions] = useState('');

  // Announcement Form States
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annType, setAnnType] = useState<'INFO' | 'WARNING' | 'SUCCESS' | 'EVENT'>('INFO');
  const [annPinned, setAnnPinned] = useState(false);
  const [annExpires, setAnnExpires] = useState('');

  // Feedback filter
  const [feedbackFilter, setFeedbackFilter] = useState<string>('ALL');

  const navigate = useNavigate();

  useEffect(() => {
    const u = getCurrentUser();
    if (!u || u.role !== UserRole.ADMIN) {
      navigate('/');
      return;
    }
    setAdmin(u);
  }, [navigate]);

  const refreshData = useCallback(
    async (initial = false) => {
      try {
        if (initial) {
          setInitializing(true);
        }
        
        // Fetch in parallel but handle individual errors
        const [usersResult, redeemResult, settingsResult, questionsResult, announcementsResult, feedbackResult] = await Promise.allSettled([
          fetchUsers(),
          fetchRedeemRequests(),
          fetchSettings(),
          fetchCustomQuestions(),
          fetchAnnouncements(),
          fetchFeedback()
        ]);

        // Process users
        if (usersResult.status === 'fulfilled') {
          console.log('Users fetched:', usersResult.value);
          setUsers(usersResult.value || []);
        } else {
          console.error('Failed to fetch users:', usersResult.reason);
          setUsers([]);
        }

        // Process redeems
        if (redeemResult.status === 'fulfilled') {
          setRedeems(redeemResult.value || []);
        } else {
          console.error('Failed to fetch redeems:', redeemResult.reason);
          setRedeems([]);
        }

        // Process settings
        if (settingsResult.status === 'fulfilled') {
          setSettings(settingsResult.value || DEFAULT_SETTINGS);
        } else {
          console.error('Failed to fetch settings:', settingsResult.reason);
        }

        // Process questions
        if (questionsResult.status === 'fulfilled') {
          setCustomQuestions(questionsResult.value || []);
        } else {
          console.error('Failed to fetch questions:', questionsResult.reason);
          setCustomQuestions([]);
        }

        // Process announcements
        if (announcementsResult.status === 'fulfilled') {
          setAnnouncements(announcementsResult.value || []);
        } else {
          console.error('Failed to fetch announcements:', announcementsResult.reason);
          setAnnouncements([]);
        }

        // Process feedback
        if (feedbackResult.status === 'fulfilled') {
          setFeedbackList(feedbackResult.value || []);
        } else {
          console.error('Failed to fetch feedback:', feedbackResult.reason);
          setFeedbackList([]);
        }

        setError(null);
      } catch (err) {
        console.error('Admin refresh error:', err);
        setError('Failed to load admin data. Please retry.');
      } finally {
        if (initial) {
          setInitializing(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    if (admin) {
      refreshData(true);
    }
  }, [admin, refreshData]);

  const runAction = async (action: () => Promise<void>) => {
    setIsWorking(true);
    try {
      await action();
      await refreshData();
    } catch (err) {
      console.error('Admin action error:', err);
      alert('Action failed. Please try again.');
    } finally {
      setIsWorking(false);
    }
  };

  const handleRedeemAction = (id: string, status: 'APPROVED' | 'REJECTED') => {
    runAction(async () => {
      await updateRedeemRequestApi(id, status);
    });
  };

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    runAction(async () => {
      await saveSettingsApi(settings);
      alert('Settings updated successfully.');
    });
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Omit<Question, 'id'> = {
      type: qType,
      questionText: qText,
      correctAnswer: qAnswer,
      options: qType === 'QUIZ' ? qOptions.split(',').map((opt) => opt.trim()).filter(Boolean) : undefined
    };
    runAction(async () => {
      await addCustomQuestionApi(payload);
      setQText('');
      setQAnswer('');
      setQOptions('');
      alert('Question added to bank.');
    });
  };

  const handleDeleteQuestion = (id: string) => {
    if (!confirm('Delete this question permanently?')) return;
    runAction(async () => {
      await deleteCustomQuestionApi(id);
    });
  };

  const handleToggleBan = (user: User) => {
    if (user.role === UserRole.ADMIN || user.id === admin?.id) return;
    const shouldBan = !user.isBanned;
    const reason = shouldBan ? prompt('Provide a reason for banning this user.', 'Policy violation') || undefined : undefined;
    runAction(async () => {
      await adminToggleUserBan(user.id, shouldBan, reason);
    });
  };

  const handleDeleteUser = (user: User) => {
    if (user.role === UserRole.ADMIN || user.id === admin?.id) return;
    if (!confirm(`Delete ${user.name}? This cannot be undone.`)) return;
    runAction(async () => {
      await adminDeleteUser(user.id);
    });
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) {
      alert('Please fill in title and content');
      return;
    }
    runAction(async () => {
      await createAnnouncementApi({
        title: annTitle.trim(),
        content: annContent.trim(),
        type: annType,
        isPinned: annPinned,
        expiresAt: annExpires ? new Date(annExpires).toISOString() : null
      });
      setAnnTitle('');
      setAnnContent('');
      setAnnType('INFO');
      setAnnPinned(false);
      setAnnExpires('');
      alert('Announcement created successfully!');
    });
  };

  const handleToggleAnnouncement = (id: string) => {
    runAction(async () => {
      await toggleAnnouncementStatusApi(id);
    });
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (!confirm('Delete this announcement permanently?')) return;
    runAction(async () => {
      await deleteAnnouncementApi(id);
    });
  };

  const handleTogglePinAnnouncement = (ann: Announcement) => {
    runAction(async () => {
      await updateAnnouncementApi(ann.id, { isPinned: !ann.isPinned });
    });
  };

  const handleUpdateFeedbackStatus = (id: string, status: string) => {
    runAction(async () => {
      await updateFeedbackApi(id, { status });
    });
  };

  const handleRespondToFeedback = (fb: Feedback) => {
    const response = prompt('Enter your response to this feedback:', fb.adminResponse || '');
    if (response === null) return;
    runAction(async () => {
      await updateFeedbackApi(fb.id, { adminResponse: response });
    });
  };

  const handleDeleteFeedback = (id: string) => {
    if (!confirm('Delete this feedback permanently?')) return;
    runAction(async () => {
      await deleteFeedbackApi(id);
    });
  };

  const filteredFeedback = feedbackFilter === 'ALL' 
    ? feedbackList 
    : feedbackList.filter(fb => fb.status === feedbackFilter);

  if (!admin || initializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-16 h-16 border-4 border-gray-200 dark:border-white/10 border-t-pakistan-green rounded-full animate-spin"></div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Loading admin controls...</p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Admin"
        description="Secure Solve2Win admin console for managing users, payouts, questions, and announcements."
        canonicalPath="/admin"
        noIndex
      />
      <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-center pb-8 border-b border-gray-200/50 dark:border-white/10 gap-4">
         <div>
            <h1 className="text-4xl font-black text-gray-800 dark:text-white">Admin Portal</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Full control over users, finance & content.</p>
         </div>
         
         <div className="flex bg-white/50 dark:bg-slate-800/50 p-1 rounded-2xl backdrop-blur-md shadow-sm border border-white/60 dark:border-white/10 flex-wrap">
           {(['DASHBOARD', 'USERS', 'QUESTIONS', 'COMMUNITY', 'SETTINGS'] as Tab[]).map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                 activeTab === tab 
                 ? 'bg-pakistan-green text-white shadow-lg' 
                 : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10'
               }`}
             >
               {tab}
             </button>
           ))}
         </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 font-medium">
          {error}
        </div>
      )}

      {isWorking && (
        <div className="flex items-center space-x-3 text-sm text-gray-500 bg-white/70 border border-gray-100 px-4 py-2 rounded-full w-fit">
          <div className="w-3 h-3 rounded-full bg-pakistan-green animate-pulse"></div>
          <span>Syncing latest data...</span>
        </div>
      )}

      {/* ---------------- DASHBOARD TAB ---------------- */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card dark:glass-card p-8 rounded-[2rem] flex items-center justify-between bg-gradient-to-br from-white/80 to-blue-50/50 dark:from-slate-800/80 dark:to-blue-900/20">
              <div>
                  <h3 className="text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Total Users</h3>
                  <p className="text-5xl font-black text-pakistan-green dark:text-green-400">{users.length}</p>
              </div>
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 text-3xl shadow-inner">👥</div>
            </div>
            <div className="glass-card dark:glass-card p-8 rounded-[2rem] flex items-center justify-between bg-gradient-to-br from-white/80 to-orange-50/50 dark:from-slate-800/80 dark:to-orange-900/20">
              <div>
                <h3 className="text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Pending</h3>
                <p className="text-5xl font-black text-orange-500">{redeems.filter(r => r.status === 'PENDING').length}</p>
              </div>
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 text-3xl shadow-inner">⏳</div>
            </div>
            <div className="glass-card dark:glass-card p-8 rounded-[2rem] flex items-center justify-between bg-gradient-to-br from-white/80 to-green-50/50 dark:from-slate-800/80 dark:to-green-900/20">
              <div>
                <h3 className="text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Total Paid</h3>
                <p className="text-5xl font-black text-green-600 dark:text-green-400">
                  Rs. {redeems.filter(r => r.status === 'APPROVED').reduce((acc, curr) => acc + curr.amountRupees, 0)}
                </p>
              </div>
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 text-3xl shadow-inner">💸</div>
            </div>
          </div>

          {/* Redeem Requests Table */}
          <div className="glass-card dark:glass-card rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/60 dark:border-white/10">
            <div className="p-8 border-b border-gray-100 dark:border-white/10 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md flex justify-between items-center">
              <h3 className="font-bold text-xl text-gray-800 dark:text-white">Redemption Requests</h3>
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase bg-white/50 dark:bg-white/10 px-3 py-1 rounded-full">{redeems.length} Records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50 dark:bg-slate-800/50 text-gray-400 dark:text-gray-500 uppercase font-black text-[10px] tracking-wider">
                  <tr>
                    <th className="p-6">Date</th>
                    <th className="p-6">User Details</th>
                    <th className="p-6">Points</th>
                    <th className="p-6">Payout</th>
                    <th className="p-6">Status</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/10 bg-white/30 dark:bg-slate-800/30">
                  {redeems.length === 0 ? (
                    <tr><td colSpan={6} className="p-16 text-center text-gray-400 dark:text-gray-500 font-medium">No requests found yet.</td></tr>
                  ) : (
                    redeems.map(req => (
                      <tr key={req.id} className="hover:bg-white/60 dark:hover:bg-white/5 transition-colors group">
                        <td className="p-6 font-mono text-gray-500 dark:text-gray-400">{req.date}</td>
                        <td className="p-6">
                          <div className="font-bold text-gray-800 dark:text-white text-base">{req.userEmail}</div>
                          <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-mono mt-1 opacity-60 group-hover:opacity-100 transition-opacity">ID: {req.userId.substring(0,8)}...</div>
                        </td>
                        <td className="p-6 font-mono font-bold text-gray-600 dark:text-gray-300">{req.amountPoints.toLocaleString()}</td>
                        <td className="p-6">
                            <span className="font-black text-green-600 dark:text-green-400 text-lg">Rs. {req.amountRupees}</span>
                        </td>
                        <td className="p-6">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide border shadow-sm ${
                            req.status === 'PENDING' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                            req.status === 'APPROVED' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          {req.status === 'PENDING' && (
                            <div className="flex justify-end space-x-3">
                              <button onClick={() => handleRedeemAction(req.id, 'APPROVED')} className="text-white bg-green-500 hover:bg-green-600 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-green-500/30 transform hover:-translate-y-0.5">Approve</button>
                              <button onClick={() => handleRedeemAction(req.id, 'REJECTED')} className="text-red-500 bg-white border border-red-100 hover:bg-red-50 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5">Reject</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- USERS TAB ---------------- */}
      {activeTab === 'USERS' && (
        <div className="space-y-6">
          <div className="glass-card dark:glass-card rounded-[2.5rem] overflow-hidden border border-white/60 dark:border-white/10">
            <div className="p-8 border-b border-gray-100 dark:border-white/10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xl text-gray-800 dark:text-white">User Directory</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Ban or delete suspicious accounts instantly.</p>
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 bg-white/70 dark:bg-white/10 px-3 py-1 rounded-full">{users.length} users</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/60 dark:bg-slate-800/60 text-gray-500 dark:text-gray-400 uppercase font-black text-[10px] tracking-wider">
                  <tr>
                    <th className="p-5">User</th>
                    <th className="p-5">Role</th>
                    <th className="p-5 text-right">Points</th>
                    <th className="p-5 text-right">Wallet</th>
                    <th className="p-5 text-right">Solved</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/10 bg-white/40 dark:bg-slate-800/40">
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-10 text-center text-gray-400 dark:text-gray-500">No users found.</td>
                    </tr>
                  )}
                  {users.map((user) => {
                    const disableActions = user.role === UserRole.ADMIN || user.id === admin.id;
                    return (
                      <tr key={user.id} className="hover:bg-white/60 dark:hover:bg-white/5">
                        <td className="p-5">
                          <div className="font-bold text-gray-800 dark:text-white">{user.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            user.role === UserRole.ADMIN ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <span className="font-bold text-pakistan-green dark:text-green-400">{(user.points || 0).toLocaleString()}</span>
                        </td>
                        <td className="p-5 text-right">
                          <span className="font-bold text-pakistan-accent dark:text-green-400">Rs.{(user.walletBalance || 0).toFixed(2)}</span>
                        </td>
                        <td className="p-5 text-right">
                          <span className="font-mono text-gray-600 dark:text-gray-400">{(user.solvedCount || 0).toLocaleString()}</span>
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest ${
                            user.isBanned ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            {user.isBanned ? 'Banned' : 'Active'}
                          </span>
                          {user.isBanned && user.banReason && (
                            <div className="text-[10px] text-red-400 mt-1">{user.banReason}</div>
                          )}
                        </td>
                        <td className="p-5 text-right space-x-2">
                          <button
                            onClick={() => handleToggleBan(user)}
                            disabled={disableActions}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                              disableActions
                                ? 'bg-gray-100 text-gray-400 border-gray-100 dark:bg-slate-800 dark:text-gray-600 dark:border-slate-700 cursor-not-allowed'
                                : user.isBanned
                                  ? 'bg-white text-green-600 border-green-200 hover:bg-green-50 dark:bg-slate-800 dark:text-green-400 dark:border-green-900 dark:hover:bg-green-900/20'
                                  : 'bg-white text-red-500 border-red-200 hover:bg-red-50 dark:bg-slate-800 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-900/20'
                            }`}
                          >
                            {user.isBanned ? 'Unban' : 'Ban'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            disabled={disableActions}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                              disableActions
                                ? 'bg-gray-100 text-gray-400 border-gray-100 dark:bg-slate-800 dark:text-gray-600 dark:border-slate-700 cursor-not-allowed'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-slate-800 dark:text-gray-400 dark:border-slate-700 dark:hover:bg-slate-700'
                            }`}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SETTINGS TAB ---------------- */}
      {activeTab === 'SETTINGS' && (
        <div className="glass-card dark:glass-card p-10 rounded-[2.5rem]">
           <div className="flex items-center mb-8">
             <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-2xl mr-4 shadow-sm">⚙️</div>
             <div>
               <h3 className="text-2xl font-black text-gray-800 dark:text-white">Platform Configuration</h3>
               <p className="text-gray-500 dark:text-gray-400 text-sm">Manage global variables and logic.</p>
             </div>
           </div>

           <form onSubmit={handleSettingsSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-2">
               <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Points Per Question</label>
               <input 
                 type="number" 
                 className="glass-input dark:glass-input w-full p-4 rounded-xl text-lg font-bold dark:text-white dark:bg-slate-800/50"
                 value={settings.pointsPerQuestion}
                 onChange={e => setSettings({...settings, pointsPerQuestion: Number(e.target.value)})}
               />
               <p className="text-xs text-gray-400 dark:text-gray-500">Amount awarded for each correct answer.</p>
             </div>

             <div className="space-y-2">
               <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Minimum Redeem Points</label>
               <input 
                 type="number" 
                 className="glass-input dark:glass-input w-full p-4 rounded-xl text-lg font-bold dark:text-white dark:bg-slate-800/50"
                 value={settings.minRedeemPoints}
                 onChange={e => setSettings({...settings, minRedeemPoints: Number(e.target.value)})}
               />
               <p className="text-xs text-gray-400 dark:text-gray-500">Threshold for users to request withdrawal.</p>
             </div>

             <div className="space-y-2">
               <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Exchange Rate (PKR per 10k Pts)</label>
               <input 
                 type="number" 
                 className="glass-input dark:glass-input w-full p-4 rounded-xl text-lg font-bold dark:text-white dark:bg-slate-800/50"
                 value={settings.currencyRate}
                 onChange={e => setSettings({...settings, currencyRate: Number(e.target.value)})}
               />
               <p className="text-xs text-gray-400 dark:text-gray-500">Value of 10,000 points in Pakistani Rupees.</p>
             </div>

             <div className="md:col-span-2 pt-4">
               <button type="submit" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-black dark:hover:bg-gray-200 transition-all">Save Configuration</button>
             </div>
           </form>
        </div>
      )}

      {/* ---------------- QUESTIONS TAB ---------------- */}
      {activeTab === 'QUESTIONS' && (
        <div className="space-y-8">
           {/* Add Question Form */}
           <div className="glass-card dark:glass-card p-10 rounded-[2.5rem]">
             <div className="flex items-center mb-8">
               <div className="w-12 h-12 bg-pakistan-green/10 dark:bg-green-900/30 text-pakistan-green dark:text-green-400 rounded-full flex items-center justify-center text-2xl mr-4 border border-pakistan-green/20 dark:border-green-500/20">📝</div>
               <div>
                 <h3 className="text-2xl font-black text-gray-800 dark:text-white">Add Custom Question</h3>
                 <p className="text-gray-500 dark:text-gray-400 text-sm">Manually insert questions into the game pool.</p>
               </div>
             </div>

             <form onSubmit={handleAddQuestion} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Category</label>
                     <select 
                        className="glass-input dark:glass-input w-full p-4 rounded-xl font-bold dark:text-white dark:bg-slate-800/50"
                        value={qType}
                        onChange={e => setQType(e.target.value as any)}
                     >
                        <option value="MATH">Math</option>
                        <option value="QUIZ">Quiz</option>
                        <option value="PUZZLE">Puzzle</option>
                        <option value="TYPING">Typing</option>
                        <option value="CAPTCHA">Captcha</option>
                     </select>
                   </div>
                   <div className="space-y-2">
                     <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Correct Answer</label>
                     <input 
                       type="text" 
                       className="glass-input dark:glass-input w-full p-4 rounded-xl font-medium dark:text-white dark:bg-slate-800/50"
                       placeholder="e.g. 42"
                       value={qAnswer}
                       onChange={e => setQAnswer(e.target.value)}
                       required
                     />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Question Text</label>
                   <textarea 
                     className="glass-input dark:glass-input w-full p-4 rounded-xl font-medium h-32 dark:text-white dark:bg-slate-800/50"
                     placeholder="Type your question here..."
                     value={qText}
                     onChange={e => setQText(e.target.value)}
                     required
                   />
                </div>

                {qType === 'QUIZ' && (
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Options (Comma Separated)</label>
                    <input 
                      type="text" 
                      className="glass-input dark:glass-input w-full p-4 rounded-xl font-medium dark:text-white dark:bg-slate-800/50"
                      placeholder="Option A, Option B, Option C, Option D"
                      value={qOptions}
                      onChange={e => setQOptions(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-400 dark:text-gray-500">Ensure the correct answer is exactly one of these options.</p>
                  </div>
                )}

                <button type="submit" className="w-full bg-gradient-to-r from-pakistan-green to-pakistan-lightgreen dark:from-green-700 dark:to-green-900 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-green-500/30 transition-all">
                  Add to Question Bank
                </button>
             </form>
           </div>

           {/* Questions List */}
           <div className="glass-card dark:glass-card rounded-[2.5rem] overflow-hidden shadow-xl border border-white/60 dark:border-white/10">
             <div className="p-8 border-b border-gray-100 dark:border-white/10 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md">
                <h3 className="font-bold text-xl text-gray-800 dark:text-white">Custom Questions Library ({customQuestions.length})</h3>
             </div>
             <div className="max-h-[500px] overflow-y-auto">
               <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50/50 dark:bg-slate-800/50 text-gray-400 dark:text-gray-500 uppercase font-black text-[10px] tracking-wider sticky top-0 backdrop-blur-md">
                   <tr>
                     <th className="p-6">Type</th>
                     <th className="p-6 w-1/2">Question</th>
                     <th className="p-6">Answer</th>
                     <th className="p-6 text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 dark:divide-white/10 bg-white/30 dark:bg-slate-800/30">
                    {customQuestions.map(q => (
                      <tr key={q.id} className="hover:bg-white/60 dark:hover:bg-white/5">
                         <td className="p-6">
                           <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded-md text-[10px] font-bold uppercase dark:text-gray-300">{q.type}</span>
                         </td>
                         <td className="p-6 text-gray-800 dark:text-gray-200 font-medium">{q.questionText}</td>
                         <td className="p-6 text-green-700 dark:text-green-400 font-bold">{q.correctAnswer}</td>
                         <td className="p-6 text-right">
                           <button onClick={() => handleDeleteQuestion(q.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors">🗑️</button>
                         </td>
                      </tr>
                    ))}
                    {customQuestions.length === 0 && (
                      <tr><td colSpan={4} className="p-10 text-center text-gray-400 dark:text-gray-500">No custom questions added yet.</td></tr>
                    )}
                 </tbody>
               </table>
             </div>
           </div>
        </div>
      )}

      {/* ---------------- COMMUNITY HUB TAB ---------------- */}
      {activeTab === 'COMMUNITY' && (
        <div className="space-y-8">
          {/* Create Announcement Form */}
          <div className="glass-card dark:glass-card p-10 rounded-[2.5rem]">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-2xl mr-4 border border-purple-200 dark:border-purple-500/20">📢</div>
              <div>
                <h3 className="text-2xl font-black text-gray-800 dark:text-white">Create Announcement</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Broadcast important messages to all users.</p>
              </div>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Title</label>
                  <input
                    type="text"
                    className="glass-input dark:glass-input w-full p-4 rounded-xl font-medium dark:text-white dark:bg-slate-800/50"
                    placeholder="Announcement title..."
                    value={annTitle}
                    onChange={e => setAnnTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Type</label>
                  <select
                    className="glass-input dark:glass-input w-full p-4 rounded-xl font-bold dark:text-white dark:bg-slate-800/50"
                    value={annType}
                    onChange={e => setAnnType(e.target.value as any)}
                  >
                    <option value="INFO">ℹ️ Info</option>
                    <option value="SUCCESS">✅ Success</option>
                    <option value="WARNING">⚠️ Warning</option>
                    <option value="EVENT">🎉 Event</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Content</label>
                <textarea
                  className="glass-input dark:glass-input w-full p-4 rounded-xl font-medium h-32 dark:text-white dark:bg-slate-800/50"
                  placeholder="Write your announcement message here..."
                  value={annContent}
                  onChange={e => setAnnContent(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Expires At (Optional)</label>
                  <input
                    type="datetime-local"
                    className="glass-input dark:glass-input w-full p-4 rounded-xl font-medium dark:text-white dark:bg-slate-800/50"
                    value={annExpires}
                    onChange={e => setAnnExpires(e.target.value)}
                  />
                  <p className="text-xs text-gray-400 dark:text-gray-500">Leave empty for no expiration.</p>
                </div>
                <div className="flex items-center space-x-4 pt-6">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={annPinned}
                      onChange={e => setAnnPinned(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:bg-slate-800 dark:border-slate-600"
                    />
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">📌 Pin to top</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all">
                Publish Announcement
              </button>
            </form>
          </div>

          {/* Announcements List */}
          <div className="glass-card dark:glass-card rounded-[2.5rem] overflow-hidden shadow-xl border border-white/60 dark:border-white/10">
            <div className="p-8 border-b border-gray-100 dark:border-white/10 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xl text-gray-800 dark:text-white">All Announcements</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Manage active and inactive announcements.</p>
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 bg-white/70 dark:bg-white/10 px-3 py-1 rounded-full">{announcements.length} total</span>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {announcements.length === 0 ? (
                <div className="p-16 text-center text-gray-400 dark:text-gray-500 font-medium">
                  <div className="text-5xl mb-4">📭</div>
                  <p>No announcements yet. Create your first one above!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-white/10">
                  {announcements.map(ann => (
                    <div key={ann.id} className={`p-6 hover:bg-white/60 dark:hover:bg-white/5 transition-colors ${!ann.isActive ? 'opacity-50' : ''}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            {ann.isPinned && (
                              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-[10px] font-black uppercase rounded-md">📌 Pinned</span>
                            )}
                            <span className={`px-2 py-1 text-[10px] font-black uppercase rounded-md ${
                              ann.type === 'INFO' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                              ann.type === 'SUCCESS' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                              ann.type === 'WARNING' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                              'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                            }`}>
                              {ann.type === 'INFO' ? 'ℹ️' : ann.type === 'SUCCESS' ? '✅' : ann.type === 'WARNING' ? '⚠️' : '🎉'} {ann.type}
                            </span>
                            <span className={`px-2 py-1 text-[10px] font-black uppercase rounded-md ${
                              ann.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                            }`}>
                              {ann.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-1">{ann.title}</h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{ann.content}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                            <span>Created: {new Date(ann.createdAt).toLocaleDateString()}</span>
                            {ann.expiresAt && (
                              <span>Expires: {new Date(ann.expiresAt).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleTogglePinAnnouncement(ann)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                              ann.isPinned
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900 dark:hover:bg-yellow-900/30'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-slate-800 dark:text-gray-400 dark:border-slate-700 dark:hover:bg-slate-700'
                            }`}
                            title={ann.isPinned ? 'Unpin' : 'Pin'}
                          >
                            📌
                          </button>
                          <button
                            onClick={() => handleToggleAnnouncement(ann.id)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                              ann.isActive
                                ? 'bg-white text-orange-600 border-orange-200 hover:bg-orange-50 dark:bg-slate-800 dark:text-orange-400 dark:border-orange-900 dark:hover:bg-orange-900/20'
                                : 'bg-white text-green-600 border-green-200 hover:bg-green-50 dark:bg-slate-800 dark:text-green-400 dark:border-green-900 dark:hover:bg-green-900/20'
                            }`}
                            title={ann.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {ann.isActive ? '⏸️' : '▶️'}
                          </button>
                          <button
                            onClick={() => handleDeleteAnnouncement(ann.id)}
                            className="px-3 py-2 rounded-lg text-xs font-bold border bg-white text-red-500 border-red-200 hover:bg-red-50 dark:bg-slate-800 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-900/20 transition-all"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* User Feedback Section */}
          <div className="glass-card dark:glass-card rounded-[2.5rem] overflow-hidden shadow-xl border border-white/60 dark:border-white/10">
            <div className="p-8 border-b border-gray-100 dark:border-white/10 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-xl text-gray-800 dark:text-white">💡 User Feedback</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Review and respond to user suggestions and requests.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Filter:</span>
                  <select
                    className="glass-input dark:glass-input px-4 py-2 rounded-lg text-sm font-bold dark:text-white dark:bg-slate-800/50"
                    value={feedbackFilter}
                    onChange={e => setFeedbackFilter(e.target.value)}
                  >
                    <option value="ALL">All ({feedbackList.length})</option>
                    <option value="PENDING">Pending ({feedbackList.filter(f => f.status === 'PENDING').length})</option>
                    <option value="REVIEWED">Reviewed ({feedbackList.filter(f => f.status === 'REVIEWED').length})</option>
                    <option value="IMPLEMENTED">Implemented ({feedbackList.filter(f => f.status === 'IMPLEMENTED').length})</option>
                    <option value="DECLINED">Declined ({feedbackList.filter(f => f.status === 'DECLINED').length})</option>
                  </select>
                </div>
              </div>
            </div>
            
            {filteredFeedback.length === 0 ? (
              <div className="p-16 text-center text-gray-400 dark:text-gray-500">
                <div className="text-5xl mb-4">📭</div>
                <p>No feedback to display.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-white/10 max-h-[600px] overflow-y-auto">
                {filteredFeedback.map(fb => (
                  <div key={fb.id} className="p-6 hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className={`px-2 py-1 text-[10px] font-black uppercase rounded-md ${
                            fb.type === 'SUGGESTION' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                            fb.type === 'FEATURE_REQUEST' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                            fb.type === 'BUG_REPORT' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {fb.type === 'SUGGESTION' ? '💡' : fb.type === 'FEATURE_REQUEST' ? '🚀' : fb.type === 'BUG_REPORT' ? '🐛' : '💬'} {fb.type.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 text-[10px] font-black uppercase rounded-md ${
                            fb.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            fb.status === 'REVIEWED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                            fb.status === 'IMPLEMENTED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {fb.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-800 dark:text-white mb-1">{fb.title}</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{fb.content}</p>
                        
                        {fb.adminResponse && (
                          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">💬 Your Response:</div>
                            <p className="text-blue-800 dark:text-blue-200 text-sm">{fb.adminResponse}</p>
                          </div>
                        )}
                        
                        <div className="mt-3 flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                          <span>From: <strong className="text-gray-600 dark:text-gray-400">{fb.userName}</strong> ({fb.userEmail})</span>
                          <span>•</span>
                          <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <select
                          className="px-3 py-2 rounded-lg text-xs font-bold border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white"
                          value={fb.status}
                          onChange={e => handleUpdateFeedbackStatus(fb.id, e.target.value)}
                        >
                          <option value="PENDING">⏳ Pending</option>
                          <option value="REVIEWED">👀 Reviewed</option>
                          <option value="IMPLEMENTED">✅ Implemented</option>
                          <option value="DECLINED">❌ Declined</option>
                        </select>
                        <button
                          onClick={() => handleRespondToFeedback(fb)}
                          className="px-3 py-2 rounded-lg text-xs font-bold border bg-white text-blue-600 border-blue-200 hover:bg-blue-50 dark:bg-slate-800 dark:text-blue-400 dark:border-blue-900 dark:hover:bg-blue-900/20 transition-all"
                          title="Respond"
                        >
                          💬 Respond
                        </button>
                        <button
                          onClick={() => handleDeleteFeedback(fb.id)}
                          className="px-3 py-2 rounded-lg text-xs font-bold border bg-white text-red-500 border-red-200 hover:bg-red-50 dark:bg-slate-800 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-900/20 transition-all"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </>
  );
};