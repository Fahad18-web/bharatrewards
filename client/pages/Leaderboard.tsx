import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getLeaderboardEntries } from '../services/storageService';
import { LeaderboardEntry, User } from '../types';
import SEO from '../components/SEO';

const medalColors = ['from-yellow-300 to-amber-500', 'from-gray-200 to-gray-400', 'from-orange-200 to-orange-400'];

export const Leaderboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    setUser(currentUser);
    loadLeaderboard();
  }, [navigate]);

  const loadLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeaderboardEntries(50);
      setEntries(data);
    } catch (err) {
      console.error('Failed to load leaderboard', err);
      setError('Unable to load leaderboard right now. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const topThree = useMemo(() => entries.slice(0, 3), [entries]);
  const others = useMemo(() => entries.slice(3), [entries]);
  const userRank = useMemo(() => entries.find((e) => e.id === user?.id)?.rank, [entries, user?.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-3xl font-black text-gray-800 dark:text-white">Leaderboard</h1>
        <p className="text-gray-500 dark:text-gray-400">{error}</p>
        <button
          onClick={loadLeaderboard}
          className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <SEO title="Leaderboard" description="See who is topping the Solve2Win charts." canonicalPath="/leaderboard" />
      <div className="space-y-10 pb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-gray-200/60 dark:border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-black text-gray-800 dark:text-white mb-2">🏆 Leaderboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Top performers across Solve2Win.</p>
          </div>
          <div className="glass-card dark:glass-card rounded-2xl px-6 py-4 flex items-center gap-4 border border-white/60 dark:border-slate-700">
            <div className="text-3xl">🔥</div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">Your Rank</p>
              {userRank ? (
                <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">#{userRank}</p>
              ) : (
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Not in top 50 yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Top 3 podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topThree.map((entry, idx) => (
            <div
              key={entry.id}
              className={`relative overflow-hidden rounded-[1.75rem] p-6 shadow-xl border border-white/60 dark:border-slate-700 bg-gradient-to-br ${medalColors[idx]} text-gray-900`}
            >
              <div className="absolute inset-0 bg-white/25 mix-blend-soft-light"></div>
              <div className="relative space-y-3">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/70 text-xs font-black uppercase tracking-wide">Rank #{entry.rank}</div>
                <div className="text-3xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</div>
                <h3 className="text-2xl font-black leading-tight">{entry.name || 'Mystery Player'}</h3>
                <p className="text-sm font-semibold text-gray-700">{entry.points.toLocaleString()} pts</p>
                <p className="text-xs font-bold text-gray-700/80 uppercase tracking-wide">{entry.solvedCount ?? 0} solved</p>
              </div>
            </div>
          ))}
        </div>

        {/* Full table */}
        <div className="glass-card dark:glass-card rounded-[1.75rem] border border-white/60 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-black text-gray-800 dark:text-white">Top Players</h2>
            <button
              onClick={loadLeaderboard}
              className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Refresh
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 border-y border-white/50 dark:border-white/10">
                  <th className="px-6 py-3">Rank</th>
                  <th className="px-6 py-3">Player</th>
                  <th className="px-6 py-3">Points</th>
                  <th className="px-6 py-3 hidden sm:table-cell">Solved</th>
                </tr>
              </thead>
              <tbody>
                {others.length === 0 && topThree.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      No leaderboard data available yet.
                    </td>
                  </tr>
                )}
                {[...topThree, ...others].map((entry) => (
                  <tr
                    key={entry.id}
                    className={`border-b border-white/40 dark:border-white/5 ${entry.id === user?.id ? 'bg-indigo-50/80 dark:bg-indigo-900/20' : 'bg-white/30 dark:bg-slate-800/40'}`}
                  >
                    <td className="px-6 py-4 font-black text-gray-800 dark:text-white">#{entry.rank}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800 dark:text-white">{entry.name || 'Mystery Player'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">ID: {entry.id.slice(0, 6)}...</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{entry.points.toLocaleString()}</td>
                    <td className="px-6 py-4 hidden sm:table-cell text-sm text-gray-700 dark:text-gray-300">{entry.solvedCount ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
