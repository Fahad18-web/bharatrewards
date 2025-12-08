import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to your backend
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
          Contact <span className="text-india-blue dark:text-blue-400">Us</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Have questions, feedback, or need help? We're here for you. Reach out and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="glass-card dark:glass-card p-6 rounded-2xl border border-white/50 dark:border-white/10">
            <div className="w-12 h-12 bg-india-saffron/20 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">📧</span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Email Us</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">For general inquiries and support</p>
            <a href="mailto:support@solve2win.com" className="text-india-blue dark:text-blue-400 font-medium hover:underline">
              support@solve2win.com
            </a>
          </div>

          <div className="glass-card dark:glass-card p-6 rounded-2xl border border-white/50 dark:border-white/10">
            <div className="w-12 h-12 bg-india-green/20 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Community</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Join our community for updates</p>
            <Link to="/community" className="text-india-green dark:text-green-400 font-medium hover:underline">
              Visit Community →
            </Link>
          </div>

          <div className="glass-card dark:glass-card p-6 rounded-2xl border border-white/50 dark:border-white/10">
            <div className="w-12 h-12 bg-india-blue/20 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">⏰</span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Response Time</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">We typically respond within 24-48 hours on business days.</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="glass-card dark:glass-card p-8 rounded-3xl border border-white/50 dark:border-white/10">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">✅</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Message Sent!</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Thank you for reaching out. We'll get back to you soon.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-india-blue dark:text-blue-400 font-medium hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:border-india-blue dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 transition-all"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:border-india-blue dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 transition-all"
                      placeholder="you@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:border-india-blue dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 transition-all"
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="withdrawal">Withdrawal Issues</option>
                    <option value="account">Account Problems</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="report">Report a Bug</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:border-india-blue dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 transition-all resize-none"
                    rows={5}
                    placeholder="Describe your question or issue in detail..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-india-blue to-blue-800 dark:from-blue-600 dark:to-blue-800 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
