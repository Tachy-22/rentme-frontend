import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, ArrowLeft } from 'lucide-react';

export default function VerificationPendingPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">RentMe</h1>
          <p className="text-muted-foreground mt-2">
            Professional property rental platform
          </p>
        </div>

        <Card>
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Account Created Successfully!</CardTitle>
            <CardDescription>
              Your account has been created and is pending verification
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <Mail className="h-6 w-6 text-primary mx-auto" />
                <p className="text-sm font-medium">Verification Email Sent</p>
                <p className="text-xs text-muted-foreground">
                  Please check your email and click the verification link to activate your account.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h3 className="text-sm font-medium">What happens next?</h3>
                <ul className="text-xs text-muted-foreground space-y-1 text-left">
                  <li>• Verify your email address</li>
                  <li>• Admin review (for agents)</li>
                  <li>• Account activation</li>
                  <li>• Welcome email with next steps</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/auth/login">
                  Continue to Sign In
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              <p>
                Didn&apos;t receive the email? Check your spam folder or{' '}
                <Link href="/auth/resend-verification" className="text-primary hover:underline">
                  request a new one
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}