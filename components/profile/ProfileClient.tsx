'use client';

import { useState } from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Edit2,
  Save,
  X,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

interface ProfileClientProps {
  user: User;
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.profile?.firstName || '',
    lastName: user.profile?.lastName || '',
    phone: user.profile?.phone || '',
    dateOfBirth: user.profile?.dateOfBirth || '',
    address: user.profile?.address || '',
    city: user.profile?.city || '',
    state: user.profile?.state || '',
    bio: user.profile?.bio || '',
    university: user.profile?.university || '',
    studentId: user.profile?.studentId || '',
    preferredContactMethod: user.profile?.preferredContactMethod || 'email'
  });

  const profile = user.profile;
  const isVerified = (profile && 'verificationStatus' in profile) ? profile.verificationStatus === 'verified' : false;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement profile update server action
      // const result = await updateUserProfile(formData);

      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.profile?.firstName || '',
      lastName: user.profile?.lastName || '',
      phone: user.profile?.phone || '',
      dateOfBirth: user.profile?.dateOfBirth || '',
      address: user.profile?.address || '',
      city: user.profile?.city || '',
      state: user.profile?.state || '',
      bio: user.profile?.bio || '',
      university: user.profile?.university || '',
      studentId: user.profile?.studentId || '',
      preferredContactMethod: user.profile?.preferredContactMethod || 'email'
    });
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 overflow-auto lg:max-w-4xl min-w-full mx-auto ">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="p-2 h-8 w-8 hover:bg-gray-100"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div>
          {/* <p className="text-muted-foreground text-sm md:text-base">
            Manage your personal information and preferences
          </p> */}
          {isEditing && (
            <div className="flex flex-col md:flex-row gap-2 mt-3">
              <Button onClick={handleSave} disabled={isLoading} className="w-full md:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={isLoading} className="w-full md:w-auto">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Verification Status */}
      {!isVerified && (
        <div className="flex items-center justify-between p-3 bg-yellow-50/50 border border-yellow-200/50 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Verification Pending</span>
          </div>
          <Button size="sm" variant="outline" className="text-xs">
            Verify
          </Button>
        </div>
      )}

      {/* Profile Photo & Basic Info */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24 ring-2 ring-orange-400">
                <AvatarImage src={profile?.profilePicture} />
                <AvatarFallback className="text-lg">
                  {formData.firstName[0]}{formData.lastName[0]}
                </AvatarFallback>
              </Avatar>

              <Button
                variant="secondary"
                size="sm"
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0 bg-white shadow-lg hover:bg-gray-50"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{formData.firstName} {formData.lastName}</h2>
                <Badge variant={user.role === 'agent' ? 'default' : 'secondary'} className="mt-1">
                  {user.role === 'agent' ? 'Agent' : 'Renter'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span>{user.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span>Joined {formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Personal Information</h3>
            <p className="text-sm text-muted-foreground">Your personal details and contact information</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
              {isEditing ? (
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
              ) : (
                <div className="px-3 py-2 bg-muted/50 rounded-md text-sm">{formData.firstName || 'Not specified'}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
              {isEditing ? (
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
              ) : (
                <div className="px-3 py-2 bg-muted/50 rounded-md text-sm">{formData.lastName || 'Not specified'}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              ) : (
                <div className="px-3 py-2 bg-muted/50 rounded-md text-sm">{formData.phone || 'Not specified'}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth</Label>
              {isEditing ? (
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              ) : (
                <div className="px-3 py-2 bg-muted/50 rounded-md text-sm">{formatDate(formData.dateOfBirth)}</div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">Address</Label>
            {isEditing ? (
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            ) : (
              <div className="px-3 py-2 bg-muted/50 rounded-md text-sm">{formData.address || 'Not specified'}</div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">City</Label>
              {isEditing ? (
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              ) : (
                <div className="px-3 py-2 bg-muted/50 rounded-md text-sm">{formData.city || 'Not specified'}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium">State</Label>
              {isEditing ? (
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                />
              ) : (
                <div className="px-3 py-2 bg-muted/50 rounded-md text-sm">{formData.state || 'Not specified'}</div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
            {isEditing ? (
              <Textarea
                id="bio"
                rows={3}
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
              />
            ) : (
              <div className="px-3 py-2 bg-muted/50 rounded-md min-h-[80px] text-sm">
                {formData.bio || 'No bio provided'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Student Information (for renters) */}
      {user.role === 'renter' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Student Information</h3>
            <p className="text-sm text-muted-foreground">Your academic details for verification purposes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="university" className="text-sm font-medium">University</Label>
              {isEditing ? (
                <Input
                  id="university"
                  value={formData.university}
                  onChange={(e) => handleInputChange('university', e.target.value)}
                />
              ) : (
                <div className="px-3 py-2 bg-muted/50 rounded-md text-sm">{formData.university || 'Not specified'}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentId" className="text-sm font-medium">Student ID</Label>
              {isEditing ? (
                <Input
                  id="studentId"
                  value={formData.studentId}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                />
              ) : (
                <div className="px-3 py-2 bg-muted/50 rounded-md text-sm">{formData.studentId || 'Not specified'}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}