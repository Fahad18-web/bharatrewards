import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Getting Started
  {
    category: 'Getting Started',
    question: 'What is Solve2Win?',
    answer: 'Solve2Win is India\'s #1 skill-based gaming platform where you can play fun games like Math Challenges, Speed Typing, Quizzes, Puzzles, and Captcha challenges to earn real cash rewards. It\'s completely free to join and play!'
  },
  {
    category: 'Getting Started',
    question: 'How do I create an account?',
    answer: 'Simply click on "Get Started" or "Sign Up" button, enter your name, email, and create a password. That\'s it! You can start playing games immediately after registration.'
  },
  {
    category: 'Getting Started',
    question: 'Is Solve2Win free to use?',
    answer: 'Yes! Solve2Win is completely free to use. There are no hidden charges or subscription fees. You earn points by playing games and can convert them to real cash.'
  },

  // Games & Points
  {
    category: 'Games & Points',
    question: 'What types of games are available?',
    answer: 'We offer 5 exciting game modes: 1) Math Challenge - Solve equations quickly, 2) Speed Typing - Type fast and accurately, 3) Quiz Master - Answer trivia questions, 4) Puzzle Pro - Solve brain-teasing puzzles, 5) Captcha Pro - Solve captcha challenges quickly.'
  },
  {
    category: 'Games & Points',
    question: 'How do I earn points?',
    answer: 'You earn points for every correct answer in any game mode. The faster you answer, the more bonus points you can earn. Daily login bonuses and streaks also help you accumulate more points.'
  },
  {
    category: 'Games & Points',
    question: 'How many points do I get per question?',
    answer: 'The base points per question is set by the platform (typically 10 points). You can earn bonus points for speed and maintaining answer streaks.'
  },
  {
    category: 'Games & Points',
    question: 'Is there a limit to how much I can play?',
    answer: 'There\'s no strict limit on playing! However, we encourage responsible gaming. Take breaks and enjoy the games at your own pace.'
  },

  // Withdrawals & Payments
  {
    category: 'Withdrawals & Payments',
    question: 'How do I withdraw my earnings?',
    answer: 'Go to the Wallet section, enter the amount you want to withdraw, and provide your UPI ID. Once your request is approved by our team, the amount will be transferred to your account.'
  },
  {
    category: 'Withdrawals & Payments',
    question: 'What is the minimum withdrawal amount?',
    answer: 'The minimum withdrawal amount is based on the platform settings. You can check the current minimum in the Wallet section. Typically, you need at least 14,000 points (equivalent to ₹10) to make a withdrawal.'
  },
  {
    category: 'Withdrawals & Payments',
    question: 'How long does withdrawal take?',
    answer: 'Withdrawal requests are typically processed within 24-48 hours on business days. Once approved, the amount is transferred instantly to your UPI account.'
  },
  {
    category: 'Withdrawals & Payments',
    question: 'What payment methods are supported?',
    answer: 'Currently, we support UPI for all withdrawals. This ensures fast and secure transfers directly to your bank account linked with UPI.'
  },
  {
    category: 'Withdrawals & Payments',
    question: 'What is the points to rupees conversion rate?',
    answer: 'The conversion rate is displayed in your Wallet section. Typically, 1000 points = ₹1, but this may vary based on platform settings.'
  },

  // Account & Security
  {
    category: 'Account & Security',
    question: 'How do I change my password?',
    answer: 'Go to your Profile page, scroll to the Security section, enter your current password and new password, then click "Update Password".'
  },
  {
    category: 'Account & Security',
    question: 'Can I change my email address?',
    answer: 'Yes, you can update your email address from the Profile page. Enter your new email and save changes.'
  },
  {
    category: 'Account & Security',
    question: 'What should I do if I forget my password?',
    answer: 'Please contact our support team at support@solve2win.com with your registered email address, and we\'ll help you reset your password.'
  },
  {
    category: 'Account & Security',
    question: 'Is my data secure?',
    answer: 'Yes! We use industry-standard encryption and security measures to protect your personal information and transaction data. We never share your data with third parties without consent.'
  },

  // Technical Issues
  {
    category: 'Technical Issues',
    question: 'The game is not loading. What should I do?',
    answer: 'Try refreshing the page or clearing your browser cache. If the issue persists, try using a different browser or check your internet connection. You can also report the issue through our Contact page.'
  },
  {
    category: 'Technical Issues',
    question: 'My points were not credited after completing a game.',
    answer: 'Points are credited immediately after each correct answer. If you notice missing points, please contact support with details of the game session, and we\'ll investigate.'
  },
  {
    category: 'Technical Issues',
    question: 'The app is running slow. Any tips?',
    answer: 'For best performance, use a modern browser (Chrome, Firefox, Edge), close unnecessary tabs, and ensure you have a stable internet connection.'
  },
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(faqData.map(item => item.category)))];

  const filteredFAQs = activeCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
          Frequently Asked <span className="text-india-saffron dark:text-orange-400">Questions</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Find answers to common questions about Solve2Win. Can't find what you're looking for? 
          <Link to="/contact" className="text-india-blue dark:text-blue-400 font-medium hover:underline ml-1">Contact us</Link>
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              activeCategory === category
                ? 'bg-india-blue text-white shadow-lg dark:bg-blue-600'
                : 'bg-white/70 dark:bg-slate-800/70 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-700 border border-gray-100 dark:border-slate-700'
            }`}
          >
            {category === 'all' ? 'All Questions' : category}
          </button>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        {filteredFAQs.map((faq, index) => {
          const globalIndex = faqData.indexOf(faq);
          const isOpen = openIndex === globalIndex;
          
          return (
            <div
              key={globalIndex}
              className="glass-card dark:glass-card rounded-2xl border border-white/50 dark:border-white/10 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">
                    {faq.category === 'Getting Started' && '🚀'}
                    {faq.category === 'Games & Points' && '🎮'}
                    {faq.category === 'Withdrawals & Payments' && '💰'}
                    {faq.category === 'Account & Security' && '🔐'}
                    {faq.category === 'Technical Issues' && '🔧'}
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">{faq.question}</span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isOpen && (
                <div className="px-6 pb-5">
                  <div className="pl-12 text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still Have Questions */}
      <div className="glass-card dark:glass-card rounded-3xl p-8 text-center border border-white/50 dark:border-white/10">
        <div className="w-16 h-16 bg-india-blue/10 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">💬</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Still have questions?</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
          Can't find the answer you're looking for? Our support team is here to help.
        </p>
        <Link
          to="/contact"
          className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-india-blue to-blue-800 dark:from-blue-600 dark:to-blue-800 text-white font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
};
