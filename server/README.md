# BharatRewards Backend

A Node.js + Express backend with Supabase database for the BharatRewards application.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### 1. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy the contents of `supabase/schema.sql` and execute it
4. Go to **Settings > API** to get your credentials

### 2. Configure Environment

```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_super_secret_jwt_key
PORT=3001
FRONTEND_URL=http://localhost:5173

# Optional hardening
# CORS_ALLOWED_ORIGINS=https://solve2win.com,https://www.solve2win.com
# STRICT_CORS=1
# TRUST_PROXY=1
# RATE_LIMIT_MAX=600
# AUTH_RATE_LIMIT_MAX=60
# JSON_BODY_LIMIT=100kb
# URLENCODED_BODY_LIMIT=100kb
# ADMIN_DEBUG_LOGS=1
```

### 3. Install Dependencies

```bash
cd server
npm install
```

### 4. Run the Server

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start
```

Server will start at `http://localhost:3001`

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user profile |
| POST | `/api/auth/logout` | Logout user |
| PUT | `/api/auth/password` | Change password |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (Admin) |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user profile |
| PUT | `/api/users/:id/points` | Update user points |
| GET | `/api/users/stats/leaderboard` | Get leaderboard |

### Questions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/questions` | Get questions by category |
| POST | `/api/questions/answer` | Submit answer |
| GET | `/api/questions/fallback` | Get fallback questions |
| POST | `/api/questions/session/start` | Start game session |
| PUT | `/api/questions/session/:id/end` | End game session |

> Static gameplay content: `server/src/data/questions.js` preloads 500 curated prompts for each category (Math, Quiz, Puzzle, Typing). The `/api/questions` route serves these instantly, optionally merging admin-created custom questions.

### Redeem Requests

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/redeem` | Get user's redeem requests |
| POST | `/api/redeem` | Create redeem request |
| GET | `/api/redeem/all` | Get all requests (Admin) |
| PUT | `/api/redeem/:id` | Update request status (Admin) |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Get dashboard stats |
| GET | `/api/admin/settings` | Get app settings |
| PUT | `/api/admin/settings` | Update app settings |
| GET | `/api/admin/questions` | Get all custom questions |
| POST | `/api/admin/questions` | Create custom question |
| PUT | `/api/admin/questions/:id` | Update custom question |
| DELETE | `/api/admin/questions/:id` | Delete custom question |

### Settings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get public app settings |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

1. Login or register to get a token
2. Include the token in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

## 🗄️ Database Schema

See `supabase/schema.sql` for the complete database schema including:

- `users` - User accounts
- `app_settings` - Application settings
- `custom_questions` - Custom quiz questions
- `redeem_requests` - Redemption requests
- `game_sessions` - Game session tracking
- `user_activity_log` - User activity audit log

## 🔒 Default Admin Account

After running the schema, a default admin account is created:

- **Email:** admin@bharatrewards.com
- **Password:** admin

⚠️ **Change this password immediately in production!**

## 📁 Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── supabase.js    # Supabase client configuration
│   │   └── jwt.js         # JWT utilities & middleware
│   ├── routes/
│   │   ├── auth.js        # Authentication routes
│   │   ├── users.js       # User management routes
│   │   ├── questions.js   # Questions & game routes
│   │   ├── redeem.js      # Redemption routes
│   │   ├── admin.js       # Admin dashboard routes
│   │   └── settings.js    # Public settings routes
│   └── index.js           # Express app entry point
├── supabase/
│   └── schema.sql         # Database schema
├── .env.example           # Environment variables template
├── package.json
└── README.md
```

## 🛠️ Development

### Running Tests

```bash
npm test
```

### Code Style

The project uses ES Modules. Make sure to use `.js` extensions in imports.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| SUPABASE_URL | Supabase project URL | Yes |
| SUPABASE_ANON_KEY | Supabase anonymous key | Yes |
| SUPABASE_SERVICE_ROLE_KEY | Supabase service role key | Yes |
| JWT_SECRET | Secret for JWT signing | Yes |
| PORT | Server port (default: 3001) | No |
| FRONTEND_URL | Frontend URL for CORS | No |
| CORS_ALLOWED_ORIGINS | Extra allowed origins (comma-separated) | No |
| STRICT_CORS | Set to `1` to deny requests without Origin in prod | No |
| TRUST_PROXY | Set when behind a reverse proxy | No |
| RATE_LIMIT_MAX | Requests per 15 minutes for `/api` | No |
| AUTH_RATE_LIMIT_MAX | Requests per 15 minutes for `/api/auth` | No |
| JSON_BODY_LIMIT | Max JSON body size (e.g. `100kb`) | No |
| URLENCODED_BODY_LIMIT | Max urlencoded body size (e.g. `100kb`) | No |
| ADMIN_DEBUG_LOGS | Enable verbose admin logs (avoid in prod) | No |
| NODE_ENV | Environment (development/production) | No |

## 🚀 Deployment

### Environment Setup

1. Set all required environment variables
2. Run database migrations in Supabase

## ✅ Security & Performance Checklist (Production)

- **Secrets**: never commit `server/.env`; rotate `SUPABASE_SERVICE_ROLE_KEY` and `JWT_SECRET` if leaked.
- **JWT**: set `NODE_ENV=production` and a strong `JWT_SECRET` (the server will refuse to start without it).
- **CORS**: set `FRONTEND_URL` and optionally `CORS_ALLOWED_ORIGINS` to your exact production origins; consider `STRICT_CORS=1`.
- **Proxy**: if behind NGINX/Render/etc, set `TRUST_PROXY=1` so `req.ip` and rate limiting work correctly.
- **Rate limits**: tune `RATE_LIMIT_MAX` and `AUTH_RATE_LIMIT_MAX` based on traffic.
- **HTTPS**: terminate TLS at your load balancer/proxy; serve the API only over HTTPS.
- **Admin safety**: keep `ADMIN_DEBUG_LOGS` off in production; change the default admin password.

## 🚫 Duplicate / Multi-Account Prevention

The server can block (and optionally auto-ban) suspicious registrations using **device id + IP + similar-name** heuristics.

- Apply the Supabase migration: [server/supabase/duplicate_prevention.sql](supabase/duplicate_prevention.sql)
- Optional docs: [server/supabase/README-duplicate-prevention.md](supabase/README-duplicate-prevention.md)

Environment variables (see [server/.env.example](.env.example)):
- `DUPLICATE_PREVENTION` (default enabled)
- `AUTO_BAN_DUPLICATES=1` to auto-ban instead of just blocking
- `MAX_ACCOUNTS_PER_DEVICE` (default 1)
- `MAX_ACCOUNTS_PER_IP` + `IP_WINDOW_HOURS` (defaults 3 per 24h)
- `DUPLICATE_NAME_SIMILARITY` (default 0.88)

Note: IP-based rules can false-positive on shared networks; device-based rules are usually safer.
3. Change default admin password
4. Set `NODE_ENV=production`

### Recommended Platforms

- [Railway](https://railway.app)
- [Render](https://render.com)
- [Vercel](https://vercel.com) (Serverless)
- [Heroku](https://heroku.com)

## 📝 License

This project is proprietary. All rights reserved.
