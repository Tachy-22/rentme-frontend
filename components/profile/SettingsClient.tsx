'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from '@/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save, Shield, Bell, Eye, Trash2 } from 'lucide-react';

interface SettingsClientProps {
  user: User;
}

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const emailSchema = z.object({
  newEmail: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password is required to change email'),
});

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  applicationUpdates: z.boolean(),
  messageNotifications: z.boolean(),
  propertyRecommendations: z.boolean(),
});

const privacySchema = z.object({
  profileVisibility: z.enum(['public', 'private', 'contacts_only']),
  showEmail: z.boolean(),
  showPhone: z.boolean(),
  allowSearchEngineIndexing: z.boolean(),
  dataSharing: z.boolean(),
});

type PasswordFormData = z.infer<typeof passwordSchema>;
type EmailFormData = z.infer<typeof emailSchema>;
type NotificationFormData = z.infer<typeof notificationSchema>;
type PrivacyFormData = z.infer<typeof privacySchema>;

export function SettingsClient({ user }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<'security' | 'notifications' | 'privacy'>('security');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Password change form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Email change form
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  // Notification preferences form
  const notificationForm = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
      applicationUpdates: true,
      messageNotifications: true,
      propertyRecommendations: true,
    },
  });

  // Privacy settings form
  const privacyForm = useForm<PrivacyFormData>({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      allowSearchEngineIndexing: true,
      dataSharing: false,
    },
  });

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // TODO: Implement password change API
      console.log('Password change:', data);
      setSuccess('Password updated successfully!');
      passwordForm.reset();
    } catch (err) {
      setError('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const onEmailSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // TODO: Implement email change API
      console.log('Email change:', data);
      setSuccess('Email updated successfully! Please check your new email for verification.');
      emailForm.reset();
    } catch (err) {
      setError('Failed to update email');
    } finally {
      setIsLoading(false);
    }
  };

  const onNotificationSubmit = async (data: NotificationFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // TODO: Implement notification preferences API
      console.log('Notification preferences:', data);
      setSuccess('Notification preferences updated successfully!');
    } catch (err) {
      setError('Failed to update notification preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const onPrivacySubmit = async (data: PrivacyFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // TODO: Implement privacy settings API
      console.log('Privacy settings:', data);
      setSuccess('Privacy settings updated successfully!');
    } catch (err) {
      setError('Failed to update privacy settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        // TODO: Implement account deletion API
        console.log('Delete account');
        const { logout } = await import('@/actions/auth/logout');
        await logout();
        router.push('/');
      } catch (err) {
        setError('Failed to delete account');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSendPasswordReset = async () => {
    try {
      const { sendPasswordResetEmail } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase');
      await sendPasswordResetEmail(auth, user.email);
      setSuccess('Password reset email sent!');
    } catch (err) {
      setError('Failed to send password reset email');
    }
  };

  const tabs = [
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Eye },
  ] as const;

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account security, notifications, and privacy settings.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="flex space-x-8">
          {/* Tab Navigation */}
          <div className="w-64 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <tab.icon className="mr-3 h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 space-y-6">
            {activeTab === 'security' && (
              <div className="space-y-6">
                {/* Change Password */}
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          {...passwordForm.register('currentPassword')}
                          placeholder="Enter your current password"
                        />
                        {passwordForm.formState.errors.currentPassword && (
                          <p className="text-sm text-destructive">
                            {passwordForm.formState.errors.currentPassword.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          {...passwordForm.register('newPassword')}
                          placeholder="Enter your new password"
                        />
                        {passwordForm.formState.errors.newPassword && (
                          <p className="text-sm text-destructive">
                            {passwordForm.formState.errors.newPassword.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          {...passwordForm.register('confirmPassword')}
                          placeholder="Confirm your new password"
                        />
                        {passwordForm.formState.errors.confirmPassword && (
                          <p className="text-sm text-destructive">
                            {passwordForm.formState.errors.confirmPassword.message}
                          </p>
                        )}
                      </div>

                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Update Password'
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Change Email */}
                <Card>
                  <CardHeader>
                    <CardTitle>Change Email Address</CardTitle>
                    <CardDescription>
                      Current email: {user.email}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="newEmail">New Email Address</Label>
                        <Input
                          id="newEmail"
                          type="email"
                          {...emailForm.register('newEmail')}
                          placeholder="Enter your new email address"
                        />
                        {emailForm.formState.errors.newEmail && (
                          <p className="text-sm text-destructive">
                            {emailForm.formState.errors.newEmail.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          {...emailForm.register('password')}
                          placeholder="Enter your password to confirm"
                        />
                        {emailForm.formState.errors.password && (
                          <p className="text-sm text-destructive">
                            {emailForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>

                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Update Email'
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Password Reset */}
                <Card>
                  <CardHeader>
                    <CardTitle>Password Reset</CardTitle>
                    <CardDescription>
                      Send a password reset email to your registered email address.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSendPasswordReset}
                      disabled={isLoading}
                    >
                      Send Password Reset Email
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how you want to receive notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications via email
                          </p>
                        </div>
                        <Switch {...notificationForm.register('emailNotifications')} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive push notifications in your browser
                          </p>
                        </div>
                        <Switch {...notificationForm.register('pushNotifications')} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications via text message
                          </p>
                        </div>
                        <Switch {...notificationForm.register('smsNotifications')} />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Marketing Emails</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive promotional and marketing emails
                          </p>
                        </div>
                        <Switch {...notificationForm.register('marketingEmails')} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Application Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified about application status changes
                          </p>
                        </div>
                        <Switch {...notificationForm.register('applicationUpdates')} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Message Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified about new messages
                          </p>
                        </div>
                        <Switch {...notificationForm.register('messageNotifications')} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Property Recommendations</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive personalized property recommendations
                          </p>
                        </div>
                        <Switch {...notificationForm.register('propertyRecommendations')} />
                      </div>
                    </div>

                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Preferences
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>
                      Control your privacy and data sharing preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={privacyForm.handleSubmit(onPrivacySubmit)} className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Profile Visibility</Label>
                          <select {...privacyForm.register('profileVisibility')} className="w-full p-2 border rounded">
                            <option value="public">Public - Anyone can view your profile</option>
                            <option value="contacts_only">Contacts Only - Only your contacts can view</option>
                            <option value="private">Private - Profile is hidden</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Show Email Address</Label>
                            <p className="text-sm text-muted-foreground">
                              Display your email address on your public profile
                            </p>
                          </div>
                          <Switch {...privacyForm.register('showEmail')} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Show Phone Number</Label>
                            <p className="text-sm text-muted-foreground">
                              Display your phone number on your public profile
                            </p>
                          </div>
                          <Switch {...privacyForm.register('showPhone')} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Search Engine Indexing</Label>
                            <p className="text-sm text-muted-foreground">
                              Allow search engines to index your profile
                            </p>
                          </div>
                          <Switch {...privacyForm.register('allowSearchEngineIndexing')} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Data Sharing</Label>
                            <p className="text-sm text-muted-foreground">
                              Share anonymized data for platform improvements
                            </p>
                          </div>
                          <Switch {...privacyForm.register('dataSharing')} />
                        </div>
                      </div>

                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Settings
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Account Deletion */}
                <Card className="border-destructive">
                  <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>
                      Irreversible and destructive actions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium">Delete Account</h4>
                        <p className="text-sm text-muted-foreground">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={isLoading}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}