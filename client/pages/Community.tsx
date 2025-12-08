import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/storageService';
import {
  getAnnouncements,
  getUserFeedback,
  submitFeedback
} from '../services/apiService';
import { User, Announcement, Feedback } from '../types';
import SEO from '../components/SEO';

type FeedbackType = 'SUGGESTION' | 'FEATURE_REQUEST' | 'BUG_REPORT' | 'OTHER';

export const Community: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [myFeedback, setMyFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<'announcements' | 'feedback'>('announcements');

  // Feedback form
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('SUGGESTION');
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackContent, setFeedbackContent] = useState('');
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    setUser(currentUser);
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [announcementsData, feedbackData] = await Promise.all([
        getAnnouncements(),
        getUserFeedback()
      ]);
      setAnnouncements(announcementsData);
      setMyFeedback(feedbackData);
    } catch (error) {
      console.error('Failed to load community data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackTitle.trim() || !feedbackContent.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await submitFeedback({
        type: feedbackType,
        title: feedbackTitle.trim(),
        content: feedbackContent.trim()
      });
      alert('Thank you! Your feedback has been submitted.');
      setFeedbackTitle('');
      setFeedbackContent('');
      setFeedbackType('SUGGESTION');
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'INFO': return 'ℹ️';
      case 'SUCCESS': return '✅';
      case 'WARNING': return '⚠️';
      case 'EVENT': return '🎉';
      default: return '📢';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'INFO': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'SUCCESS': return 'bg-green-100 text-green-700 border-green-200';
      case 'WARNING': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'EVENT': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getFeedbackTypeIcon = (type: string) => {
    switch (type) {
      case 'SUGGESTION': return '💡';
      case 'FEATURE_REQUEST': return '🚀';
      case 'BUG_REPORT': return '🐛';
      case 'OTHER': return '💬';
      default: return '📝';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">⏳ Pending</span>;
      case 'REVIEWED':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">👀 Reviewed</span>;
      case 'IMPLEMENTED':
        return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">✅ Implemented</span>;
      case 'DECLINED':
        return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">❌ Declined</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-purple-500 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading community hub...</p>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Community" 
        description="Stay updated with latest announcements and share your feedback with the Solve2Win community."
      />
      <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="text-center pb-8 border-b border-gray-200/50 dark:border-white/10">
        <h1 className="text-4xl font-black text-gray-800 dark:text-white mb-2">🌟 Community Hub</h1>
        <p className="text-gray-500 dark:text-gray-400">Stay updated & share your ideas with us!</p>
      </div>

      {/* Section Tabs */}
      <div className="flex justify-center">
        <div className="flex bg-white/50 dark:bg-slate-800/50 p-1 rounded-2xl backdrop-blur-md shadow-sm border border-white/60 dark:border-white/10">
          <button
            onClick={() => setActiveSection('announcements')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
              activeSection === 'announcements'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10'
            }`}
          >
            📢 Announcements
          </button>
          <button
            onClick={() => setActiveSection('feedback')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
              activeSection === 'feedback'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10'
            }`}
          >
            💡 Feedback & Ideas
          </button>
        </div>
      </div>

      {/* Announcements Section */}
      {activeSection === 'announcements' && (
        <div className="space-y-6 animate-fade-in-up">
          {announcements.length === 0 ? (
            <div className="glass-card dark:glass-card p-16 rounded-[2rem] text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-gray-700 dark:text-white mb-2">No Announcements Yet</h3>
              <p className="text-gray-500 dark:text-gray-400">Check back later for updates from the team!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`glass-card dark:glass-card p-6 rounded-2xl border-l-4 ${
                    ann.type === 'INFO' ? 'border-l-blue-500' :
                    ann.type === 'SUCCESS' ? 'border-l-green-500' :
                    ann.type === 'WARNING' ? 'border-l-orange-500' :
                    'border-l-purple-500'
                  } hover:shadow-xl transition-all`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${getTypeColor(ann.type)}`}>
                      {getTypeIcon(ann.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        {ann.isPinned && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-black uppercase rounded-md">📌 Pinned</span>
                        )}
                        <span className={`px-2 py-1 text-[10px] font-black uppercase rounded-md border ${getTypeColor(ann.type)}`}>
                          {ann.type}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">{ann.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{ann.content}</p>
                      <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">
                        Posted on {new Date(ann.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Feedback Section */}
      {activeSection === 'feedback' && (
        <div className="space-y-8 animate-fade-in-up">
          {/* Submit Feedback CTA */}
          {!showForm ? (
            <div className="glass-card dark:glass-card p-8 rounded-[2rem] bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-100 dark:border-purple-900/30">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-2xl flex items-center justify-center text-3xl">💡</div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 dark:text-white">Got an idea?</h3>
                    <p className="text-gray-500 dark:text-gray-400">We'd love to hear your suggestions and feature requests!</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all transform hover:-translate-y-1"
                >
                  Share Your Ideas ✨
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card dark:glass-card p-8 rounded-[2rem]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center text-2xl">📝</div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 dark:text-white">Submit Feedback</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Help us improve the platform!</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitFeedback} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(['SUGGESTION', 'FEATURE_REQUEST', 'BUG_REPORT', 'OTHER'] as FeedbackType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFeedbackType(type)}
                        className={`p-4 rounded-xl border-2 transition-all text-center ${
                          feedbackType === type
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                            : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        <div className="text-2xl mb-1">{getFeedbackTypeIcon(type)}</div>
                        <div className="text-xs font-bold">{type.replace('_', ' ')}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Title</label>
                  <input
                    type="text"
                    className="glass-input dark:glass-input w-full p-4 rounded-xl font-medium text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Brief summary of your idea..."
                    value={feedbackTitle}
                    onChange={(e) => setFeedbackTitle(e.target.value)}
                    required
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Details</label>
                  <textarea
                    className="glass-input dark:glass-input w-full p-4 rounded-xl font-medium h-40 resize-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Describe your suggestion, feature request, or issue in detail..."
                    value={feedbackContent}
                    onChange={(e) => setFeedbackContent(e.target.value)}
                    required
                    maxLength={2000}
                  />
                  <p className="text-xs text-gray-400 text-right">{feedbackContent.length}/2000</p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Feedback 🚀'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* My Feedback History */}
          <div className="glass-card dark:glass-card rounded-[2rem] overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-white/10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white">Your Submissions</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Track the status of your feedback</p>
            </div>

            {myFeedback.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-5xl mb-4">📬</div>
                <p className="text-gray-500 dark:text-gray-400">You haven't submitted any feedback yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-white/10">
                {myFeedback.map((fb) => (
                  <div key={fb.id} className="p-6 hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-xl">
                        {getFeedbackTypeIcon(fb.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-[10px] font-black uppercase rounded-md">
                            {fb.type.replace('_', ' ')}
                          </span>
                          {getStatusBadge(fb.status)}
                        </div>
                        <h4 className="font-bold text-gray-800 dark:text-white mb-1">{fb.title}</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{fb.content}</p>
                        
                        {fb.adminResponse && (
                          <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">💬 Admin Response:</div>
                            <p className="text-blue-800 dark:text-blue-200 text-sm">{fb.adminResponse}</p>
                          </div>
                        )}
                        
                        <div className="mt-3 text-xs text-gray-400 dark:text-gray-500">
                          Submitted on {new Date(fb.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
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
