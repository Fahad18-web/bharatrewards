import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export const Landing: React.FC = () => {
  const gameCategories = [
    {
      icon: "🧮",
      title: "Math Challenge",
      description: "Solve equations quickly and earn points. Test your mental math skills!",
      color: "from-blue-500/80 to-indigo-600/80",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: "⌨️",
      title: "Speed Typing",
      description: "Type fast and accurately to win. Improve your WPM and earn rewards!",
      color: "from-green-500/80 to-emerald-600/80",
      bgColor: "bg-green-500/10",
    },
    {
      icon: "🧠",
      title: "Quiz Master",
      description: "Answer trivia questions on various topics. Knowledge pays off!",
      color: "from-purple-500/80 to-violet-600/80",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: "🧩",
      title: "Puzzle Pro",
      description: "Solve brain-teasing puzzles. Challenge your logical thinking!",
      color: "from-orange-500/80 to-amber-600/80",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: "🔐",
      title: "Captcha Pro",
      description: "Solve captcha challenges quickly. Fast recognition skills rewarded!",
      color: "from-pink-500/80 to-rose-600/80",
      bgColor: "bg-pink-500/10",
    },
  ];

  const features = [
    { icon: "💰", title: "Real Rewards", desc: "Convert points to rewards" },
    { icon: "🎮", title: "5 Game Modes", desc: "Multiple ways to earn" },
    { icon: "⚡", title: "Instant Play", desc: "No downloads required" },
    { icon: "🔒", title: "Secure Platform", desc: "Your data is protected" },
    { icon: "📱", title: "Mobile Friendly", desc: "Play anywhere, anytime" },
    { icon: "🏆", title: "Leaderboards", desc: "Compete with others" },
    { icon: "💳", title: "Easy Withdrawals", desc: "Quick UPI transfers" },
    { icon: "🎯", title: "Daily Bonuses", desc: "Login rewards everyday" },
  ];

  const reviews = [
    {
      name: "Rahul S.",
      location: "Mumbai",
      rating: 5,
      text: "Amazing app! I've earned ₹5000+ just by playing games during my free time. The math challenges are my favorite!",
    },
    {
      name: "Priya M.",
      location: "Bangalore",
      rating: 5,
      text: "Finally a legit earning app! Withdrawals are super fast and the games are actually fun. Love the typing challenges!",
    },
    {
      name: "Amit K.",
      location: "Delhi",
      rating: 5,
      text: "Best way to utilize free time. I play quiz games daily and earn consistently. Highly recommended!",
    },
  ];

  return (
    <>
      <SEO 
        title="Home" 
        description="Join Solve2Win to play educational games, solve puzzles, and earn real rewards. The best platform to learn and earn simultaneously."
        keywords="play to earn, educational games, math puzzle, typing game, rewards, crypto, wallet"
        canonicalPath="/"
      />
      <div className="-mt-10 md:-mt-12 -mx-4 sm:-mx-6 lg:-mx-8">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center glass-card dark:glass-card rounded-full px-5 py-2.5 mb-8 shadow-lg border border-white/40 dark:border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-3 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Trusted by 50,000+ Indians
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
            Play Games.{" "}
            <span className="bg-gradient-to-r from-india-saffron via-india-green to-india-green bg-clip-text text-transparent">
              Earn Real Rewards.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            India's #1 skill-based gaming platform. Solve puzzles, Solve quizzes,Solve easy Maths questions, 
            type fast, and convert your skills into real rewards!
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12">
            <div className="glass-card dark:glass-card rounded-2xl px-6 py-5 shadow-xl border border-white/50 dark:border-white/10 backdrop-blur-xl min-w-[140px]">
              <div className="text-3xl md:text-4xl font-black text-india-saffron drop-shadow-sm">50K+</div>
              <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Active Players</div>
            </div>
            <div className="glass-card dark:glass-card rounded-2xl px-6 py-5 shadow-xl border border-white/50 dark:border-white/10 backdrop-blur-xl min-w-[140px]">
              <div className="text-3xl md:text-4xl font-black text-india-green drop-shadow-sm">₹10k+</div>
              <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Paid to Users</div>
            </div>
            <div className="glass-card dark:glass-card rounded-2xl px-6 py-5 shadow-xl border border-white/50 dark:border-white/10 backdrop-blur-xl min-w-[140px]">
              <div className="text-3xl md:text-4xl font-black text-india-white drop-shadow-sm">5</div>
              <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Game Modes</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="group bg-gradient-to-r from-india-saffron to-india-green text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
            >
              <span className="mr-2">🎮</span> Start Playing Now
            </Link>
            <Link
              to="/community"
              className="glass-card dark:glass-card text-gray-700 dark:text-white px-10 py-4 rounded-full text-lg font-bold shadow-lg border border-white/60 dark:border-white/10 hover:border-white/80 dark:hover:border-white/20 hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 backdrop-blur-xl"
            >
              <span className="mr-2">💬</span> Join Community
            </Link>
          </div>
        </div>
      </section>

      {/* Game Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
              Choose Your Game Mode
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              5 exciting ways to earn. Pick your favorite and start winning!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameCategories.map((game, index) => (
              <div
                key={index}
                className="glass-card dark:glass-card rounded-3xl p-6 shadow-xl border border-white/50 dark:border-white/10 hover:border-white/70 dark:hover:border-white/20 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer group backdrop-blur-xl"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg backdrop-blur-sm`}
                >
                  {game.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {game.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{game.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Start earning in just 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center glass-card dark:glass-card rounded-3xl p-8 border border-white/50 dark:border-white/10 shadow-xl backdrop-blur-xl">
              <div className="w-20 h-20 bg-gradient-to-br from-india-saffron/90 to-orange-400/90 rounded-full flex items-center justify-center text-4xl mx-auto mb-5 shadow-xl backdrop-blur-sm">
                1️⃣
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Sign Up Free</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Create your account in seconds. No payment required to start!
              </p>
            </div>

            <div className="text-center glass-card dark:glass-card rounded-3xl p-8 border border-white/50 dark:border-white/10 shadow-xl backdrop-blur-xl">
              <div className="w-20 h-20 bg-gradient-to-br from-india-blue/90 to-blue-600/90 rounded-full flex items-center justify-center text-4xl mx-auto mb-5 shadow-xl backdrop-blur-sm">
                2️⃣
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Play & Win</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Choose any game mode and earn points for every correct answer!
              </p>
            </div>

            <div className="text-center glass-card dark:glass-card rounded-3xl p-8 border border-white/50 dark:border-white/10 shadow-xl backdrop-blur-xl">
              <div className="w-20 h-20 bg-gradient-to-br from-india-green/90 to-green-600/90 rounded-full flex items-center justify-center text-4xl mx-auto mb-5 shadow-xl backdrop-blur-sm">
                3️⃣
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Withdraw Rewards</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Convert 1000 points = ₹1. Instant UPI transfers to your bank!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rules & Community Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rules Card */}
            <div className="glass-card dark:glass-card rounded-3xl p-8 shadow-xl border border-white/50 dark:border-white/10 backdrop-blur-xl">
              <div className="flex items-center mb-6">
                <span className="text-4xl mr-4">📋</span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Game Rules</h3>
              </div>
              <ul className="space-y-4 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 mr-3 mt-0.5 text-sm">✓</span>
                  <span>Win points for each correct answer</span>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 mr-3 mt-0.5 text-sm">✓</span>
                  <span>Bonus points for speed and streaks</span>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 mr-3 mt-0.5 text-sm">✓</span>
                  <span>Minimum ₹10 withdrawal</span>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 mr-3 mt-0.5 text-sm">✓</span>
                  <span>Daily login bonuses available</span>
                </li>
              </ul>
            </div>

            {/* Community Card */}
            <div className="relative overflow-hidden rounded-3xl p-8 shadow-xl border border-blue-400/30 backdrop-blur-xl bg-gradient-to-br from-india-blue/90 to-blue-700/90 text-white">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <span className="text-4xl mr-4">💬</span>
                  <h3 className="text-2xl font-bold">Community Hub</h3>
                </div>
                <p className="mb-6 opacity-90 leading-relaxed">
                  Join our community! Share feedback, request features, and stay 
                  updated with the latest announcements.
                </p>
                <Link
                  to="/community"
                  className="inline-flex items-center bg-white/95 text-india-blue px-6 py-3 rounded-xl font-bold hover:shadow-xl hover:bg-white transition-all duration-300 transform hover:scale-105"
                >
                  Visit Community <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
              Why Choose Solve2Win?
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              The most trusted gaming platform in India
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center glass-card dark:glass-card rounded-2xl p-5 border border-white/40 dark:border-white/10 hover:border-white/60 dark:hover:border-white/20 hover:shadow-lg transition-all duration-300 backdrop-blur-xl"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-sm md:text-base">{feature.title}</h3>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
              What Players Say
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Join thousands of happy earners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="glass-card dark:glass-card rounded-3xl p-6 shadow-xl border border-white/50 dark:border-white/10 backdrop-blur-xl"
              >
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-india-saffron to-india-green rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="font-bold text-gray-900 dark:text-white">{review.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{review.location}</div>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-[2rem] p-10 md:p-16 text-center text-white shadow-2xl bg-gradient-to-r from-india-saffron via-india-blue to-india-green">
            <div className="absolute top-0 left-0 w-60 h-60 bg-white/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black mb-6 drop-shadow-lg">
                Ready to Start Earning?
              </h2>
              <p className="text-lg md:text-xl mb-10 opacity-95 max-w-2xl mx-auto">
                Join 50,000+ players who are already earning. Your skills deserve rewards!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/auth"
                  className="bg-white text-india-blue px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                >
                  🚀 Create Free Account
                </Link>
                <Link
                  to="/community"
                  className="border-2 border-white/80 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-white/20 backdrop-blur-sm transition-all duration-300"
                >
                  💬 Join Community
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};
