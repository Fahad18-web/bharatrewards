import { Link } from "react-router-dom";

export default function Landing() {
  const gameCategories = [
    {
      icon: "🧮",
      title: "Math Challenge",
      description: "Solve equations quickly and earn points. Test your mental math skills!",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: "⌨️",
      title: "Speed Typing",
      description: "Type fast and accurately to win. Improve your WPM and earn rewards!",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: "🧠",
      title: "Quiz Master",
      description: "Answer trivia questions on various topics. Knowledge pays off!",
      color: "from-purple-500 to-violet-600",
    },
    {
      icon: "🧩",
      title: "Puzzle Pro",
      description: "Solve brain-teasing puzzles. Challenge your logical thinking!",
      color: "from-orange-500 to-amber-600",
    },
    {
      icon: "🔐",
      title: "Captcha Pro",
      description: "Solve captcha challenges quickly. Fast recognition skills rewarded!",
      color: "from-pink-500 to-rose-600",
    },
  ];

  const features = [
    { icon: "💰", title: "Real Cash Rewards", desc: "Convert points to real money" },
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
    <div className="min-h-screen bg-gradient-to-br from-india-green via-white to-india-saffron">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">🏆</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-india-saffron via-india-blue to-india-green bg-clip-text text-transparent">
                Solve2Win
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/auth"
                className="text-gray-600 hover:text-india-blue transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                to="/auth"
                className="bg-gradient-to-r from-india-saffron to-india-green text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm">
            <span className="text-green-500 mr-2">●</span>
            <span className="text-sm font-medium text-gray-700">
              Trusted by 50,000+ Indians
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Play Games.{" "}
            <span className="bg-gradient-to-r from-india-saffron to-india-green bg-clip-text text-transparent">
              Earn Real Cash.
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            India's #1 skill-based gaming platform. Solve puzzles, play quizzes, 
            type fast, and convert your skills into real money!
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg">
              <div className="text-3xl font-bold text-india-saffron">50K+</div>
              <div className="text-sm text-gray-600">Active Players</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg">
              <div className="text-3xl font-bold text-india-green">₹10L+</div>
              <div className="text-sm text-gray-600">Paid to Users</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg">
              <div className="text-3xl font-bold text-india-blue">5</div>
              <div className="text-sm text-gray-600">Game Modes</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-gradient-to-r from-india-saffron to-india-green text-white px-8 py-4 rounded-full text-lg font-bold hover:shadow-xl transform hover:scale-105 transition-all"
            >
              🎮 Start Playing Now
            </Link>
            <Link
              to="/community"
              className="bg-white text-gray-700 px-8 py-4 rounded-full text-lg font-bold hover:shadow-xl border-2 border-gray-200 transition-all"
            >
              💬 Join Community
            </Link>
          </div>
        </div>
      </section>

      {/* Game Categories */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Game Mode
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              5 exciting ways to earn. Pick your favorite and start winning!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameCategories.map((game, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all cursor-pointer group"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${game.color} rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}
                >
                  {game.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {game.title}
                </h3>
                <p className="text-gray-600">{game.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600">Start earning in just 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-india-saffron to-orange-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg">
                1️⃣
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sign Up Free</h3>
              <p className="text-gray-600">
                Create your account in seconds. No payment required to start!
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-india-blue to-blue-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg">
                2️⃣
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Play & Win</h3>
              <p className="text-gray-600">
                Choose any game mode and earn points for every correct answer!
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-india-green to-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg">
                3️⃣
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Withdraw Cash</h3>
              <p className="text-gray-600">
                Convert 1000 points = ₹1. Instant UPI transfers to your bank!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rules & Community Cards */}
      <section className="py-12 px-4 bg-gradient-to-r from-india-saffron/10 to-india-green/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rules Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">📋</span>
                <h3 className="text-xl font-bold text-gray-900">Game Rules</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Win points for each correct answer
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Bonus points for speed and streaks
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Minimum ₹10 withdrawal
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Daily login bonuses available
                </li>
              </ul>
            </div>

            {/* Community Card */}
            <div className="bg-gradient-to-br from-india-blue to-blue-700 rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">💬</span>
                <h3 className="text-xl font-bold">Community Hub</h3>
              </div>
              <p className="mb-4 opacity-90">
                Join our community! Share feedback, request features, and stay 
                updated with the latest announcements.
              </p>
              <Link
                to="/community"
                className="inline-flex items-center bg-white text-india-blue px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Visit Community →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Solve2Win?
            </h2>
            <p className="text-gray-600">
              The most trusted gaming platform in India
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Players Say
            </h2>
            <p className="text-gray-600">
              Join thousands of happy earners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-india-saffron to-india-green rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <div className="font-bold text-gray-900">{review.name}</div>
                    <div className="text-sm text-gray-500">{review.location}</div>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-gray-600">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-india-saffron via-india-blue to-india-green">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 50,000+ players who are already earning. Your skills deserve rewards!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-white text-india-blue px-10 py-4 rounded-full text-lg font-bold hover:shadow-xl transform hover:scale-105 transition-all"
            >
              🚀 Create Free Account
            </Link>
            <Link
              to="/community"
              className="border-2 border-white text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-white/10 transition-all"
            >
              💬 Join Community
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🏆</span>
                <span className="text-xl font-bold">Solve2Win</span>
              </div>
              <p className="text-gray-400 text-sm">
                India's trusted skill-based gaming platform. Play smart, earn real!
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Games</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Math Challenge</li>
                <li>Speed Typing</li>
                <li>Quiz Master</li>
                <li>Puzzle Pro</li>
                <li>Captcha Pro</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/auth" className="hover:text-white">Login</Link></li>
                <li><Link to="/auth" className="hover:text-white">Sign Up</Link></li>
                <li><Link to="/community" className="hover:text-white">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/community" className="hover:text-white">Report Issues</Link></li>
                <li><Link to="/community" className="hover:text-white">Feature Requests</Link></li>
                <li><Link to="/community" className="hover:text-white">Feedback</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 Solve2Win. Made with ❤️ in India 🇮🇳</p>
            <p className="mt-2">Play responsibly. Must be 18+ to participate.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
