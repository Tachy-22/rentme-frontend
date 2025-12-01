'use client';

import { useState, useEffect } from 'react';
import { User, RenterProfile, AgentProfile, AdminProfile } from '@/types';

// Interface for verification data from API
interface VerificationData {
  status?: string;
  documents?: Record<string, string>;
  university?: string;
  agencyName?: string;
  [key: string]: unknown;
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Upload,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Shield,
  AlertCircle,
  User as UserIcon,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { getVerificationStatus } from '@/lib/access-control';
import { submitVerification, getVerificationStatus as getVerificationData } from '@/actions/verification/submitVerification';

interface VerificationPageProps {
  user: User;
}

const NIGERIAN_UNIVERSITIES = [
  'University of Lagos (UNILAG)',
  'University of Ibadan (UI)',
  'Obafemi Awolowo University (OAU)',
  'Lagos State University (LASU)',
  'Federal University of Technology, Akure (FUTA)',
  'Other'
];

const DEPARTMENTS = [
  'Computer Science',
  'Engineering',
  'Medicine',
  'Law',
  'Business Administration',
  'Economics',
  'Political Science',
  'Mass Communication',
  'Psychology',
  'Other'
];

const LEVELS = ['100 Level', '200 Level', '300 Level', '400 Level', '500 Level', 'Masters', 'PhD'];

export default function VerificationPage({ user }: VerificationPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [formData, setFormData] = useState({
    // Renter fields
    university: '',
    department: '',
    level: '',
    studentIdNumber: '',
    // Agent fields
    agencyName: '',
    agencyAddress: '',
    licenseNumber: '',
    businessType: '',
    // Documents
    studentId: null as File | null,
    admissionLetter: null as File | null,
    cacCertificate: null as File | null,
    personalId: null as File | null,
  });

  const verificationStatus = getVerificationStatus(user);
  const profile = user.profile as RenterProfile | AgentProfile | AdminProfile;

  useEffect(() => {
    fetchVerificationData();
  }, []);

  const fetchVerificationData = async () => {
    try {
      const result = await getVerificationData();
      if (result.success && result.data && result.data.length > 0) {
        setVerificationData(result.data[0]);
      }
    } catch (error) {
      console.error('Error fetching verification data:', error);
    }
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (verificationStatus.status === 'pending' && verificationData) {
      toast.error('Verification request already submitted');
      return;
    }

    if (verificationStatus.status === 'verified') {
      toast.error('Account already verified');
      return;
    }

    // Validate required documents and file sizes
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (user.role === 'renter') {
      if (!formData.studentId && !formData.admissionLetter) {
        toast.error('Please upload either a student ID or admission letter');
        return;
      }
      if (!formData.university || !formData.department || !formData.level) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Check file sizes
      if (formData.studentId && formData.studentId.size > maxSizeBytes) {
        toast.error(`Student ID file is too large: ${formatFileSize(formData.studentId.size)}. Maximum allowed: 5MB`);
        return;
      }
      if (formData.admissionLetter && formData.admissionLetter.size > maxSizeBytes) {
        toast.error(`Admission letter file is too large: ${formatFileSize(formData.admissionLetter.size)}. Maximum allowed: 5MB`);
        return;
      }
    } else if (user.role === 'agent') {
      if (!formData.cacCertificate && !formData.personalId) {
        toast.error('Please upload either a CAC certificate or personal ID');
        return;
      }
      if (!formData.agencyName || !formData.agencyAddress) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Check file sizes
      if (formData.cacCertificate && formData.cacCertificate.size > maxSizeBytes) {
        toast.error(`CAC certificate file is too large: ${formatFileSize(formData.cacCertificate.size)}. Maximum allowed: 5MB`);
        return;
      }
      if (formData.personalId && formData.personalId.size > maxSizeBytes) {
        toast.error(`Personal ID file is too large: ${formatFileSize(formData.personalId.size)}. Maximum allowed: 5MB`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const documents: Record<string, File> = {};
      if (formData.studentId) documents.studentId = formData.studentId;
      if (formData.admissionLetter) documents.admissionLetter = formData.admissionLetter;
      if (formData.cacCertificate) documents.cacCertificate = formData.cacCertificate;
      if (formData.personalId) documents.personalId = formData.personalId;

      const result = await submitVerification({
        documents,
        university: formData.university,
        department: formData.department,
        level: formData.level,
        studentIdNumber: formData.studentIdNumber,
        agencyName: formData.agencyName,
        agencyAddress: formData.agencyAddress,
        licenseNumber: formData.licenseNumber,
        businessType: formData.businessType,
      });

      if (result.success) {
        toast.success('Verification request submitted successfully!');
        fetchVerificationData();
        // Reset form
        setFormData({
          university: '',
          department: '',
          level: '',
          studentIdNumber: '',
          agencyName: '',
          agencyAddress: '',
          licenseNumber: '',
          businessType: '',
          studentId: null,
          admissionLetter: null,
          cacCertificate: null,
          personalId: null,
        });
      } else {
        toast.error(result.error || 'Failed to submit verification request');
      }
    } catch (error) {
      toast.error('An error occurred while submitting verification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = () => {
    // If status is pending but no verification data exists, treat as unverified
    if (verificationStatus.status === 'pending' && !verificationData) {
      return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }

    switch (verificationStatus.status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusMessage = () => {
    // If status is pending but no verification data exists, treat as unverified
    if (verificationStatus.status === 'pending' && !verificationData) {
      return `Get verified to unlock ${user.role === 'renter' ? 'unlimited messaging and priority support' : 'unlimited listings and premium features'}.`;
    }

    switch (verificationStatus.status) {
      case 'verified':
        return 'Your account is verified! You have full access to all platform features.';
      case 'pending':
        return 'Your verification request is being reviewed. This usually takes 1-2 business days.';
      case 'rejected':
        return 'Your verification request was rejected. Please submit new documents.';
      default:
        return `Get verified to unlock ${user.role === 'renter' ? 'unlimited messaging and priority support' : 'unlimited listings and premium features'}.`;
    }
  };

  const FileUploadField = ({ field, label, accept }: { field: string; label: string; accept: string }) => {
    const file = (formData as Record<string, unknown>)[field] as File | null;
    const maxSizeMB = 5;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleFileChange = (selectedFile: File | null) => {
      if (selectedFile) {
        if (selectedFile.size > maxSizeBytes) {
          toast.error(`File size must be less than ${maxSizeMB}MB. Current file: ${formatFileSize(selectedFile.size)}`);
          return;
        }
      }
      handleFileUpload(field, selectedFile);
    };

    const getFilePreview = (file: File) => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      return null;
    };

    return (
      <div className="space-y-2">
        <Label htmlFor={field}>
          {label} <span className="text-xs text-muted-foreground">(Max {maxSizeMB}MB)</span>
        </Label>
        <input
          id={field}
          type="file"
          accept={accept}
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          className="hidden"
        />

        {file ? (
          <div className="border rounded-lg p-4 space-y-3">
            {file.type.startsWith('image/') && (
              <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={getFilePreview(file)!}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleFileChange(null)}
              >
                Remove
              </Button>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById(field)?.click()}
              className="w-full"
            >
              Replace File
            </Button>
          </div>
        ) : (
          <label
            htmlFor={field}
            className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
          >
            <div className="text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">Upload {label}</p>
              <p className="text-xs text-gray-500 mt-1">
                {accept.includes('image') ? 'PNG, JPG up to' : 'PDF, PNG, JPG up to'} {maxSizeMB}MB
              </p>
            </div>
          </label>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background overflow-y-auto pb-[10rem]">
      <div className="p-0 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (typeof window !== 'undefined' && window.history.length > 1) {
                  window.history.back();
                } else {
                  window.location.href = user.role === 'renter' ? '/dashboard' : '/agent/dashboard';
                }
              }}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Account Verification</h1>
          <p className="text-muted-foreground">
            Verify your {user.role} account to unlock full platform features
          </p>
        </div>

        {/* Status Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div>
                <CardTitle className="flex items-center gap-2">
                  Verification Status
                  <Badge className={`${(verificationStatus.status === 'pending' && !verificationData) ? 'bg-gray-100 text-gray-600' : verificationStatus.bgColor} ${(verificationStatus.status === 'pending' && !verificationData) ? 'text-gray-600' : verificationStatus.color}`}>
                    {(verificationStatus.status === 'pending' && !verificationData) ? 'unverified' : verificationStatus.status}
                  </Badge>
                </CardTitle>
                <CardDescription>{getStatusMessage()}</CardDescription>
              </div>
            </div>
          </CardHeader>

          {verificationStatus.status === 'pending' && verificationData && (
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Review Progress</span>
                  <span>In Review</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>
            </CardContent>
          )}
        </Card>

        {/* Verification Form */}
        {(verificationStatus.status === 'unverified' || verificationStatus.status === 'rejected' || !verificationData) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Submit Verification Documents
              </CardTitle>
              <CardDescription>
                {user.role === 'renter'
                  ? 'Upload your student ID or admission letter to verify your student status'
                  : 'Upload your business documents to verify your agency'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {user.role === 'renter' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="university">University *</Label>
                        <Select value={formData.university} onValueChange={(value) => setFormData(prev => ({ ...prev, university: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your university" />
                          </SelectTrigger>
                          <SelectContent>
                            {NIGERIAN_UNIVERSITIES.map((uni) => (
                              <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department">Department *</Label>
                        <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your department" />
                          </SelectTrigger>
                          <SelectContent>
                            {DEPARTMENTS.map((dept) => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="level">Level *</Label>
                        <Select value={formData.level} onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your level" />
                          </SelectTrigger>
                          <SelectContent>
                            {LEVELS.map((level) => (
                              <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="studentIdNumber">Student ID Number</Label>
                        <Input
                          id="studentIdNumber"
                          value={formData.studentIdNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, studentIdNumber: e.target.value }))}
                          placeholder="Enter your student ID"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FileUploadField field="studentId" label="Student ID" accept="image/*" />
                      <FileUploadField field="admissionLetter" label="Admission Letter" accept="image/*,application/pdf" />
                    </div>
                  </>
                )}

                {user.role === 'agent' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="agencyName">Agency Name *</Label>
                        <Input
                          id="agencyName"
                          value={formData.agencyName}
                          onChange={(e) => setFormData(prev => ({ ...prev, agencyName: e.target.value }))}
                          placeholder="Enter your agency name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber">License Number</Label>
                        <Input
                          id="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                          placeholder="Enter your license number"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="agencyAddress">Agency Address *</Label>
                      <Textarea
                        id="agencyAddress"
                        value={formData.agencyAddress}
                        onChange={(e) => setFormData(prev => ({ ...prev, agencyAddress: e.target.value }))}
                        placeholder="Enter your agency address"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FileUploadField field="cacCertificate" label="CAC Certificate" accept="image/*,application/pdf" />
                      <FileUploadField field="personalId" label="Personal ID" accept="image/*" />
                    </div>
                  </>
                )}

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Submit for Verification
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Benefits */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Verification Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.role === 'renter' ? (
                <>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Unlimited messaging with agents</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>View full agent contact details</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Appear in agent matching results</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Higher priority in search results</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Unlimited property listings</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Featured listing placement</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Access to matched renters</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Unlock renter contact information</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}