'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const { signInWithGoogle } = useAuth();
  const router = useRouter();

  const images = [
    '/login-img1.png',
    '/login-img2.png',
    '/login-img3.png',
    '/login-img4.png',
    '/login-img5.png'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();

      if (result.success) {
        if (result.needsOnboarding) {
          router.push('/auth/onboarding');
        } else {
          // User exists, redirect to appropriate dashboard
          router.push('/dashboard');
        }
      } else {
        toast.error(result.error || 'Failed to sign in');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black grid lg:grid-cols-2">
      {/* Back to Home Button */}
      <div className="absolute top-4 left-4 z-30">
        <Button
          onClick={() => router.push('/')}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/30"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </div>

      {/* Left Column - Login Form */}
      <div className="flex flex-col justify-center min-h-screen px-8 py-12">
        <div className="w-full max-w-sm mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <Image
              src="/logo.png"
              alt="Rentme Logo"
              width={160}
              height={36}
              className="mx-auto"
            />
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Heading */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-semibold text-white">
                Find Your Perfect Home
              </h1>
              <p className="text-gray-400">
                Sign in to find your perfect home
              </p>
            </div>

              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-orange-100 text-black border-orange-500 h-12 text-base font-medium"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                {isLoading ? 'Signing in...' : 'Continue with Google'}
              </Button>

              <p className="text-center text-sm text-gray-500 leading-relaxed">
                By continuing, you agree to our{' '}
                <span className="text-gray-400 hover:text-white cursor-pointer">Terms of Service</span>
                {' '}and{' '}
                <span className="text-gray-400 hover:text-white cursor-pointer">Privacy Policy</span>
              </p>
            </div>
          </div>
        </div>

      {/* Right Column - Image Carousel */}
      <div className="relative hidden lg:block overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent z-10" />
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{
              opacity: index === currentImage ? 1 : 0
            }}
            transition={{
              duration: 1.2,
              ease: "easeInOut"
            }}
            className="absolute inset-0"
          >
            <Image
              src={image}
              alt={`Login illustration ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </motion.div>
        ))}

        {/* Image indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImage
                  ? 'bg-orange-400 w-8'
                  : 'bg-white/50 hover:bg-white/70'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}