import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export const Terms: React.FC = () => {
  const lastUpdated = 'December 5, 2025';

  return (
    <>
      <SEO
        title="Terms"
        description="Review the Solve2Win terms and conditions covering eligibility, fair play, rewards, and withdrawals for Pakistani players."
        keywords="Solve2Win terms and conditions, play to earn rules Pakistan, gaming withdrawal policy"
        canonicalPath="/terms"
      />
      <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
          Terms & <span className="text-pakistan-green dark:text-green-400">Conditions</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Last updated: {lastUpdated}</p>
      </div>

      {/* Content */}
      <div className="glass-card dark:glass-card rounded-3xl p-8 md:p-12 border border-white/50 dark:border-white/10 space-y-8">
        
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">📋</span> 1. Acceptance of Terms
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            By accessing or using Solve2Win ("the Platform"), you agree to be bound by these Terms and Conditions. 
            If you do not agree to these terms, please do not use our services. These terms apply to all users, 
            including players and administrators.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">👤</span> 2. Eligibility
          </h2>
          <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
            <p>To use Solve2Win, you must:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Be at least 18 years of age</li>
              <li>Be a resident of Pakistan</li>
              <li>Have the legal capacity to enter into a binding agreement</li>
              <li>Not be prohibited from using the service under applicable laws</li>
            </ul>
            <p>
              By registering, you represent and warrant that you meet all eligibility requirements.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">🔐</span> 3. Account Registration
          </h2>
          <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
            <p>When creating an account, you agree to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information as needed</li>
              <li>Keep your password secure and confidential</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Not create multiple accounts or share accounts with others</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">🎮</span> 4. Game Rules & Fair Play
          </h2>
          <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
            <p>Users agree to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Play games fairly without using any automated tools, bots, or scripts</li>
              <li>Not exploit bugs or glitches in the platform</li>
              <li>Not manipulate or attempt to manipulate game outcomes</li>
              <li>Report any bugs or issues discovered during gameplay</li>
              <li>Respect other users and maintain appropriate conduct</li>
            </ul>
            <p>
              Violation of fair play rules may result in account suspension, point forfeiture, and permanent ban.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">💰</span> 5. Points & Rewards
          </h2>
          <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Points are earned by correctly answering questions in various game modes</li>
              <li>Points have no monetary value until converted through the withdrawal process</li>
              <li>Conversion rates are set by Solve2Win and may change at any time</li>
              <li>Points are non-transferable between accounts</li>
              <li>Solve2Win reserves the right to adjust points in case of errors or fraud</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">💳</span> 6. Withdrawals
          </h2>
          <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Minimum withdrawal amount is determined by platform settings</li>
              <li>Withdrawals are processed via JazzCash/EasyPaisa to the account holder's verified mobile number</li>
              <li>Processing time is typically 24-48 hours on business days</li>
              <li>Solve2Win reserves the right to verify user identity before processing withdrawals</li>
              <li>Users are responsible for providing correct JazzCash/EasyPaisa details</li>
              <li>Solve2Win is not liable for failed transactions due to incorrect user-provided information</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">🚫</span> 7. Prohibited Activities
          </h2>
          <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
            <p>Users are strictly prohibited from:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Using automated systems, bots, or scripts to play games</li>
              <li>Creating multiple accounts to exploit rewards</li>
              <li>Sharing account credentials with others</li>
              <li>Attempting to hack, reverse engineer, or compromise the platform</li>
              <li>Engaging in fraudulent activities</li>
              <li>Harassing or threatening other users</li>
              <li>Posting inappropriate or offensive content</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">⚠️</span> 8. Account Suspension & Termination
          </h2>
          <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
            <p>Solve2Win reserves the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Suspend or terminate accounts that violate these terms</li>
              <li>Forfeit points and pending withdrawals in case of fraud or abuse</li>
              <li>Take legal action against users engaging in illegal activities</li>
              <li>Modify or discontinue services at any time</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">📝</span> 9. Intellectual Property
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            All content on Solve2Win, including but not limited to text, graphics, logos, icons, images, 
            and software, is the property of Solve2Win and is protected by intellectual property laws. 
            Users may not copy, reproduce, distribute, or create derivative works without prior written consent.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">⚖️</span> 10. Limitation of Liability
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Solve2Win is provided "as is" without warranties of any kind. We are not liable for any 
            indirect, incidental, special, or consequential damages arising from your use of the platform. 
            Our total liability shall not exceed the amount earned by the user on the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">🔄</span> 11. Changes to Terms
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            We may modify these terms at any time. Changes will be effective upon posting on the platform. 
            Continued use of the service after changes constitutes acceptance of the modified terms. 
            We encourage users to review these terms periodically.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">🏛️</span> 12. Governing Law
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            These terms are governed by and construed in accordance with the laws of Pakistan. 
            Any disputes arising from these terms shall be subject to the exclusive jurisdiction 
            of the courts in Pakistan.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">📞</span> 13. Contact Information
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            For questions about these Terms & Conditions, please contact us:
          </p>
          <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Email:</strong> support@solve2win.com<br />
              <strong>Website:</strong> <Link to="/" className="text-pakistan-green dark:text-green-400 hover:underline">www.solve2win.com</Link>
            </p>
          </div>
        </section>

      </div>

      {/* Back to Home */}
      <div className="text-center">
        <Link
          to="/"
          className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-pakistan-green to-pakistan-accent dark:from-green-600 dark:to-emerald-600 text-white font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
        >
          Back to Home
        </Link>
      </div>
      </div>
    </>
  );
};
