import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';

// Lazy load all pages for better performance
const Landing = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })));
const Auth = lazy(() => import('./pages/Auth').then(m => ({ default: m.Auth })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Game = lazy(() => import('./pages/Game').then(m => ({ default: m.Game })));
const Wallet = lazy(() => import('./pages/Wallet').then(m => ({ default: m.Wallet })));
const Admin = lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const Community = lazy(() => import('./pages/Community').then(m => ({ default: m.Community })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const FAQ = lazy(() => import('./pages/FAQ').then(m => ({ default: m.FAQ })));
const Terms = lazy(() => import('./pages/Terms').then(m => ({ default: m.Terms })));
const Privacy = lazy(() => import('./pages/Privacy').then(m => ({ default: m.Privacy })));

// Loading spinner component
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-india-saffron/10 via-white to-india-green/10 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-india-saffron border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-300 font-medium">Loading...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/game/:category" element={<Game />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/community" element={<Community />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
};

export default App;