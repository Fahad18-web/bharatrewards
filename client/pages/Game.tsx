import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCurrentUser, saveUser, getSettings } from '../services/storageService';
import { fetchGameQuestions, updateUserPoints } from '../services/apiService';
import { Question, User } from '../types';
import { InterstitialAd } from '../components/InterstitialAd';
import SEO from '../components/SEO';

const PREFETCH_THRESHOLD = 3; 

export const Game: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const normalizedCategory = (category || '').toUpperCase();

  const timerSeconds = React.useMemo(() => {
    if (normalizedCategory === 'QUIZ') return 30;
    if (normalizedCategory === 'TYPING') return 40;
    return 15;
  }, [normalizedCategory]);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [pointsPerQ, setPointsPerQ] = useState(10);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Loading States
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Interstitial Ad State
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [lastPointsEarned, setLastPointsEarned] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Refs for state access inside intervals/async
  const isFetchingRef = useRef(false);
  const questionsRef = useRef(questions);
  const currentIndexRef = useRef(currentIndex);
  
  useEffect(() => { questionsRef.current = questions; }, [questions]);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);

  // Check Auth & Settings
  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      navigate('/auth');
      return;
    }
    setUser(u);
    const settings = getSettings();
    setPointsPerQ(settings.pointsPerQuestion);
  }, [navigate]);

  const fetchBatch = useCallback(async (count: number) => {
    if (isFetchingRef.current || !normalizedCategory) return;
    isFetchingRef.current = true;
    if (questionsRef.current.length === 0) {
      setFetchError(null);
    }
  
    try {
      const newQs = await fetchGameQuestions(normalizedCategory, count);
      const validQs = Array.isArray(newQs)
        ? newQs.filter((q) => {
            if (!q || !q.questionText || !q.questionText.trim()) return false;
            if (!q.correctAnswer || !String(q.correctAnswer).trim()) return false;
            if (normalizedCategory === 'QUIZ') {
              return Array.isArray(q.options) && q.options.length >= 2;
            }
            return true;
          })
        : [];

      if (validQs.length === 0) {
        if (questionsRef.current.length === 0) {
          setFetchError('No questions available for this category right now. Please try again in a moment.');
        }
      } else {
        setQuestions(prev => [...prev, ...validQs]);
      }
    } catch (e) {
      console.error('Failed to fetch questions', e);
      if (questionsRef.current.length === 0) {
        setFetchError(e?.message || 'Unable to load questions. Please ensure you are logged in and try again.');
      }
    } finally {
      isFetchingRef.current = false;
    }
  }, [normalizedCategory]);

  const startGame = useCallback(async () => {
    if (!normalizedCategory) {
      setFetchError('Unknown category. Please pick a valid mode from the dashboard.');
      return;
    }
    setInitialLoading(true);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setFetchError(null);
    
    // 1. Fast load: Fetch only 3 questions initially to show UI ASAP
    await fetchBatch(3); 
    setInitialLoading(false);
    setTimeLeft(timerSeconds);

    // 2. Background load: Immediately fetch more to build buffer
    fetchBatch(5);
  }, [fetchBatch, normalizedCategory]);

    // Initial Game Start
    useEffect(() => {
      if (normalizedCategory) {
        startGame();
      }
    }, [normalizedCategory, startGame]);

  const [adMode, setAdMode] = useState<'correct' | 'wrong' | 'skip'>('wrong');

  const handleNext = useCallback((awardedPoints: number = 0, showAd: boolean = true, reason?: 'correct' | 'wrong' | 'skip') => {
    if (user) {
      // Update local state immediately for responsive UI
      const updatedUser = { ...user };
      updatedUser.points += awardedPoints;
      if (awardedPoints > 0) updatedUser.solvedCount += 1;
      
      // Update local cache immediately
      saveUser(updatedUser);
      setUser(updatedUser);
      setScore(s => s + awardedPoints);
      
      // Sync with backend (fire and forget for speed)
      if (awardedPoints > 0) {
        updateUserPoints(user.id, awardedPoints, true).catch(err => {
          console.error('Failed to sync points with server:', err);
        });
      }
    }

    const resolvedReason = reason ?? (awardedPoints > 0 ? 'correct' : 'wrong');

    // Store result for interstitial display
    setLastAnswerCorrect(resolvedReason === 'correct');
    setLastPointsEarned(awardedPoints);
    setAdMode(resolvedReason);

    // Show interstitial ad after answering (not on timeout from ad screen)
    if (showAd) {
      setIsPaused(true);
      setShowInterstitial(true);
    } else {
      // Direct progression without ad
      progressToNextQuestion();
    }
  }, [user]);

  const progressToNextQuestion = useCallback(() => {
    const nextIndex = currentIndexRef.current + 1;
    
    // Check if we need to prefetch more questions
    const remainingQuestions = questionsRef.current.length - nextIndex;
    if (remainingQuestions <= PREFETCH_THRESHOLD) {
      fetchBatch(5); // Fetch 5 more in background
    }

    setCurrentIndex(nextIndex);
    setTimeLeft(timerSeconds);
    setUserAnswer('');
    setIsPaused(false);
  }, [fetchBatch, timerSeconds]);

  const handleAdClose = useCallback(() => {
    setShowInterstitial(false);
    progressToNextQuestion();
  }, [progressToNextQuestion]);

  // Timer Logic
  useEffect(() => {
    if (initialLoading || isPaused) return;
    
    // If we ran out of questions (user caught up to fetcher), wait
    if (!questions[currentIndex]) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNext(0, true, 'skip'); // Timeout: show skip ad
          return timerSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [initialLoading, isPaused, currentIndex, questions, handleNext, timerSeconds]);

  const submitAnswer = (e?: React.FormEvent) => {
    e?.preventDefault();
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    
    let isCorrect = false;
    if (currentQ.type === 'TYPING') {
        isCorrect = userAnswer === currentQ.correctAnswer;
    } else if (currentQ.type === 'CAPTCHA') {
        // CAPTCHA is case-sensitive and exact match
        isCorrect = userAnswer.trim() === currentQ.correctAnswer;
    } else {
        isCorrect = userAnswer.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();
    }

    if (isCorrect) {
      // Correct: go straight to next question without popup
      handleNext(pointsPerQ, false, 'correct');
    } else {
      // Wrong: show popup, then advance
      handleNext(0, true, 'wrong');
    }
  };

  // ---------------- RENDER ----------------

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in-up">
        <div className="relative w-28 h-28 mb-8">
           <div className="absolute inset-0 border-8 border-gray-100 rounded-full"></div>
           <div className="absolute inset-0 border-8 border-t-india-saffron border-r-transparent border-b-india-green border-l-transparent rounded-full animate-spin"></div>
           <div className="absolute inset-0 flex items-center justify-center text-4xl">🚀</div>
        </div>
        <h2 className="text-3xl font-black text-gray-800 mb-3 tracking-tight">Starting Engine</h2>
        <p className="text-gray-500 font-medium">Preparing your challenge...</p>
      </div>
    );
  }

  // If user catches up to the fetcher, show a mini loader
  if (fetchError && questions.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-red-50 border border-red-100 flex items-center justify-center text-3xl">⚠️</div>
        <div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Cannot Load Questions</h2>
          <p className="text-gray-500 leading-relaxed">{fetchError}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 rounded-2xl border border-gray-200 font-semibold text-gray-700 bg-white shadow-sm"
          >
            Back to Dashboard
          </button>
          <button
            onClick={startGame}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-india-blue to-blue-800 text-white font-bold shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  if (!currentQ) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] animate-pulse">
        <div className="w-16 h-16 border-4 border-india-blue border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Loading more questions...</p>
      </div>
     );
  }

  const progressPercent = ((timerSeconds - timeLeft) / timerSeconds) * 100;

  return (
    <>
      <SEO 
        title={`${normalizedCategory === 'MATH' ? 'Math' : normalizedCategory === 'QUIZ' ? 'Quiz' : normalizedCategory === 'PUZZLE' ? 'Puzzle' : normalizedCategory === 'CAPTCHA' ? 'Captcha' : 'Typing'} Challenge`}
        description={`Play ${normalizedCategory} games on Solve2Win and earn rewards.`}
        canonicalPath={`/game/${normalizedCategory.toLowerCase()}`}
      />
      <div className="max-w-4xl mx-auto py-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-10 glass dark:glass-dark px-8 py-5 rounded-[2rem]">
        <div className="flex items-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-india-saffron to-orange-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg mr-5 border border-white/20">
            {normalizedCategory === 'MATH' ? '➗' : normalizedCategory === 'QUIZ' ? '💡' : normalizedCategory === 'PUZZLE' ? '🧩' : normalizedCategory === 'CAPTCHA' ? '🔐' : '⌨️'}
          </div>
          <div>
            <h2 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1">Category</h2>
            <p className="font-bold text-2xl text-gray-800 dark:text-white leading-none">{normalizedCategory === 'MATH' ? 'Math' : normalizedCategory === 'QUIZ' ? 'Quiz' : normalizedCategory === 'PUZZLE' ? 'Puzzle' : normalizedCategory === 'CAPTCHA' ? 'Captcha' : 'Typing'}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-8">
           <div className="text-right hidden sm:block">
             <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-1">Session Score</span>
             <span className="font-black text-3xl text-india-green dark:text-green-400">+{score}</span>
           </div>
           
           <div className="relative w-16 h-16 flex items-center justify-center">
             <svg className="absolute w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="#f3f4f6" className="dark:stroke-slate-700" strokeWidth="6" fill="transparent" />
                <circle cx="32" cy="32" r="28" stroke={timeLeft < 5 ? '#ef4444' : '#000080'} strokeWidth="6" fill="transparent" strokeDasharray="175.93" strokeDashoffset={175.93 * (progressPercent / 100)} className="transition-all duration-1000 linear" strokeLinecap="round" />
             </svg>
             <span className={`font-black text-xl ${timeLeft < 5 ? 'text-red-500' : 'text-gray-800 dark:text-white'}`}>{timeLeft}</span>
           </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-card dark:glass-card p-10 md:p-14 rounded-[3rem] shadow-2xl min-h-[450px] flex flex-col relative overflow-hidden animate-fade-in-up">
        {/* Background decorative number */}
        <div className="absolute -top-10 -right-4 text-[12rem] font-black text-gray-900 dark:text-white opacity-[0.03] select-none pointer-events-none transition-all">
          {currentIndex + 1}
        </div>

        <div className="mb-10 select-none no-select flex-grow" onCopy={(e) => e.preventDefault()}>
          <div className="inline-block px-4 py-1.5 bg-gray-100/80 dark:bg-slate-700/80 backdrop-blur rounded-full text-xs font-black text-gray-500 dark:text-gray-300 mb-6 uppercase tracking-wider border border-gray-200 dark:border-slate-600">
            Question {currentIndex + 1}
          </div>
          
          {currentQ.type === 'CAPTCHA' ? (
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">Type the characters you see below:</p>
              <div 
                className={`
                  relative px-8 py-6 rounded-2xl select-none
                  ${currentQ.captchaStyle === 'noisy' ? 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100' : ''}
                  ${currentQ.captchaStyle === 'distorted' ? 'bg-gradient-to-r from-blue-50 to-purple-50' : ''}
                  ${currentQ.captchaStyle === 'strikethrough' ? 'bg-yellow-50' : ''}
                  ${currentQ.captchaStyle === 'rotated' ? 'bg-green-50' : ''}
                  ${currentQ.captchaStyle === 'mixed' ? 'bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50' : ''}
                  border-2 border-dashed border-gray-300 shadow-inner
                `}
                style={{ 
                  backgroundImage: currentQ.captchaStyle === 'noisy' 
                    ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
                    : undefined,
                  backgroundBlendMode: 'overlay'
                }}
              >
                {/* Decorative lines for strikethrough/noisy styles */}
                {(currentQ.captchaStyle === 'strikethrough' || currentQ.captchaStyle === 'noisy') && (
                  <>
                    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                      <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-gray-400 opacity-40 transform -rotate-2"></div>
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-500 opacity-30 transform rotate-1"></div>
                      <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-gray-400 opacity-40 transform -rotate-1"></div>
                    </div>
                  </>
                )}
                
                <span 
                  className={`
                    font-mono text-4xl md:text-6xl font-black tracking-[0.3em] relative z-10
                    ${currentQ.captchaStyle === 'distorted' ? 'italic' : ''}
                    ${currentQ.captchaStyle === 'rotated' ? 'transform -rotate-3' : ''}
                  `}
                  style={{
                    textShadow: currentQ.captchaStyle === 'mixed' 
                      ? '2px 2px 0 rgba(255,100,100,0.3), -2px -2px 0 rgba(100,100,255,0.3)' 
                      : '1px 1px 2px rgba(0,0,0,0.1)',
                    letterSpacing: currentQ.captchaStyle === 'distorted' ? '0.15em' : '0.3em',
                    color: currentQ.captchaStyle === 'noisy' ? '#1a1a1a' : '#333'
                  }}
                >
                  {currentQ.questionText.split('').map((char, i) => (
                    <span 
                      key={i} 
                      className="inline-block"
                      style={{
                        transform: currentQ.captchaStyle === 'mixed' || currentQ.captchaStyle === 'distorted'
                          ? `rotate(${(i % 2 === 0 ? 1 : -1) * (5 + (i * 2) % 10)}deg) translateY(${(i % 3 - 1) * 3}px)`
                          : currentQ.captchaStyle === 'rotated'
                          ? `rotate(${(i - 2) * 4}deg)`
                          : undefined,
                        color: currentQ.captchaStyle === 'mixed' 
                          ? ['#c53030', '#2b6cb0', '#2f855a', '#9b2c2c', '#4a5568'][i % 5]
                          : undefined
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-3">Case-sensitive • No spaces</p>
            </div>
          ) : (
            <h3 className="text-3xl md:text-5xl font-black text-gray-800 dark:text-white leading-tight">
              {currentQ.questionText}
            </h3>
          )}
        </div>

        <div className="mt-auto">
          {currentQ.options ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setUserAnswer(opt);
                    // Minimal delay to show selection click effect before moving on
                    setTimeout(() => {
                        if (opt.toLowerCase() === currentQ.correctAnswer.toLowerCase()) {
                          // Correct: no popup
                          handleNext(pointsPerQ, false, 'correct');
                        } else {
                          // Wrong: show popup then auto-advance
                          handleNext(0, true, 'wrong');
                        }
                    }, 100);
                  }}
                  className="group relative bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-600 border-2 border-white/50 dark:border-slate-600 hover:border-india-saffron dark:hover:border-india-saffron p-6 rounded-2xl text-left transition-all duration-200 shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]"
                >
                  <div className="flex items-center">
                     <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 group-hover:bg-india-saffron group-hover:text-white flex items-center justify-center font-bold text-base text-gray-500 dark:text-gray-400 transition-colors mr-4 shadow-inner">
                       {String.fromCharCode(65 + idx)}
                     </div>
                     <span className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white text-lg md:text-xl">{opt}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={submitAnswer} className="relative">
              {currentQ.type === 'TYPING' ? (
                <div>
                   <div className="mb-3 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Type the text above exactly:</div>
                   <textarea
                      rows={4}
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="w-full p-6 text-xl border-2 border-gray-200 dark:border-slate-600 rounded-3xl focus:border-india-blue focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/30 outline-none transition-all resize-none shadow-inner bg-gray-50/50 dark:bg-slate-700/50 focus:bg-white dark:focus:bg-slate-800 text-gray-800 dark:text-white"
                      placeholder="Start typing here..."
                      onPaste={(e) => { e.preventDefault(); alert("Cheating not allowed! Type it out."); }}
                      autoFocus
                  />
                </div>
              ) : currentQ.type === 'CAPTCHA' ? (
                <div>
                   <div className="mb-3 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Enter the characters shown above:</div>
                   <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value.toUpperCase())}
                      className="w-full p-6 text-3xl font-mono font-bold tracking-[0.2em] text-center border-2 border-gray-200 dark:border-slate-600 rounded-3xl focus:border-india-blue focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/30 outline-none transition-all shadow-inner bg-gray-50/50 dark:bg-slate-700/50 focus:bg-white dark:focus:bg-slate-800 uppercase text-gray-800 dark:text-white"
                      placeholder="TYPE HERE..."
                      onPaste={(e) => { e.preventDefault(); alert("No pasting allowed!"); }}
                      autoComplete="off"
                      spellCheck={false}
                      autoFocus
                  />
                </div>
              ) : (
                <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full p-6 text-2xl font-bold border-2 border-gray-200 dark:border-slate-600 rounded-3xl focus:border-india-blue focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/30 outline-none transition-all shadow-inner bg-gray-50/50 dark:bg-slate-700/50 focus:bg-white dark:focus:bg-slate-800 text-gray-800 dark:text-white"
                    placeholder="Type your answer..."
                    autoFocus
                />
              )}
              
              <button 
                type="submit" 
                className="mt-8 w-full bg-gradient-to-r from-india-blue to-blue-800 hover:to-blue-900 text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-1 active:scale-[0.99] text-xl"
              >
                Submit Answer
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Interstitial Ad between questions */}
      {showInterstitial && (
        <InterstitialAd
          onClose={handleAdClose}
          autoCloseSeconds={5}
          isCorrect={lastAnswerCorrect}
          pointsEarned={lastPointsEarned}
          mode={adMode}
        />
      )}
    </div>
    </>
  );
};