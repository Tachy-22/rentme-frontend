'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Property, User, ApplicationFormData, RenterProfile, AgentProfile } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft,
  FileText,
  DollarSign,
  User as UserIcon,
  Calendar,
  CheckCircle
} from 'lucide-react';

const applicationSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    socialSecurityNumber: z.string().min(9, 'Valid SSN is required').optional(),
  }),
  employmentInfo: z.object({
    employmentStatus: z.enum(['employed', 'self_employed', 'student', 'unemployed', 'retired']),
    employer: z.string().optional(),
    jobTitle: z.string().optional(),
    monthlyIncome: z.number().min(0, 'Income must be positive'),
    employmentLength: z.string().optional(),
  }),
  rentalHistory: z.object({
    currentAddress: z.string().min(1, 'Current address is required'),
    landlordName: z.string().optional(),
    landlordPhone: z.string().optional(),
    monthlyRent: z.number().min(0).optional(),
    reasonForMoving: z.string().min(1, 'Reason for moving is required'),
  }),
  references: z.object({
    emergencyContactName: z.string().min(1, 'Emergency contact is required'),
    emergencyContactPhone: z.string().min(10, 'Valid phone number is required'),
    emergencyContactRelation: z.string().min(1, 'Relationship is required'),
    personalReferenceName: z.string().optional(),
    personalReferencePhone: z.string().optional(),
  }),
  additionalInfo: z.object({
    hasPets: z.boolean(),
    petDescription: z.string().optional(),
    smokingPreference: z.enum(['non_smoker', 'smoker', 'occasional']),
    moveInDate: z.string().min(1, 'Move-in date is required'),
    leaseDuration: z.enum(['6_months', '12_months', '18_months', '24_months', 'month_to_month']),
    additionalComments: z.string().optional(),
  }),
  documents: z.object({
    idDocument: z.boolean().refine(val => val === true, 'ID document is required'),
    incomeProof: z.boolean().refine(val => val === true, 'Income proof is required'),
    bankStatements: z.boolean(),
    references: z.boolean(),
  }),
  agreements: z.object({
    backgroundCheck: z.boolean().refine(val => val === true, 'Background check consent is required'),
    creditCheck: z.boolean().refine(val => val === true, 'Credit check consent is required'),
    termsAndConditions: z.boolean().refine(val => val === true, 'Terms and conditions must be accepted'),
  })
});

type ApplicationForm = z.infer<typeof applicationSchema>;

interface ApplicationFormClientProps {
  property: Property;
  user: User;
}

export function ApplicationFormClient({ property, user }: ApplicationFormClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      personalInfo: {
        firstName: user?.profile?.firstName || '',
        lastName: user?.profile?.lastName || '',
        email: user?.email || '',
        phone: (user.profile as RenterProfile | AgentProfile)?.phone || (user.profile as RenterProfile | AgentProfile)?.phoneNumber || '',
      },
      employmentInfo: {
        monthlyIncome: 0,
      },
      rentalHistory: {
        monthlyRent: 0,
      },
      additionalInfo: {
        hasPets: false,
        smokingPreference: 'non_smoker',
        leaseDuration: '12_months',
      },
      documents: {
        idDocument: false,
        incomeProof: false,
        bankStatements: false,
        references: false,
      },
      agreements: {
        backgroundCheck: false,
        creditCheck: false,
        termsAndConditions: false,
      }
    }
  });

  const watchHasPets = watch('additionalInfo.hasPets');
  const watchEmploymentStatus = watch('employmentInfo.employmentStatus');

  const handleFileUpload = (documentType: string, files: FileList | null) => {
    if (files) {
      setUploadedFiles(prev => ({
        ...prev,
        [documentType]: Array.from(files)
      }));
      if (documentType === 'idDocument') setValue('documents.idDocument', true);
      if (documentType === 'incomeProof') setValue('documents.incomeProof', true);
      if (documentType === 'bankStatements') setValue('documents.bankStatements', true);
      if (documentType === 'references') setValue('documents.references', true);
    }
  };

  const onSubmit = async (data: ApplicationForm) => {
    try {
      setIsSubmitting(true);
      
      const applicationData: ApplicationFormData = {
        ...data,
        propertyId: property.id,
        renterId: user.id,
        agentId: property.agentId,
      };

      const { submitApplication } = await import('@/actions/applications/submitApplication');
      const result = await submitApplication(applicationData, uploadedFiles);
      
      if (result.success) {
        router.push(`/applications/${result.applicationId}`);
      } else {
        console.error('Application submission failed:', result.error);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <a href={`/properties/${property.id}`} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Property
          </a>
        </Button>
        
        <h1 className="text-3xl font-bold mb-2">Apply for Property</h1>
        <div className="flex items-center space-x-4 text-muted-foreground">
          <span>{property.title}</span>
          <Badge>{property.type}</Badge>
          <span>${property.price.amount.toLocaleString()}/{property.price.period}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserIcon className="h-5 w-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  {...register('personalInfo.firstName')}
                  className={errors.personalInfo?.firstName ? 'border-red-500' : ''}
                />
                {errors.personalInfo?.firstName && (
                  <p className="text-sm text-red-500 mt-1">{errors.personalInfo.firstName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  {...register('personalInfo.lastName')}
                  className={errors.personalInfo?.lastName ? 'border-red-500' : ''}
                />
                {errors.personalInfo?.lastName && (
                  <p className="text-sm text-red-500 mt-1">{errors.personalInfo.lastName.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('personalInfo.email')}
                  className={errors.personalInfo?.email ? 'border-red-500' : ''}
                />
                {errors.personalInfo?.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.personalInfo.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  {...register('personalInfo.phone')}
                  className={errors.personalInfo?.phone ? 'border-red-500' : ''}
                />
                {errors.personalInfo?.phone && (
                  <p className="text-sm text-red-500 mt-1">{errors.personalInfo.phone.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register('personalInfo.dateOfBirth')}
                className={errors.personalInfo?.dateOfBirth ? 'border-red-500' : ''}
              />
              {errors.personalInfo?.dateOfBirth && (
                <p className="text-sm text-red-500 mt-1">{errors.personalInfo.dateOfBirth.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Employment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="employmentStatus">Employment Status *</Label>
              <Select onValueChange={(value) => setValue('employmentInfo.employmentStatus', value as ApplicationForm['employmentInfo']['employmentStatus'])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employed">Employed</SelectItem>
                  <SelectItem value="self_employed">Self-Employed</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(watchEmploymentStatus === 'employed' || watchEmploymentStatus === 'self_employed') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employer">Employer/Company</Label>
                  <Input
                    id="employer"
                    {...register('employmentInfo.employer')}
                  />
                </div>
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    {...register('employmentInfo.jobTitle')}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthlyIncome">Monthly Income *</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  {...register('employmentInfo.monthlyIncome', { valueAsNumber: true })}
                  className={errors.employmentInfo?.monthlyIncome ? 'border-red-500' : ''}
                />
                {errors.employmentInfo?.monthlyIncome && (
                  <p className="text-sm text-red-500 mt-1">{errors.employmentInfo.monthlyIncome.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="employmentLength">Length of Employment</Label>
                <Input
                  id="employmentLength"
                  placeholder="e.g., 2 years, 6 months"
                  {...register('employmentInfo.employmentLength')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="moveInDate">Preferred Move-in Date *</Label>
                <Input
                  id="moveInDate"
                  type="date"
                  {...register('additionalInfo.moveInDate')}
                  className={errors.additionalInfo?.moveInDate ? 'border-red-500' : ''}
                />
                {errors.additionalInfo?.moveInDate && (
                  <p className="text-sm text-red-500 mt-1">{errors.additionalInfo.moveInDate.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="leaseDuration">Preferred Lease Duration *</Label>
                <Select onValueChange={(value) => setValue('additionalInfo.leaseDuration', value as ApplicationForm['additionalInfo']['leaseDuration'])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select lease duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6_months">6 Months</SelectItem>
                    <SelectItem value="12_months">12 Months</SelectItem>
                    <SelectItem value="18_months">18 Months</SelectItem>
                    <SelectItem value="24_months">24 Months</SelectItem>
                    <SelectItem value="month_to_month">Month-to-Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasPets"
                  checked={watchHasPets}
                  onCheckedChange={(checked) => setValue('additionalInfo.hasPets', checked as boolean)}
                />
                <Label htmlFor="hasPets">I have pets</Label>
              </div>

              {watchHasPets && (
                <div>
                  <Label htmlFor="petDescription">Pet Description</Label>
                  <Textarea
                    id="petDescription"
                    placeholder="Describe your pets (type, breed, size, etc.)"
                    {...register('additionalInfo.petDescription')}
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="additionalComments">Additional Comments</Label>
              <Textarea
                id="additionalComments"
                placeholder="Any additional information you'd like to share"
                {...register('additionalInfo.additionalComments')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Document Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Required Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="idDocument">Government ID * (Required)</Label>
                <Input
                  id="idDocument"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload('idDocument', e.target.files)}
                />
                {uploadedFiles.idDocument && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {uploadedFiles.idDocument.length} file(s) uploaded
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="incomeProof">Income Proof * (Required)</Label>
                <Input
                  id="incomeProof"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={(e) => handleFileUpload('incomeProof', e.target.files)}
                />
                {uploadedFiles.incomeProof && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {uploadedFiles.incomeProof.length} file(s) uploaded
                  </div>
                )}
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Accepted formats: PDF, JPG, JPEG, PNG (Max 10MB per file)</p>
              <p>Income proof can include: Pay stubs, tax returns, bank statements, employment letter</p>
            </div>
          </CardContent>
        </Card>

        {/* Agreements */}
        <Card>
          <CardHeader>
            <CardTitle>Agreements and Consent</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="backgroundCheck"
                  {...register('agreements.backgroundCheck')}
                  className={errors.agreements?.backgroundCheck ? 'border-red-500' : ''}
                />
                <Label htmlFor="backgroundCheck" className="text-sm leading-relaxed">
                  I consent to a background check being performed as part of this application process. *
                </Label>
              </div>
              {errors.agreements?.backgroundCheck && (
                <p className="text-sm text-red-500">{errors.agreements.backgroundCheck.message}</p>
              )}

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="creditCheck"
                  {...register('agreements.creditCheck')}
                  className={errors.agreements?.creditCheck ? 'border-red-500' : ''}
                />
                <Label htmlFor="creditCheck" className="text-sm leading-relaxed">
                  I consent to a credit check being performed as part of this application process. *
                </Label>
              </div>
              {errors.agreements?.creditCheck && (
                <p className="text-sm text-red-500">{errors.agreements.creditCheck.message}</p>
              )}

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="termsAndConditions"
                  {...register('agreements.termsAndConditions')}
                  className={errors.agreements?.termsAndConditions ? 'border-red-500' : ''}
                />
                <Label htmlFor="termsAndConditions" className="text-sm leading-relaxed">
                  I have read and agree to the terms and conditions, privacy policy, and understand that 
                  false information may result in application rejection. *
                </Label>
              </div>
              {errors.agreements?.termsAndConditions && (
                <p className="text-sm text-red-500">{errors.agreements.termsAndConditions.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" asChild>
            <a href={`/properties/${property.id}`}>Cancel</a>
          </Button>
          <Button type="submit" disabled={isSubmitting} className="min-w-32">
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}