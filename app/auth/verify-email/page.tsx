import { Suspense } from 'react';
import { VerifyEmailClient } from '@/components/auth/VerifyEmailClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
            <CardDescription>
              Verifying your email address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Suspense fallback={
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                <p className="text-gray-600">Loading verification...</p>
              </div>
            }>
              <VerifyEmailClient />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}