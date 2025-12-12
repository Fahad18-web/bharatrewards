// Solve2Win Storage Service
// Compatibility layer that uses API backend when available, falls back to localStorage

import { User, UserRole, RedeemRequest, AppSettings, Question, LeaderboardEntry } from '../types';
import * as api from './apiService';

// Feature flag to enable/disable API mode
const USE_API = import.meta.env.VITE_API_URL ? true : false;

// LocalStorage Keys (fallback mode)
const USERS_KEY = 'bharatrewards_users';
const SESSION_KEY = 'bharatrewards_session';
const REDEEM_KEY = 'bharatrewards_redeems';
const SETTINGS_KEY = 'bharatrewards_settings';
const CUSTOM_QUESTIONS_KEY = 'bharatrewards_custom_questions';
const ANNOUNCEMENTS_LAST_SEEN_KEY = 'bharatrewards_announcements_last_seen';

// Defaults
const DEFAULT_SETTINGS: AppSettings = {
  minRedeemPoints: 15000,
  pointsPerQuestion: 10,
  currencyRate: 35
};

// Initialize Admin and Settings if not exists (localStorage fallback only)
const initStorage = () => {
  if (USE_API) return; // Skip for API mode

  const users = getLocalUsers();
  if (!users.find(u => u.email === 'admin@bharatrewards.com')) {
    const admin: User = {
      id: 'admin-1',
      email: 'admin@bharatrewards.com',
      password: 'admin',
      name: 'Super Admin',
      role: UserRole.ADMIN,
      points: 0,
      walletBalance: 0,
      solvedCount: 0,
      isBanned: false
    };
    users.push(admin);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  if (!localStorage.getItem(SETTINGS_KEY)) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
  }
};

// --- Local Storage Helpers ---

const getLocalUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

// --- Users ---

export const getUsers = (): User[] => {
  if (USE_API) {
    // In API mode, this should be called async via apiService
    console.warn('getUsers() called in sync mode - use api.getUsers() for async');
    return [];
  }
  return getLocalUsers();
};

export const saveUser = (user: User) => {
  if (USE_API) {
    // Update local cache immediately for responsive UI
    const cached = api.getCurrentUser();
    if (cached && cached.id === user.id) {
      localStorage.setItem('bharatrewards_user', JSON.stringify(user));
    }
    return;
  }

  const users = getLocalUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Update session if it's the current user
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === user.id) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }
};

export const getCurrentUser = (): User | null => {
  if (USE_API) {
    return api.getCurrentUser();
  }
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
};

export const loginUser = (email: string, password?: string): User | null => {
  if (USE_API) {
    // For API mode, this should be called async
    // This sync version is for backward compatibility
    console.warn('loginUser() called in sync mode - use api.loginUser() for async');
    return null;
  }

  const users = getLocalUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (user) {
    if (user.password && user.password !== password) {
      return null;
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  }
  return null;
};

// Async login for API mode
export const loginUserAsync = async (email: string, password: string): Promise<User | null> => {
  if (USE_API) {
    return await api.loginUser(email, password);
  }
  return loginUser(email, password);
};

export const logoutUser = () => {
  if (USE_API) {
    // Clear local cache immediately
    localStorage.removeItem('bharatrewards_token');
    localStorage.removeItem('bharatrewards_user');
    // Also call API logout (fire and forget)
    api.logoutUser().catch(console.error);
    return;
  }
  localStorage.removeItem(SESSION_KEY);
};

export const registerUser = (name: string, email: string, password?: string, role: UserRole = UserRole.USER): User => {
  if (USE_API) {
    // For API mode, this should be called async
    console.warn('registerUser() called in sync mode - use api.registerUser() for async');
    throw new Error('Use registerUserAsync in API mode');
  }

  const newUser: User = {
    id: Date.now().toString(),
    email,
    password,
    name,
    role,
    points: 0,
    walletBalance: 0,
    solvedCount: 0,
    isBanned: false
  };
  saveUser(newUser);
  localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
  return newUser;
};

// Async register for API mode
export const registerUserAsync = async (
  name: string,
  email: string,
  password: string,
  role: UserRole = UserRole.USER
): Promise<User> => {
  if (USE_API) {
    return await api.registerUser(name, email, password, role);
  }
  return registerUser(name, email, password, role);
};

// --- Redeem Requests ---

export const getRedeemRequests = (): RedeemRequest[] => {
  if (USE_API) {
    console.warn('getRedeemRequests() called in sync mode - use api.getRedeemRequests() for async');
    return [];
  }
  const data = localStorage.getItem(REDEEM_KEY);
  return data ? JSON.parse(data) : [];
};

export const getRedeemRequestsAsync = async (): Promise<RedeemRequest[]> => {
  if (USE_API) {
    return await api.getRedeemRequests();
  }
  return getRedeemRequests();
};

export const addRedeemRequest = (req: RedeemRequest) => {
  if (USE_API) {
    api.addRedeemRequest(req).catch(console.error);
    return;
  }
  const reqs = getRedeemRequests();
  reqs.push(req);
  localStorage.setItem(REDEEM_KEY, JSON.stringify(reqs));
};

export const updateRedeemRequest = (id: string, status: 'APPROVED' | 'REJECTED') => {
  if (USE_API) {
    api.updateRedeemRequest(id, status).catch(console.error);
    return;
  }
  const reqs = getRedeemRequests();
  const index = reqs.findIndex(r => r.id === id);
  if (index >= 0) {
    reqs[index].status = status;
    localStorage.setItem(REDEEM_KEY, JSON.stringify(reqs));
  }
};

// --- Settings ---

export const getSettings = (): AppSettings => {
  if (USE_API) {
    // Return cached or default settings synchronously
    // For fresh data, use getSettingsAsync
    const cached = localStorage.getItem('bharatrewards_settings_cache');
    if (cached) return JSON.parse(cached);
    return DEFAULT_SETTINGS;
  }
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? JSON.parse(data) : DEFAULT_SETTINGS;
};

export const getSettingsAsync = async (): Promise<AppSettings> => {
  if (USE_API) {
    const settings = await api.getSettings();
    localStorage.setItem('bharatrewards_settings_cache', JSON.stringify(settings));
    return settings;
  }
  return getSettings();
};

export const saveSettings = (settings: AppSettings) => {
  if (USE_API) {
    api.saveSettings(settings).catch(console.error);
    localStorage.setItem('bharatrewards_settings_cache', JSON.stringify(settings));
    return;
  }
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// --- Custom Questions ---

export const getCustomQuestions = (category?: string): Question[] => {
  if (USE_API) {
    console.warn('getCustomQuestions() called in sync mode - use api.getCustomQuestions() for async');
    return [];
  }
  const data = localStorage.getItem(CUSTOM_QUESTIONS_KEY);
  const allQuestions: Question[] = data ? JSON.parse(data) : [];
  if (category) {
    return allQuestions.filter(q => q.type === category);
  }
  return allQuestions;
};

export const getCustomQuestionsAsync = async (category?: string): Promise<Question[]> => {
  if (USE_API) {
    return await api.getCustomQuestions(category);
  }
  return getCustomQuestions(category);
};

export const addCustomQuestion = (question: Question) => {
  if (USE_API) {
    api.addCustomQuestion(question).catch(console.error);
    return;
  }
  const questions = getCustomQuestions();
  questions.push(question);
  localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(questions));
};

export const deleteCustomQuestion = (id: string) => {
  if (USE_API) {
    api.deleteCustomQuestion(id).catch(console.error);
    return;
  }
  const questions = getCustomQuestions();
  const filtered = questions.filter(q => q.id !== id);
  localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(filtered));
};

// --- Leaderboard ---

export const getLeaderboardEntries = async (limit: number = 50): Promise<LeaderboardEntry[]> => {
  if (USE_API) {
    return await api.getLeaderboard(limit);
  }

  const users = getLocalUsers()
    .filter(u => u.role === UserRole.USER)
    .sort((a, b) => b.points - a.points)
    .slice(0, limit);

  return users.map((user, idx) => ({
    id: user.id,
    name: user.name,
    points: user.points,
    solvedCount: user.solvedCount,
    rank: idx + 1
  }));
};

// --- Announcements ---

export const getLastSeenAnnouncementAt = (): number => {
  const stored = localStorage.getItem(ANNOUNCEMENTS_LAST_SEEN_KEY);
  const parsed = stored ? parseInt(stored, 10) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
};

export const markAnnouncementsSeen = (timestamp?: number) => {
  const toStore = timestamp ?? Date.now();
  localStorage.setItem(ANNOUNCEMENTS_LAST_SEEN_KEY, String(toStore));
};

// --- Utility exports for API mode ---

export const isApiMode = () => USE_API;

export const submitAnswerAsync = async (
  questionId: string,
  answer: string,
  isCorrect: boolean,
  category: string
) => {
  if (USE_API) {
    return await api.submitAnswer(questionId, answer, isCorrect, category);
  }
  // Fallback: update locally
  const user = getCurrentUser();
  if (user && isCorrect) {
    const settings = getSettings();
    user.points += settings.pointsPerQuestion;
    user.solvedCount += 1;
    saveUser(user);
  }
  return { correct: isCorrect, pointsEarned: isCorrect ? getSettings().pointsPerQuestion : 0, user };
};

// Run init (only for localStorage mode)
initStorage();