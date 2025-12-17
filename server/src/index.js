import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import questionRoutes from './routes/questions.js';
import redeemRoutes from './routes/redeem.js';
import adminRoutes from './routes/admin.js';
import settingsRoutes from './routes/settings.js';
import communityRoutes from './routes/community.js';

const app = express();
const PORT = process.env.PORT || 3001;

const isProd = process.env.NODE_ENV === 'production';

// Hide Express signature
app.disable('x-powered-by');

// If running behind a reverse proxy (Render/NGINX), enable this so req.ip / rate limiting work correctly.
// Set TRUST_PROXY=1 in production if needed.
if (process.env.TRUST_PROXY) {
  app.set('trust proxy', process.env.TRUST_PROXY);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, '..', '..', 'client', 'dist');

// ============================================
// MIDDLEWARE
// ============================================

// Security headers
app.use(
  helmet({
    // CSP is app-specific and can break the SPA if misconfigured; keep it off by default.
    contentSecurityPolicy: false
  })
);

// Compression (helps performance for API + static assets)
app.use(compression());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.RATE_LIMIT_MAX) || 600,
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.AUTH_RATE_LIMIT_MAX) || 60,
  standardHeaders: true,
  legacyHeaders: false
});

// CORS configuration
const getAllowedOrigins = () => {
  const allowed = new Set();

  // Production domains - always allowed
  allowed.add('https://solve2win.com');
  allowed.add('https://www.solve2win.com');
  allowed.add('https://api.solve2win.com');

  const frontendUrl = process.env.FRONTEND_URL;
  if (frontendUrl) allowed.add(frontendUrl);

  const extra = process.env.CORS_ALLOWED_ORIGINS;
  if (extra) {
    extra
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((o) => allowed.add(o));
  }

  // Dev defaults
  if (!isProd && !frontendUrl) {
    allowed.add('http://localhost:5173');
  }

  return allowed;
};

const allowedOrigins = getAllowedOrigins();

// Handle preflight OPTIONS requests explicitly
app.options('*', cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    // In dev, allow all
    if (!isProd) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Device-Id']
}));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, curl)
      if (!origin) {
        if (isProd && process.env.STRICT_CORS) return callback(new Error('CORS origin denied'), false);
        return callback(null, true);
      }

      // Production: check allowlist (includes hardcoded production domains)
      if (allowedOrigins.has(origin)) return callback(null, true);

      // Dev convenience
      if (!isProd) {
        if (
          origin.includes('localhost') ||
          origin.includes('127.0.0.1') ||
          origin.includes('192.168')
        ) {
          return callback(null, true);
        }
        return callback(null, true);
      }

      // Deny if not in allowlist
      console.log(`CORS blocked origin: ${origin}`);
      return callback(new Error('CORS origin denied'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Device-Id']
  })
);

// Parse JSON bodies
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '100kb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: process.env.URLENCODED_BODY_LIMIT || '100kb' }));

// Avoid caching API responses (auth tokens, user data) in browsers/proxies.
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// Apply global rate limits to API routes
app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

// Request logging middleware
app.use((req, res, next) => {
  if (!isProd) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
  }
  next();
});

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/redeem', redeemRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/community', communityRoutes);

// ============================================
// STATIC FRONTEND (OPTIONAL)
// ============================================

// If the built client exists, serve it and enable SPA history fallback.
// This helps crawlers/reviewers and allows BrowserRouter routes to load directly.
if (fs.existsSync(clientDistPath)) {
  app.use(
    express.static(clientDistPath, {
      etag: true,
      maxAge: isProd ? '1h' : 0,
      index: false
    })
  );

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    return res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);

  if (err?.message === 'CORS origin denied') {
    return res.status(403).json({ error: 'CORS origin denied' });
  }

  const status = Number(err.status) || 500;
  const isClientError = status >= 400 && status < 500;

  res.status(status).json({
    error: isProd
      ? isClientError
        ? err.message || 'Bad Request'
        : 'Internal Server Error'
      : err.message || 'Internal Server Error',
    ...(!isProd && { stack: err.stack })
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Solve2Win Backend Server                             ║
║                                                           ║
║   Server running on: http://localhost:${PORT}               ║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(15)}                      ║
║                                                           ║
║   API Endpoints:                                          ║
║   • /api/health     - Health check                        ║
║   • /api/auth       - Authentication                      ║
║   • /api/users      - User management                     ║
║   • /api/questions  - Questions & game                    ║
║   • /api/redeem     - Redemption requests                 ║
║   • /api/admin      - Admin dashboard                     ║
║   • /api/settings   - App settings                        ║
║   • /api/community  - Community hub                       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
