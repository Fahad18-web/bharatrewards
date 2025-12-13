// API Service for Solve2Win Frontend
// Replaces localStorage with Supabase backend API calls

import { User, UserRole, RedeemRequest, AppSettings, Question, Announcement, Feedback, LeaderboardEntry } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Token management
const TOKEN_KEY = 'bharatrewards_token';
const USER_KEY = 'bharatrewards_user';

const getSessionStorage = (): Storage | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

const getLocalStorage = (): Storage | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const AUTH_STORAGE = getSessionStorage();
const LEGACY_AUTH_STORAGE = getLocalStorage();

const clearLegacyAuthStorage = (): void => {
  if (!LEGACY_AUTH_STORAGE) return;
  // If older builds stored auth in localStorage, remove it to enforce non-persistent sessions.
  LEGACY_AUTH_STORAGE.removeItem(TOKEN_KEY);
  LEGACY_AUTH_STORAGE.removeItem(USER_KEY);
};

// Enforce non-persistent sessions even after upgrading from older builds.
clearLegacyAuthStorage();

// Simple in-memory cache for API responses
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const apiCache = new Map<string, CacheEntry<unknown>>();

const getCachedData = <T>(key: string): T | null => {
  const entry = apiCache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  
  if (Date.now() - entry.timestamp > entry.ttl) {
    apiCache.delete(key);
    return null;
  }
  
  return entry.data;
};

const setCachedData = <T>(key: string, data: T, ttlMs: number = 60000): void => {
  apiCache.set(key, { data, timestamp: Date.now(), ttl: ttlMs });
};

export const clearApiCache = (): void => {
  apiCache.clear();
};

const getToken = (): string | null => {
  return AUTH_STORAGE?.getItem(TOKEN_KEY) ?? null;
};

const setToken = (token: string): void => {
  AUTH_STORAGE?.setItem(TOKEN_KEY, token);
};

const removeToken = (): void => {
  AUTH_STORAGE?.removeItem(TOKEN_KEY);
  AUTH_STORAGE?.removeItem(USER_KEY);
  clearApiCache();
};

const setUserCache = (user: User): void => {
  AUTH_STORAGE?.setItem(USER_KEY, JSON.stringify(user));
};

// API helper function with optional caching
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  cacheKey?: string,
  cacheTtl?: number
): Promise<T> => {
  // Check cache for GET requests
  if (cacheKey && (!options.method || options.method === 'GET')) {
    const cached = getCachedData<T>(cacheKey);
    if (cached) return cached;
  }

  const token = getToken();

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  // Cache the response if cacheKey provided
  if (cacheKey && (!options.method || options.method === 'GET')) {
    setCachedData(cacheKey, data, cacheTtl);
  }

  return data;
};

// ============================================
// AUTH API
// ============================================

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: UserRole = UserRole.USER
): Promise<User> => {
  const { user, token } = await apiRequest<{ user: User; token: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
  });

  setToken(token);
  setUserCache(user);
  return user;
};

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const { user, token } = await apiRequest<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setToken(token);
    setUserCache(user);
    return user;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    removeToken();
  }
};

export const getCurrentUser = (): User | null => {
  // First check local cache for quick response
  const cached = AUTH_STORAGE?.getItem(USER_KEY) ?? null;
  if (cached) {
    return JSON.parse(cached);
  }
  return null;
};

export const refreshCurrentUser = async (): Promise<User | null> => {
  try {
    const { user } = await apiRequest<{ user: User }>('/auth/me');
    setUserCache(user);
    return user;
  } catch (error) {
    console.error('Refresh user error:', error);
    removeToken();
    return null;
  }
};

// ============================================
// USER API
// ============================================

export const getUsers = async (): Promise<User[]> => {
  try {
    console.log('Fetching users from /admin/users...');
    const response = await apiRequest<{ users: User[] }>('/admin/users');
    console.log('Users response:', response);
    return response.users || [];
  } catch (error) {
    console.error('Get users error:', error);
    return [];
  }
};

export const saveUser = async (user: User): Promise<User> => {
  try {
    const { user: updatedUser } = await apiRequest<{ user: User }>(`/users/${user.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }),
    });
    
    // Update cache if it's the current user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === user.id) {
      setUserCache(updatedUser);
    }

    return updatedUser;
  } catch (error) {
    console.error('Save user error:', error);
    throw error;
  }
};

export const adminDeleteUser = async (userId: string): Promise<void> => {
  await apiRequest(`/admin/users/${userId}`, {
    method: 'DELETE'
  });
};

export const adminToggleUserBan = async (userId: string, ban: boolean, reason?: string): Promise<User> => {
  const { user } = await apiRequest<{ user: User }>(`/admin/users/${userId}/ban`, {
    method: 'POST',
    body: JSON.stringify({ ban, reason })
  });
  return user;
};

export const updateUserPoints = async (
  userId: string,
  pointsToAdd: number,
  incrementSolved: boolean = false
): Promise<User> => {
  const { user } = await apiRequest<{ user: User }>(`/users/${userId}/points`, {
    method: 'PUT',
    body: JSON.stringify({ pointsToAdd, incrementSolved }),
  });
  
  // Update cache
  setUserCache(user);
  return user;
};

export const getLeaderboard = async (limit: number = 50): Promise<LeaderboardEntry[]> => {
  try {
    const { leaderboard } = await apiRequest<{ leaderboard: LeaderboardEntry[] }>(
      `/users/stats/leaderboard?limit=${limit}`,
      {},
      `leaderboard-${limit}`,
      60000
    );

    return (leaderboard || []).map((entry, idx) => ({
      ...entry,
      points: Number(entry.points) || 0,
      solvedCount: entry.solvedCount ?? entry.solved_count ?? 0,
      rank: idx + 1
    }));
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return [];
  }
};

// ============================================
// SETTINGS API
// ============================================

export const getSettings = async (): Promise<AppSettings> => {
  try {
    const { settings } = await apiRequest<{ settings: AppSettings }>(
      '/settings',
      {},
      'settings',
      300000 // Cache for 5 minutes
    );
    return settings;
  } catch (error) {
    console.error('Get settings error:', error);
    // Return default settings on error
    return {
      minRedeemPoints: 15000,
      pointsPerQuestion: 10,
      currencyRate: 35,
    };
  }
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  await apiRequest('/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
  // Clear settings cache after update
  apiCache.delete('settings');
};

// ============================================
// QUESTIONS API
// ============================================

export const getCustomQuestions = async (category?: string): Promise<Question[]> => {
  try {
    const endpoint = category ? `/questions?category=${category}&count=10` : '/admin/questions';
    const { questions } = await apiRequest<{ questions: Question[] }>(endpoint);
    return questions;
  } catch (error) {
    console.error('Get questions error:', error);
    return [];
  }
};

export const fetchGameQuestions = async (
  category: string,
  count: number = 20
): Promise<Question[]> => {
  const query = `/questions?category=${encodeURIComponent(category)}&count=${count}`;
  try {
    const { questions } = await apiRequest<{ questions: Question[] }>(query);
    if (Array.isArray(questions) && questions.length > 0) {
      return questions;
    }
    console.warn('Primary question pool empty, falling back to static bank.');
  } catch (error) {
    console.error('Fetch game questions error:', error);
  }

  try {
    const { questions: fallback } = await apiRequest<{ questions: Question[] }>(
      `/questions/fallback?category=${encodeURIComponent(category)}&count=${count}`
    );
    return fallback;
  } catch (fallbackError) {
    console.error('Fallback questions fetch error:', fallbackError);
    throw fallbackError instanceof Error ? fallbackError : new Error('Failed to load any questions');
  }
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  await apiRequest('/auth/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
};

export const addCustomQuestion = async (question: Omit<Question, 'id'>): Promise<Question> => {
  const { question: newQuestion } = await apiRequest<{ question: Question }>('/admin/questions', {
    method: 'POST',
    body: JSON.stringify(question),
  });
  return newQuestion;
};

export const deleteCustomQuestion = async (id: string): Promise<void> => {
  await apiRequest(`/admin/questions/${id}`, {
    method: 'DELETE',
  });
};

// Submit answer and update points
export const submitAnswer = async (
  questionId: string,
  answer: string,
  isCorrect: boolean,
  category: string
): Promise<{ correct: boolean; pointsEarned: number; user: User }> => {
  const result = await apiRequest<{ correct: boolean; pointsEarned: number; user: User }>(
    '/questions/answer',
    {
      method: 'POST',
      body: JSON.stringify({ questionId, answer, isCorrect, category }),
    }
  );
  
  // Update user cache
  setUserCache(result.user);
  return result;
};

// Get fallback questions when custom questions aren't available
export const getFallbackQuestions = async (
  category: string,
  count: number = 5
): Promise<Question[]> => {
  try {
    const { questions } = await apiRequest<{ questions: Question[] }>(
      `/questions/fallback?category=${category}&count=${count}`
    );
    return questions;
  } catch (error) {
    console.error('Get fallback questions error:', error);
    return [];
  }
};

// ============================================
// REDEEM API
// ============================================

export const getRedeemRequests = async (): Promise<RedeemRequest[]> => {
  try {
    // Check if admin to get all requests
    const currentUser = getCurrentUser();
    const endpoint = currentUser?.role === 'ADMIN' ? '/redeem/all' : '/redeem';
    const { requests } = await apiRequest<{ requests: RedeemRequest[] }>(endpoint);
    
    // Map to match frontend interface
    return requests.map(r => ({
      ...r,
      userId: (r as any).userId || '',
      userEmail: (r as any).userEmail || (r as any).userName || '',
    }));
  } catch (error) {
    console.error('Get redeem requests error:', error);
    return [];
  }
};

export const addRedeemRequest = async (request: Omit<RedeemRequest, 'id' | 'date'>): Promise<RedeemRequest> => {
  const { request: newRequest } = await apiRequest<{ request: RedeemRequest }>('/redeem', {
    method: 'POST',
    body: JSON.stringify(request),
  });
  return newRequest;
};

export const updateRedeemRequest = async (
  id: string,
  status: 'APPROVED' | 'REJECTED',
  adminNotes?: string
): Promise<void> => {
  await apiRequest(`/redeem/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status, adminNotes }),
  });
};

// ============================================
// ADMIN API
// ============================================

export interface AdminDashboardStats {
  totalUsers: number;
  pendingRedeems: number;
  totalPaid: number;
  totalQuestions: number;
  totalPointsDistributed: number;
}

export const getAdminDashboardStats = async (): Promise<AdminDashboardStats> => {
  const { stats } = await apiRequest<{ stats: AdminDashboardStats }>('/admin/dashboard');
  return stats;
};

export const getAdminQuestions = async (category?: string): Promise<Question[]> => {
  try {
    const endpoint = category ? `/admin/questions?category=${category}` : '/admin/questions';
    const { questions } = await apiRequest<{ questions: Question[] }>(endpoint);
    return questions;
  } catch (error) {
    console.error('Get admin questions error:', error);
    return [];
  }
};

// ============================================
// GAME SESSION API
// ============================================

export const startGameSession = async (category: string): Promise<string> => {
  const { sessionId } = await apiRequest<{ sessionId: string }>('/questions/session/start', {
    method: 'POST',
    body: JSON.stringify({ category }),
  });
  return sessionId;
};

export const endGameSession = async (
  sessionId: string,
  questionsAttempted: number,
  correctAnswers: number,
  pointsEarned: number
): Promise<void> => {
  await apiRequest(`/questions/session/${sessionId}/end`, {
    method: 'PUT',
    body: JSON.stringify({ questionsAttempted, correctAnswers, pointsEarned }),
  });
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Check if user is admin
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === UserRole.ADMIN;
};

// Initialize API service (call on app start)
export const initApiService = async (): Promise<User | null> => {
  if (isAuthenticated()) {
    return await refreshCurrentUser();
  }
  return null;
};

// ============================================
// COMMUNITY HUB API
// ============================================

export const getAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const { announcements } = await apiRequest<{ announcements: Announcement[] }>(
      '/community/announcements',
      {},
      'announcements',
      120000 // Cache for 2 minutes
    );
    return announcements || [];
  } catch (error) {
    console.error('Get announcements error:', error);
    return [];
  }
};

export const getAdminAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const { announcements } = await apiRequest<{ announcements: Announcement[] }>('/community/admin/announcements');
    return announcements || [];
  } catch (error) {
    console.error('Get admin announcements error:', error);
    return [];
  }
};

export const createAnnouncement = async (
  data: { title: string; content: string; type: string; isPinned?: boolean; expiresAt?: string | null }
): Promise<Announcement> => {
  const { announcement } = await apiRequest<{ announcement: Announcement }>('/community/admin/announcements', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return announcement;
};

export const updateAnnouncement = async (
  id: string,
  data: Partial<{ title: string; content: string; type: string; isActive: boolean; isPinned: boolean; expiresAt: string | null }>
): Promise<Announcement> => {
  const { announcement } = await apiRequest<{ announcement: Announcement }>(`/community/admin/announcements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  return announcement;
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
  await apiRequest(`/community/admin/announcements/${id}`, {
    method: 'DELETE'
  });
};

export const toggleAnnouncementStatus = async (id: string): Promise<Announcement> => {
  const { announcement } = await apiRequest<{ announcement: Announcement }>(`/community/admin/announcements/${id}/toggle`, {
    method: 'POST'
  });
  return announcement;
};

// ============================================
// FEEDBACK API
// ============================================

export const getUserFeedback = async (): Promise<Feedback[]> => {
  try {
    const { feedback } = await apiRequest<{ feedback: Feedback[] }>('/community/feedback');
    return feedback || [];
  } catch (error) {
    console.error('Get user feedback error:', error);
    return [];
  }
};

export const submitFeedback = async (
  data: { type: string; title: string; content: string }
): Promise<Feedback> => {
  const { feedback } = await apiRequest<{ feedback: Feedback }>('/community/feedback', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return feedback;
};

export const getAdminFeedback = async (filters?: { status?: string; type?: string }): Promise<Feedback[]> => {
  try {
    let endpoint = '/community/admin/feedback';
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    if (params.toString()) endpoint += `?${params.toString()}`;
    
    const { feedback } = await apiRequest<{ feedback: Feedback[] }>(endpoint);
    return feedback || [];
  } catch (error) {
    console.error('Get admin feedback error:', error);
    return [];
  }
};

export const updateFeedback = async (
  id: string,
  data: { status?: string; adminResponse?: string }
): Promise<Feedback> => {
  const { feedback } = await apiRequest<{ feedback: Feedback }>(`/community/admin/feedback/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  return feedback;
};

export const deleteFeedback = async (id: string): Promise<void> => {
  await apiRequest(`/community/admin/feedback/${id}`, {
    method: 'DELETE'
  });
};
