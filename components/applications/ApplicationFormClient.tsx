'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, RenterProfile } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, FileText, User as UserIcon, Briefcase, Home, Users, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { submitApplication } from '@/actions/applications/submitApplication';
import { toast } from 'sonner';

interface ApplicationFormClientProps {
  user: User;
  property: {
    id: string;
    title: string;
    agentId: string;
    location: {
      address: string;
      city: string;
    };
    price: {
      amount: number;
      period: string;
    };
  };
}

export default function ApplicationFormClient({ user, property }: ApplicationFormClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const renterProfile = user.role === 'renter' ? (user.profile as RenterProfile) : null;

  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: user.profile.firstName || '',
      lastName: user.profile.lastName || '',
      email: user.email || '',
      phone: user.profile.phone || '',
      dateOfBirth: user.profile.dateOfBirth || '',
      socialSecurityNumber: ''
    },
    employmentInfo: {
      employmentStatus: 'student' as const,
      employer: renterProfile?.employer || '',
      jobTitle: '',
      monthlyIncome: renterProfile?.monthlyIncome || 0,
      employmentLength: ''
    },
    rentalHistory: {
      currentAddress: user.profile.address || '',
      landlordName: '',
      landlordPhone: '',
      monthlyRent: 0,
      reasonForMoving: ''
    },
    references: {
      emergencyContactName: renterProfile?.emergencyContact?.name || '',
      emergencyContactPhone: renterProfile?.emergencyContact?.phoneNumber || '',
      emergencyContactRelation: renterProfile?.emergencyContact?.relationship || '',
      personalReferenceName: '',
      personalReferencePhone: ''
    },
    additionalInfo: {
      hasPets: false,
      petDescription: '',
      smokingPreference: 'non_smoker' as const,
      moveInDate: '',
      leaseDuration: '12_months' as const,
      additionalComments: ''
    },
    documents: {
      idDocument: false,
      incomeProof: false,
      bankStatements: false,
      references: false
    },
    agreements: {
      backgroundCheck: false,
      creditCheck: false,
      termsAndConditions: false
    }
  });

  const steps = [
    { title: 'Personal Info', icon: UserIcon, description: 'Basic personal information' },
    { title: 'Employment', icon: Briefcase, description: 'Employment and income details' },
    { title: 'Rental History', icon: Home, description: 'Previous rental experience' },
    { title: 'References', icon: Users, description: 'Emergency contacts and references' },
    { title: 'Additional Info', icon: FileText, description: 'Move-in preferences and comments' },
    { title: 'Documents & Agreements', icon: CheckCircle, description: 'Required documents and agreements' }
  ];

  const handleInputChange = (section: string, field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitApplication({
        propertyId: property.id,
        agentId: property.agentId,
        applicationData: formData
      });

      if (result.success) {
        toast.success('Application submitted successfully!');
        router.push(`/applications?success=true`);
      } else {
        toast.error(result.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('An error occurred while submitting your application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.personalInfo.firstName}
            onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.personalInfo.lastName}
            onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.personalInfo.email}
            onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={formData.personalInfo.phone}
            onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.personalInfo.dateOfBirth}
            onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="ssn">Social Security Number (Optional)</Label>
          <Input
            id="ssn"
            value={formData.personalInfo.socialSecurityNumber}
            onChange={(e) => handleInputChange('personalInfo', 'socialSecurityNumber', e.target.value)}
            placeholder="XXX-XX-XXXX"
          />
        </div>
      </div>
    </div>
  );

  const renderEmploymentInfo = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="employmentStatus">Employment Status *</Label>
        <Select 
          value={formData.employmentInfo.employmentStatus} 
          onValueChange={(value) => handleInputChange('employmentInfo', 'employmentStatus', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="employed">Employed</SelectItem>
            <SelectItem value="self_employed">Self Employed</SelectItem>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="unemployed">Unemployed</SelectItem>
            <SelectItem value="retired">Retired</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="employer">Employer/School</Label>
          <Input
            id="employer"
            value={formData.employmentInfo.employer}
            onChange={(e) => handleInputChange('employmentInfo', 'employer', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="jobTitle">Job Title/Major</Label>
          <Input
            id="jobTitle"
            value={formData.employmentInfo.jobTitle}
            onChange={(e) => handleInputChange('employmentInfo', 'jobTitle', e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="monthlyIncome">Monthly Income (₦) *</Label>
          <Input
            id="monthlyIncome"
            type="number"
            value={formData.employmentInfo.monthlyIncome}
            onChange={(e) => handleInputChange('employmentInfo', 'monthlyIncome', parseInt(e.target.value) || 0)}
            required
          />
        </div>
        <div>
          <Label htmlFor="employmentLength">Employment Length</Label>
          <Input
            id="employmentLength"
            value={formData.employmentInfo.employmentLength}
            onChange={(e) => handleInputChange('employmentInfo', 'employmentLength', e.target.value)}
            placeholder="e.g., 2 years"
          />
        </div>
      </div>
    </div>
  );

  const renderRentalHistory = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="currentAddress">Current Address *</Label>
        <Input
          id="currentAddress"
          value={formData.rentalHistory.currentAddress}
          onChange={(e) => handleInputChange('rentalHistory', 'currentAddress', e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="landlordName">Current Landlord Name</Label>
          <Input
            id="landlordName"
            value={formData.rentalHistory.landlordName}
            onChange={(e) => handleInputChange('rentalHistory', 'landlordName', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="landlordPhone">Landlord Phone</Label>
          <Input
            id="landlordPhone"
            value={formData.rentalHistory.landlordPhone}
            onChange={(e) => handleInputChange('rentalHistory', 'landlordPhone', e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="monthlyRent">Current Monthly Rent (₦)</Label>
          <Input
            id="monthlyRent"
            type="number"
            value={formData.rentalHistory.monthlyRent}
            onChange={(e) => handleInputChange('rentalHistory', 'monthlyRent', parseInt(e.target.value) || 0)}
          />
        </div>
        <div>
          <Label htmlFor="reasonForMoving">Reason for Moving *</Label>
          <Input
            id="reasonForMoving"
            value={formData.rentalHistory.reasonForMoving}
            onChange={(e) => handleInputChange('rentalHistory', 'reasonForMoving', e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );

  const renderReferences = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-3">Emergency Contact *</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="emergencyName">Name *</Label>
            <Input
              id="emergencyName"
              value={formData.references.emergencyContactName}
              onChange={(e) => handleInputChange('references', 'emergencyContactName', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="emergencyPhone">Phone *</Label>
            <Input
              id="emergencyPhone"
              value={formData.references.emergencyContactPhone}
              onChange={(e) => handleInputChange('references', 'emergencyContactPhone', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="emergencyRelation">Relationship *</Label>
            <Input
              id="emergencyRelation"
              value={formData.references.emergencyContactRelation}
              onChange={(e) => handleInputChange('references', 'emergencyContactRelation', e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      <Separator />
      <div>
        <h4 className="font-medium mb-3">Personal Reference (Optional)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="referenceName">Name</Label>
            <Input
              id="referenceName"
              value={formData.references.personalReferenceName}
              onChange={(e) => handleInputChange('references', 'personalReferenceName', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="referencePhone">Phone</Label>
            <Input
              id="referencePhone"
              value={formData.references.personalReferencePhone}
              onChange={(e) => handleInputChange('references', 'personalReferencePhone', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdditionalInfo = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="hasPets"
          checked={formData.additionalInfo.hasPets}
          onCheckedChange={(checked) => handleInputChange('additionalInfo', 'hasPets', checked)}
        />
        <Label htmlFor="hasPets">I have pets</Label>
      </div>
      {formData.additionalInfo.hasPets && (
        <div>
          <Label htmlFor="petDescription">Pet Description *</Label>
          <Textarea
            id="petDescription"
            value={formData.additionalInfo.petDescription}
            onChange={(e) => handleInputChange('additionalInfo', 'petDescription', e.target.value)}
            placeholder="Describe your pets (type, breed, size, etc.)"
          />
        </div>
      )}
      <div>
        <Label htmlFor="smokingPreference">Smoking Preference *</Label>
        <Select 
          value={formData.additionalInfo.smokingPreference} 
          onValueChange={(value) => handleInputChange('additionalInfo', 'smokingPreference', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="non_smoker">Non-smoker</SelectItem>
            <SelectItem value="smoker">Smoker</SelectItem>
            <SelectItem value="occasional">Occasional smoker</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="moveInDate">Preferred Move-in Date *</Label>
          <Input
            id="moveInDate"
            type="date"
            value={formData.additionalInfo.moveInDate}
            onChange={(e) => handleInputChange('additionalInfo', 'moveInDate', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="leaseDuration">Preferred Lease Duration *</Label>
          <Select 
            value={formData.additionalInfo.leaseDuration} 
            onValueChange={(value) => handleInputChange('additionalInfo', 'leaseDuration', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6_months">6 months</SelectItem>
              <SelectItem value="12_months">12 months</SelectItem>
              <SelectItem value="18_months">18 months</SelectItem>
              <SelectItem value="24_months">24 months</SelectItem>
              <SelectItem value="month_to_month">Month to month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="additionalComments">Additional Comments</Label>
        <Textarea
          id="additionalComments"
          value={formData.additionalInfo.additionalComments}
          onChange={(e) => handleInputChange('additionalInfo', 'additionalComments', e.target.value)}
          placeholder="Any additional information you'd like to share..."
        />
      </div>
    </div>
  );

  const renderDocumentsAndAgreements = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-3">Required Documents</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Please confirm you have the following documents ready to upload:
        </p>
        <div className="space-y-3">
          {[
            { key: 'idDocument', label: 'Government-issued ID' },
            { key: 'incomeProof', label: 'Proof of income (pay stubs, bank statements)' },
            { key: 'bankStatements', label: 'Recent bank statements (last 3 months)' },
            { key: 'references', label: 'Reference letters' }
          ].map((doc) => (
            <div key={doc.key} className="flex items-center space-x-2">
              <Checkbox
                id={doc.key}
                checked={formData.documents[doc.key as keyof typeof formData.documents]}
                onCheckedChange={(checked) => handleInputChange('documents', doc.key, checked)}
              />
              <Label htmlFor={doc.key}>{doc.label}</Label>
            </div>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h4 className="font-medium mb-3">Agreements *</h4>
        <div className="space-y-3">
          {[
            { key: 'backgroundCheck', label: 'I consent to a background check' },
            { key: 'creditCheck', label: 'I consent to a credit check' },
            { key: 'termsAndConditions', label: 'I agree to the terms and conditions' }
          ].map((agreement) => (
            <div key={agreement.key} className="flex items-center space-x-2">
              <Checkbox
                id={agreement.key}
                checked={formData.agreements[agreement.key as keyof typeof formData.agreements]}
                onCheckedChange={(checked) => handleInputChange('agreements', agreement.key, checked)}
              />
              <Label htmlFor={agreement.key}>{agreement.label}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderPersonalInfo();
      case 1: return renderEmploymentInfo();
      case 2: return renderRentalHistory();
      case 3: return renderReferences();
      case 4: return renderAdditionalInfo();
      case 5: return renderDocumentsAndAgreements();
      default: return renderPersonalInfo();
    }
  };

  const canSubmit = () => {
    return formData.agreements.backgroundCheck && 
           formData.agreements.creditCheck && 
           formData.agreements.termsAndConditions;
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href={`/properties/${property.id}`}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Property
        </Link>
      </Button>

      {/* Property Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
              <Home className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">{property.title}</h3>
              <p className="text-sm text-muted-foreground">{property.location?.address}, {property.location?.city}</p>
              <p className="text-lg font-bold">₦{property.price?.amount?.toLocaleString()}/{property.price?.period}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="text-center mt-2 hidden md:block">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs text-muted-foreground">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`absolute top-5 left-12 w-full h-0.5 ${
                    index < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} style={{ width: 'calc(100% + 2rem)' }} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <p className="text-muted-foreground">{steps[currentStep].description}</p>
        </CardHeader>
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        
        {currentStep === steps.length - 1 ? (
          <Button 
            onClick={handleSubmit}
            disabled={!canSubmit() || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}