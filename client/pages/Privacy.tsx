import React from 'react';
import { Link } from 'react-router-dom';

export const Privacy: React.FC = () => {
  const lastUpdated = 'December 5, 2025';

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
          Privacy <span className="text-india-blue">Policy</span>
        </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Quick Summary */}
      <div className="glass-card dark:glass-card rounded-2xl p-6 border border-india-blue/20 bg-india-blue/5 dark:bg-india-blue/10 dark:border-india-blue/30">
        <div className="flex items-start gap-4">
          <span className="text-3xl">🛡️</span>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Our Commitment to Your Privacy</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              At Solve2Win, we take your privacy seriously. We collect only the information necessary to provide 
              our services, never sell your personal data, and use industry-standard security measures to protect 
              your information.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="glass-card dark:glass-card rounded-3xl p-8 md:p-12 border border-white/50 dark:border-white/10 space-y-8">
        
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">📋</span> 1. Information We Collect
          </h2>
          <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Personal Information</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Name and email address (during registration)</li>
                <li>UPI ID (for withdrawal processing)</li>
                <li>Profile avatar selection</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Usage Information</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Game performance data (scores, points, questions answered)</li>
                <li>Login activity and session information</li>
                <li>Device information and browser type</li>
                <li>IP address and general location</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Transaction Information</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Withdrawal requests and history</li>
                <li>Points earned and redeemed</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">🎯</span> 2. How We Use Your Information
          </h2>
          <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
            <p className="mb-3">We use the collected information to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Create and manage your user account</li>
              <li>Provide and improve our gaming services</li>
              <li>Process withdrawal requests and payments</li>
              <li>Track your game progress and display leaderboards</li>
              <li>Send important service notifications</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Respond to customer support inquiries</li>
              <li>Analyze usage patterns to improve user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">🔒</span> 3. Data Security
          </h2>
          <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
            <p>We implement robust security measures to protect your data:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Passwords are securely hashed and never stored in plain text</li>
              <li>All data transmission is encrypted using HTTPS/SSL</li>
              <li>Database access is restricted and monitored</li>
              <li>Regular security audits and updates</li>
              <li>Secure authentication using JWT tokens</li>
            </ul>
            <p>
              While we strive to protect your information, no method of transmission over the internet 
              is 100% secure. We cannot guarantee absolute security.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">🤝</span> 4. Information Sharing
          </h2>
          <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
            <p><strong>We do NOT sell your personal information.</strong></p>
            <p>We may share information only in the following circumstances:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Payment Processing:</strong> UPI details are shared with payment processors to complete withdrawals</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
              <li><strong>Protection:</strong> To protect the rights, property, or safety of Solve2Win and its users</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">🍪</span> 5. Cookies & Local Storage
          </h2>
          <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
            <p>We use cookies and local storage to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Keep you logged in to your account</li>
              <li>Remember your preferences and settings</li>
              <li>Improve platform performance</li>
              <li>Analyze usage patterns</li>
            </ul>
            <p>
              You can control cookie settings through your browser. Disabling cookies may affect 
              your ability to use certain features.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">⏱️</span> 6. Data Retention
          </h2>
          <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Account information is retained as long as your account is active</li>
              <li>Transaction records are kept for 7 years for legal compliance</li>
              <li>Game activity logs are retained for 1 year</li>
              <li>You may request account deletion at any time</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">✅</span> 7. Your Rights
          </h2>
          <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Objection:</strong> Object to certain processing of your data</li>
            </ul>
            <p>
              To exercise these rights, please contact us at support@solve2win.com
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">👶</span> 8. Children's Privacy
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Solve2Win is intended for users aged 18 and above. We do not knowingly collect personal 
            information from children under 18. If you believe a child has provided us with personal 
            information, please contact us immediately, and we will take steps to remove such information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">🌐</span> 9. Third-Party Links
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Our platform may contain links to third-party websites. We are not responsible for the 
            privacy practices of these external sites. We encourage you to read the privacy policies 
            of any third-party sites you visit.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">🔄</span> 10. Changes to This Policy
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            We may update this Privacy Policy from time to time. Changes will be posted on this page 
            with an updated revision date. Significant changes will be communicated via email or 
            prominent notice on our platform. Continued use of the service after changes constitutes 
            acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">📞</span> 11. Contact Us
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            If you have any questions, concerns, or requests regarding this Privacy Policy or your 
            personal data, please contact us:
          </p>
          <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Email:</strong> support@solve2win.com<br />
              <strong>Website:</strong> <Link to="/" className="text-india-blue hover:underline">www.solve2win.com</Link><br />
              <strong>Contact Form:</strong> <Link to="/contact" className="text-india-blue hover:underline">Contact Page</Link>
            </p>
          </div>
        </section>

      </div>

      {/* Related Links */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to="/terms"
          className="px-6 py-3 rounded-xl glass-card dark:glass-card border border-white/50 dark:border-white/10 font-bold text-gray-700 dark:text-white hover:shadow-lg transition-all"
        >
          📋 Terms & Conditions
        </Link>
        <Link
          to="/faq"
          className="px-6 py-3 rounded-xl glass-card dark:glass-card border border-white/50 dark:border-white/10 font-bold text-gray-700 dark:text-white hover:shadow-lg transition-all"
        >
          ❓ FAQ
        </Link>
        <Link
          to="/contact"
          className="px-6 py-3 rounded-xl glass-card dark:glass-card border border-white/50 dark:border-white/10 font-bold text-gray-700 dark:text-white hover:shadow-lg transition-all"
        >
          💬 Contact Us
        </Link>
      </div>

      {/* Back to Home */}
      <div className="text-center">
        <Link
          to="/"
          className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-india-saffron to-india-green text-white font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};
