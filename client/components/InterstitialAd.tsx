import React, { useEffect, useState, useCallback } from 'react';

interface InterstitialAdProps {
  onClose: () => void;
  autoCloseSeconds?: number;
  isCorrect?: boolean;
  pointsEarned?: number;
}

export const InterstitialAd: React.FC<InterstitialAdProps> = ({ 
  onClose, 
  autoCloseSeconds = 5,
  isCorrect = false,
  pointsEarned = 0
}) => {
  const [countdown, setCountdown] = useState(autoCloseSeconds);
  const [canSkip, setCanSkip] = useState(false);

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

  const handleSkip = useCallback(() => {
    if (canSkip) {
      onClose();
    }
  }, [canSkip, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl mx-4">
        {/* Result Banner */}
        <div className={`mb-4 p-4 rounded-2xl text-center ${
          isCorrect 
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
            : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
        }`}>
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl">{isCorrect ? '✅' : '❌'}</span>
            <div>
              <p className="font-bold text-lg">
                {isCorrect ? 'Correct Answer!' : 'Wrong Answer'}
              </p>
              {isCorrect && pointsEarned > 0 && (
                <p className="text-sm opacity-90">+{pointsEarned} points earned!</p>
              )}
            </div>
          </div>
        </div>

        {/* Ad Container */}
        <div className="glass-card dark:glass-card rounded-3xl overflow-hidden border border-white/30 dark:border-white/10 shadow-2xl">
          {/* Ad Header */}
          <div className="bg-gray-100 dark:bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Advertisement</span>
            </div>
            <div className="flex items-center gap-3">
              {!canSkip && (
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                  Skip in {countdown}s
                </span>
              )}
              {canSkip && (
                <button
                  onClick={handleSkip}
                  className="px-4 py-1.5 bg-india-blue text-white text-sm font-bold rounded-full hover:bg-blue-800 transition-colors shadow-md"
                >
                  Continue →
                </button>
              )}
            </div>
          </div>

          {/* Ad Content Placeholder */}
          <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 min-h-[300px] flex flex-col items-center justify-center">
            {/* 
              ================================================================
              GOOGLE ADSENSE / ADMOB INTEGRATION POINT
              ================================================================
              Replace this placeholder with your actual ad code:
              
              For Google AdSense:
              <ins className="adsbygoogle"
                   style={{ display: 'block' }}
                   data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                   data-ad-slot="XXXXXXXXXX"
                   data-ad-format="auto"
                   data-full-width-responsive="true">
              </ins>
              
              Then call: (window.adsbygoogle = window.adsbygoogle || []).push({});
              
              For React apps, consider using react-adsense or similar packages.
              ================================================================
            */}
            
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-india-saffron/20 to-india-green/20 flex items-center justify-center">
                <span className="text-5xl">📺</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-bold text-lg mb-2">Ad Space</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm max-w-xs mx-auto">
                Your advertisement will appear here. Integrate Google AdSense or AdMob for real ads.
              </p>
              
              {/* Sample Ad Banner Placeholder */}
              <div className="mt-6 p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-white/50 dark:bg-slate-700/50">
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-slate-600 rounded-xl animate-pulse"></div>
                  <div className="text-left">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-slate-600 rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-48 bg-gray-200 dark:bg-slate-600 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-gray-200 dark:bg-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-india-saffron to-india-green transition-all duration-1000"
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
