"use client"

import { useState } from 'react';
import { Phone } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { googleWaitlistSignup } from '@/actions/waitlist/googleWaitlistSignup';
import SuccessModal from '@/components/SuccessModal';

const WaitlistForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const isPhoneNumberValid = phoneNumber.trim().length >= 10;

  const handleGoogleSignIn = async () => {
    if (!isPhoneNumberValid || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (user) {
        const waitlistResult = await googleWaitlistSignup({
          uid: user.uid,
          email: user.email || '',
          name: user.displayName || '',
          phoneNumber: phoneNumber.trim(),
          photoURL: user.photoURL || undefined,
          provider: 'google'
        });

        if (waitlistResult.success) {
          setShowSuccessModal(true);
          setPhoneNumber('');
          setSubmitMessage('');
        } else {
          setSubmitMessage(`❌ ${waitlistResult.message}`);
        }
      }
    } catch (error: unknown) {
      console.error('Google sign-in error:', error);
      setSubmitMessage('❌ Failed to sign in with Google. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[320px] space-y-4">
      <div className="relative">
        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone number..."
          className="w-full bg-stone-900 border border-stone-500 rounded-[1rem] pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-ring transition-all"
        />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className={`rounded-[0.5rem] w-full py-3.5 text-sm transition-all flex items-center justify-center gap-3 ${isPhoneNumberValid && !isSubmitting
            ? 'bg-white hover:bg-gray-100 text-stone-950 border-0 shadow-md hover:shadow-lg'
            : 'bg-gray-300/50 text-gray-100/70 border border-gray-400/30 cursor-not-allowed'
          }`}
        disabled={!isPhoneNumberValid || isSubmitting}
      >
        {isSubmitting ? (
          'Signing up...'
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </>
        )}
      </button>

      {submitMessage && (
        <p className="text-center text-sm mt-2 text-foreground">
          {submitMessage}
        </p>
      )}

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="You're in! 🎉"
        message="Welcome to the RentMe waitlist! We'll notify you as soon as we launch. Thanks for joining our community!"
        duration={5000}
      />
    </div>
  );
};

export default WaitlistForm;