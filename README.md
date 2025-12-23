# BharatRewards

A rewards-based learning platform where users can play quizzes, solve puzzles, and earn redeemable points.

## 📁 Project Structure

```
bharatrewards/
├── client/                 # React Frontend (Vite + TypeScript)
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page components
│   ├── services/           # API & storage services
│   ├── App.tsx             # Main app component
│   ├── index.tsx           # Entry point
│   └── package.json
├── server/                 # Node.js Backend (Express + Supabase)
│   ├── src/
│   │   ├── config/         # Supabase & JWT config
│   │   ├── routes/         # API route handlers
│   │   └── index.js        # Server entry point
│   ├── supabase/
│   │   └── schema.sql      # Database schema
│   └── package.json
├── package.json            # Root package with workspace scripts
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- A Supabase account ([supabase.com](https://supabase.com))

### 1. Setup

```bash
# Clone the repository
git clone <repo-url>
cd bharatrewards

# Install all dependencies (client + server)
npm run setup
```

### 2. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `server/supabase/schema.sql`
3. Go to **Settings > API** to get your credentials

### 3. Environment Variables

**Server** (`server/.env`):
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_super_secret_jwt_key
PORT=3001
FRONTEND_URL=http://localhost:5173
```

**Client** (`client/.env`):
```env
VITE_API_URL=http://localhost:3001/api
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Question content is now served entirely from the backend using the static bank defined in `server/src/data/questions.js`, so no Gemini API key is required.

### 4. Run Development Servers

```bash
# Run both frontend and backend together
npm run dev:full

# Or run separately:
npm run dev          # Frontend only (port 5173)
npm run dev:server   # Backend only (port 3001)
```

## 📚 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run setup` | Install all dependencies |
| `npm run dev` | Start frontend dev server |
| `npm run dev:server` | Start backend dev server |
| `npm run dev:full` | Start both servers concurrently |
| `npm run build` | Build frontend for production |
| `npm start` | Start production server |

## 🔐 Creating Admin Accounts

- Use the **Admin** toggle on the `/auth` page to sign up as an administrator with **any email address** you own. The backend now allows this flow while enforcing a hard limit of **three** admins (you’ll see “Maximum number of admins reached” once the cap is hit).
- Prefer SQL? You can still insert rows manually:

	```sql
	INSERT INTO users (email, password_hash, name, role)
	VALUES (
		'founder@example.com',
		'$2a$10$XXXXXXXXXXXX', -- bcrypt hash of your secure password
		'Founder',
		'ADMIN'
	);
	```

Generate hashes with `node -e "console.log(require('bcryptjs').hashSync('MyStrongPassword', 10))"`.

## 🛠️ Tech Stack

**Frontend:**
- React 19
- TypeScript
- Vite
- React Router
- TailwindCSS

**Backend:**
- Node.js
- Express
- Supabase (PostgreSQL)
- JWT Authentication

## 📖 API Documentation

See [server/README.md](./server/README.md) for complete API documentation.

## � Deployment

This app is designed to be deployed with:
- **Frontend (Vercel)** - React/Vite app
- **Backend (Railway)** - Express.js API server

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the complete deployment guide.

## �📝 License

All rights reserved.
