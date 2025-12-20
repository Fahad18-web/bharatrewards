import React, { useEffect, useState, useCallback } from 'react';

type AdMode = 'correct' | 'wrong' | 'skip';

interface InterstitialAdProps {
  onClose: () => void;
  autoCloseSeconds?: number;
  isCorrect?: boolean; // backward compat, will be inferred if mode not provided
  pointsEarned?: number;
  mode?: AdMode;
}

export const InterstitialAd: React.FC<InterstitialAdProps> = ({ 
  onClose, 
  autoCloseSeconds = 5,
  isCorrect = false,
  pointsEarned = 0,
  mode
}) => {
  const [countdown, setCountdown] = useState(autoCloseSeconds);
  const [canSkip, setCanSkip] = useState(false);
  const [autoClosed, setAutoClosed] = useState(false);

  const bannerMode: AdMode = mode
    ? mode
    : isCorrect
      ? 'correct'
      : 'wrong';

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanSkip(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-close when countdown finishes (5s default)
  useEffect(() => {
    if (countdown === 0 && !autoClosed) {
      setAutoClosed(true);
      onClose();
    }
  }, [countdown, autoClosed, onClose]);

  const handleSkip = useCallback(() => {
    if (canSkip) {
      onClose();
    }
  }, [canSkip, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4">
        {/* Result Banner */}
        <div className={`mb-4 p-4 rounded-2xl text-center ${
          bannerMode === 'correct'
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
            : bannerMode === 'skip'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
              : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
        }`}>
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl">
              {bannerMode === 'correct' ? '✅' : bannerMode === 'skip' ? '⏭️' : '❌'}
            </span>
            <div>
              <p className="font-bold text-lg">
                {bannerMode === 'correct' ? 'Correct Answer!' : bannerMode === 'skip' ? 'Skipping' : 'Wrong Answer'}
              </p>
              {bannerMode === 'correct' && pointsEarned > 0 && (
                <p className="text-sm opacity-90">+{pointsEarned} points earned!</p>
              )}
            </div>
          </div>
        </div>

        {/* Result Container */}
        <div className="glass-card dark:glass-card rounded-3xl overflow-hidden border border-white/30 dark:border-white/10 shadow-2xl">
          {/* Header */}
          <div className="bg-gray-100 dark:bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Round Result</span>
            </div>
            <div className="flex items-center gap-3">
              {!canSkip && (
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                  Continuing in {countdown}s
                </span>
              )}
              {canSkip && (
                <button
                  onClick={handleSkip}
                  className="px-4 py-1.5 bg-pakistan-green text-white text-sm font-bold rounded-full hover:bg-green-800 transition-colors shadow-md"
                >
                  Continue →
                </button>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 min-h-[220px] flex flex-col items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-pakistan-green/20 to-pakistan-accent/20 flex items-center justify-center">
                <span className="text-4xl">🎯</span>
              </div>
              <p className="text-gray-700 dark:text-gray-200 font-black text-xl mb-2">
                {bannerMode === 'correct'
                  ? 'Nice! Keep the streak going.'
                  : bannerMode === 'skip'
                    ? 'Time\'s up — next one is yours.'
                    : 'No worries — try the next one.'}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                {bannerMode === 'correct' && pointsEarned > 0
                  ? `You earned ${pointsEarned} points.`
                  : 'Get ready for the next question.'}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-gray-200 dark:bg-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-pakistan-green to-pakistan-accent transition-all duration-1000"
              style={{ width: `${((autoCloseSeconds - countdown) / autoCloseSeconds) * 100}%` }}
            />
          </div>
        </div>

        {/* Skip hint */}
        {canSkip && (
          <p className="text-center text-white/70 mt-4 text-sm animate-pulse">
            Click "Continue" or press any key to proceed
          </p>
        )}
      </div>
    </div>
  );
};
