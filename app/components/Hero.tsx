'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Hero() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [view, setView] = useState<'email' | 'otp'>('email');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [shakeError, setShakeError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasSignedUp, setHasSignedUp] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Check for signup cookie
    const checkCookie = () => {
      const match = document.cookie.match(new RegExp('(^| )mnky_signed_up=([^;]+)'));
      if (match) setHasSignedUp(true);
    };
    checkCookie();
  }, []);

  const setSignupCookie = () => {
    const d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000)); // 1 year
    document.cookie = "mnky_signed_up=true;expires=" + d.toUTCString() + ";path=/";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      console.error(error);
      setStatus('error');
      if (error.status === 429) {
         setErrorMessage('You are being rate limited. Please wait a moment.');
      } else {
         setErrorMessage(error.message || 'Something went wrong. Please try again.');
      }
      setTimeout(() => {
          setStatus('idle');
          setErrorMessage('');
      }, 3000);
      return;
    }

    setStatus('idle');
    setView('otp');
  };

  const verifyCode = async (code: string) => {
    setStatus('loading');

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    });

    if (error) {
      console.error(error);
      setStatus('idle'); 
      setShakeError(true);
      // Delay clearing OTP to show error state with numbers
      setTimeout(() => {
        setOtp(['', '', '', '', '', '']); 
        setShakeError(false);
        if (otpRefs.current[0]) otpRefs.current[0].focus();
      }, 1000);
      return;
    }

    setStatus('success');
    setSignupCookie();
    setTimeout(() => {
      setIsExpanded(false);
      setTimeout(() => {
        setHasSignedUp(true);
        setStatus('idle');
        setEmail('');
        setOtp(['', '', '', '', '', '']);
        setView('email');
      }, 2000);
    }, 2000);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length === 6) {
      verifyCode(code);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit if complete
    if (newOtp.every(digit => digit !== '')) {
      verifyCode(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (view === 'otp') {
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    }
  }, [view]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 z-20">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="w-[600px] h-[600px] md:w-[900px] md:h-[900px] bg-white/[0.03] rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center max-w-4xl mx-auto"
      >
        <h2 className="text-xs md:text-sm font-mono text-neutral-400 tracking-[0.3em] mb-8 uppercase opacity-80">
          The Anti-App
        </h2>
        <h1 className="text-8xl md:text-[10rem] font-bold tracking-normal mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/30 pb-2 pr-4">
          MNKY
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-2xl text-neutral-400 leading-relaxed mb-16 font-light text-balance">
          Your personal productivity assistant, living exclusively in iMessage.
          <span className="block mt-2 text-neutral-500">No new apps. No clutter. Just text.</span>
        </p>
        
        <div className="relative w-full max-w-md mx-auto">
          <div className="h-16 flex items-center justify-center relative z-20">
            {hasSignedUp ? (
              <motion.div
                key="signed-up"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-black font-medium text-sm cursor-default text-center w-full max-w-[300px] leading-relaxed"
              >
                You are signed up for updates.
              </motion.div>
            ) : (
              <motion.div
              layout
              onClick={() => !isExpanded && setIsExpanded(true)}
              className={`relative flex items-center justify-center overflow-hidden z-10
                ${isExpanded && view !== 'otp' ? 'cursor-default' : 'cursor-pointer hover:bg-neutral-200'}
                ${view === 'otp' ? 'cursor-default' : ''}
              `}
              style={{ borderRadius: 32 }}
              initial={false}
              animate={{
                width: view === 'otp' ? '100%' : (isExpanded ? '100%' : 260),
                height: 60,
                backgroundColor: view === 'otp' ? 'transparent' : (isExpanded ? 'rgba(255,255,255,0.05)' : '#ffffff'),
                boxShadow: view === 'otp' 
                  ? 'none'
                  : (isExpanded 
                    ? '0 0 0 1px rgba(255,255,255,0.1)' 
                    : '0 0 20px -5px rgba(255,255,255,0.3), 0 20px 40px -15px rgba(255,255,255,0.2)')
              }}
              transition={{ 
                type: "spring", 
                stiffness: 250, 
                damping: 25,
                mass: 0.5
              }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                 <AnimatePresence initial={false} mode="wait">
                   {!isExpanded ? (
                      <motion.div
                        key="label"
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                        className="absolute inset-0 flex items-center justify-center gap-3 text-black font-medium whitespace-nowrap"
                      >
                        Request Early Access
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                   ) : view === 'otp' ? (
                      <motion.form
                        key="otp-form"
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1,
                          x: shakeError ? [-10, 10, -10, 10, 0] : 0
                        }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={handleVerifySubmit}
                        className="absolute inset-0 flex items-center justify-center gap-3"
                      >
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            ref={el => { otpRefs.current[index] = el }}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className={`w-12 h-12 text-center bg-white/5 border rounded-xl text-white text-xl focus:bg-white/10 focus:outline-none transition-all shadow-lg backdrop-blur-sm
                              ${shakeError 
                                ? 'border-red-500/50 focus:border-red-500/50' 
                                : 'border-white/10 focus:border-white/40'
                              }
                            `}
                          />
                        ))}
                      </motion.form>
                   ) : (
                      <motion.form
                        key="email-form"
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: 0.1, duration: 0.2 }}
                        onSubmit={handleSubmit}
                        className="absolute inset-0 flex items-center px-2"
                      >
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="enter your email"
                          required
                          autoFocus
                          disabled={status === 'loading' || status === 'success'}
                          className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-neutral-600 px-4 text-lg outline-none min-w-0"
                        />
                        <button
                          type="submit"
                          disabled={status === 'loading' || status === 'success'}
                          className="p-2 rounded-full bg-white text-black hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                        >
                           {status === 'loading' ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <ArrowRight className="w-5 h-5" />
                            )}
                        </button>
                      </motion.form>
                   )}
                 </AnimatePresence>
              </div>
            </motion.div>
            )}
          </div>
          
          <div className="absolute top-full left-0 w-full z-10">
            <AnimatePresence mode="wait">
              {isExpanded && status === 'idle' && view === 'email' && (
                <motion.p
                  key="disclaimer"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="mt-4 text-neutral-500 text-xs max-w-xs mx-auto"
                >
                  By entering your email, you agree to receive periodic updates and product news from MNKY.
                </motion.p>
              )}
               {view === 'otp' && status !== 'success' && (
                <motion.p
                  key="otp-instruction"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 text-neutral-400 text-xs font-mono tracking-wide"
                >
                  Enter the code sent to {email}
                </motion.p>
              )}
              {status === 'success' && (
                <motion.p 
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 text-neutral-400 text-sm font-mono tracking-wide"
                >
                  Account verified. Welcome to MNKY.
                </motion.p>
              )}
              {status === 'error' && (
                <motion.p 
                  key="general-error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 text-red-400 text-sm font-mono tracking-wide"
                >
                  {errorMessage}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
