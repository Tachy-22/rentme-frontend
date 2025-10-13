"use client"

import { useState } from 'react';
import { User, Mail, ArrowRight } from 'lucide-react';
import { addToWaitlist } from '@/actions/waitlist/addToWaitlist';
import SuccessModal from '@/components/SuccessModal';

const WaitlistForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const isFormComplete = name.trim() !== '' && email.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormComplete) return;

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const result = await addToWaitlist({ name: name.trim(), email: email.trim() });

      if (result.success) {
        setShowSuccessModal(true);
        setName('');
        setEmail('');
        setSubmitMessage('');
      } else {
        setSubmitMessage(`❌ ${result.message}`);
      }
    } catch {
      setSubmitMessage('❌ An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[320px] space-y-4">
      <div className="relative">
        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-" />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name..."
          className="w-full bg-stone-900 border border-stone-500 rounded-[1rem] pl-12 pr-4 py-3.5 text-sm text- placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-ring transition-all"
        />
      </div>

      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address..."
          className="w-full bg-stone-900 border border-stone-500 rounded-[1rem] pl-12 pr-4 py-3.5 text-sm text- placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-ring transition-all placeholder:text-stone-400"
        />
      </div>

      <button
        type="submit"
        className={`rounded-[0.5rem] w-full py-3.5 text-sm transition-all flex items-center justify-center gap-2 group ${isFormComplete && !isSubmitting
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0'
            : 'bg-gradient-to-r from-orange-300/50 to-orange-400/50 text-orange-200/70 border border-orange-400/30'
          }`}
        disabled={!isFormComplete || isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Continue'}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
        message="Congrats! You're officially on the RentMe waitlist. We'll hit you up the moment we go live—no spam, just the good stuff!"
        duration={5000}
      />
    </form>
  );
};

export default WaitlistForm;
