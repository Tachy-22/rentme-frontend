'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { applyActionCode, checkActionCode } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function VerifyEmailClient() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyEmail = async () => {
      const oobCode = searchParams.get('oobCode');
      const mode = searchParams.get('mode');

      if (!oobCode || mode !== 'verifyEmail') {
        setStatus('error');
        setMessage('Invalid verification link. Please request a new verification email.');
        return;
      }

      try {
        // First, check if the action code is valid
        await checkActionCode(auth, oobCode);
        
        // If valid, apply the email verification
        await applyActionCode(auth, oobCode);
        
        setStatus('success');
        setMessage('Your email has been successfully verified! You can now access all features.');
      } catch (error) {
        console.error('Email verification error:', error);
        
        const errorCode = error instanceof Error && 'code' in error ? (error as { code: string }).code : '';
        
        if (errorCode === 'auth/expired-action-code') {
          setStatus('expired');
          setMessage('This verification link has expired. Please request a new verification email.');
        } else if (errorCode === 'auth/invalid-action-code') {
          setStatus('error');
          setMessage('This verification link is invalid. Please request a new verification email.');
        } else {
          setStatus('error');
          setMessage('Failed to verify email. Please try again or contact support.');
        }
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleContinue = () => {
    router.push('/auth/login');
  };

  const handleResendEmail = () => {
    router.push('/auth/resend-verification');
  };

  if (status === 'loading') {
    return (
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
        <p className="text-gray-600">Verifying your email...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center space-y-4">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="text-green-700">
            {message}
          </AlertDescription>
        </Alert>
        <Button 
          onClick={handleContinue}
          className="w-full"
        >
          Continue to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      <XCircle className="h-12 w-12 text-red-600 mx-auto" />
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          {message}
        </AlertDescription>
      </Alert>
      <div className="space-y-2">
        <Button 
          onClick={handleResendEmail}
          className="w-full"
          variant="outline"
        >
          Request New Verification Email
        </Button>
        <Button 
          onClick={handleContinue}
          className="w-full"
          variant="secondary"
        >
          Back to Login
        </Button>
      </div>
    </div>
  );
}