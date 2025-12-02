export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  password?: string; // Added for persistent login
  name: string;
  role: UserRole;
  points: number;
  walletBalance: number; 
  solvedCount: number;
  createdAt?: string;
  isBanned?: boolean;
  bannedAt?: string | null;
  banReason?: string | null;
}

export interface Question {
  id: string;
  type: 'MATH' | 'QUIZ' | 'PUZZLE' | 'TYPING' | 'CAPTCHA';
  questionText: string;
  options?: string[];
  correctAnswer: string;
  captchaStyle?: 'distorted' | 'noisy' | 'strikethrough' | 'rotated' | 'mixed';
}

export interface RedeemRequest {
  id: string;
  userId: string;
  userEmail: string;
  amountPoints: number;
  amountRupees: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
}

export interface GameSession {
  score: number;
  correctAnswers: number;
  totalAttempted: number;
}

export interface AppSettings {
  minRedeemPoints: number;
  pointsPerQuestion: number;
  currencyRate: number; // INR value per 10,000 points
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'EVENT';
  isActive: boolean;
  isPinned: boolean;
  createdAt: string;
  expiresAt?: string | null;
  createdBy: string;
}

export interface Feedback {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  type: 'SUGGESTION' | 'FEATURE_REQUEST' | 'BUG_REPORT' | 'OTHER';
  title: string;
  content: string;
  status: 'PENDING' | 'REVIEWED' | 'IMPLEMENTED' | 'DECLINED';
  adminResponse?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}