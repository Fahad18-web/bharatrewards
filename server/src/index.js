import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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

// ============================================
// MIDDLEWARE
// ============================================

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost on any port and the configured frontend URL
    if (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('192.168')) {
      return callback(null, true);
    }
    
    // Check against FRONTEND_URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    if (origin === frontendUrl) {
      return callback(null, true);
    }
    
    callback(null, true); // Allow all in development
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
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

  // Don't expose internal errors in production
  const isDev = process.env.NODE_ENV !== 'production';

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(isDev && { stack: err.stack })
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
