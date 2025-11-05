'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole, PropertyType } from '@/types';

const PROPERTY_TYPES: PropertyType[] = ['apartment', 'house', 'room', 'studio', 'shared', 'shared_room', 'lodge'];
const NIGERIAN_UNIVERSITIES = [
  'University of Lagos (UNILAG)',
  'University of Ibadan (UI)',
  'Obafemi Awolowo University (OAU)',
  'University of Nigeria, Nsukka (UNN)',
  'Ahmadu Bello University (ABU)',
  'University of Benin (UNIBEN)',
  'Lagos State University (LASU)',
  'Federal University of Technology, Akure (FUTA)',
  'University of Port Harcourt (UNIPORT)',
  'Covenant University',
  'Babcock University',
  'Other'
];

const NIGERIAN_STATES = [
  'Lagos', 'Abuja', 'Kano', 'Oyo', 'Rivers', 'Kaduna', 'Ogun', 'Imo', 'Plateau', 
  'Kwara', 'Anambra', 'Borno', 'Delta', 'Osun', 'Edo', 'Sokoto', 'Other'
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: '' as UserRole,
    firstName: '',
    lastName: '',
    phoneNumber: '',
    // Renter specific
    university: '',
    preferredBudgetMin: '',
    preferredBudgetMax: '',
    preferredPropertyTypes: [] as PropertyType[],
    preferredLocations: [] as string[],
    bio: '',
    // Agent specific
    company: '',
    position: '',
    licenseNumber: '',
    officeAddress: '',
    specialties: [] as PropertyType[],
    serviceAreas: [] as string[],
  });

  const { completeOnboarding, firebaseUser } = useAuth();
  const router = useRouter();

  const handleNext = () => {
    if (step === 1 && !formData.role) {
      toast.error('Please select your role');
      return;
    }
    if (step === 2) {
      if (!formData.firstName || !formData.lastName || !formData.phoneNumber) {
        toast.error('Please fill in all required fields');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      let profile;
      
      if (formData.role === 'renter') {
        profile = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          phone: formData.phoneNumber,
          dateOfBirth: '',
          occupation: 'Student',
          monthlyIncome: 0,
          preferredBudget: {
            min: parseInt(formData.preferredBudgetMin) || 0,
            max: parseInt(formData.preferredBudgetMax) || 0,
          },
          preferredPropertyTypes: formData.preferredPropertyTypes,
          preferredLocations: formData.preferredLocations,
          bio: formData.bio,
          profilePicture: firebaseUser?.photoURL || '',
          identityVerified: false,
          incomeVerified: false,
          emergencyContact: {
            name: '',
            relationship: '',
            phoneNumber: '',
            email: '',
          },
          preferences: {
            petsAllowed: false,
            smokingAllowed: false,
            furnished: false,
            maxCommute: 30,
          },
          savedSearches: [],
          viewedProperties: [],
        };
      } else {
        profile = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company,
          position: formData.position,
          licenseNumber: formData.licenseNumber,
          bio: formData.bio,
          profilePicture: firebaseUser?.photoURL || '',
          phoneNumber: formData.phoneNumber,
          phone: formData.phoneNumber,
          officeAddress: formData.officeAddress,
          specialties: formData.specialties,
          serviceAreas: formData.serviceAreas,
          languages: ['English'],
          rating: 0,
          totalReviews: 0,
          totalProperties: 0,
          totalDeals: 0,
          identityVerified: false,
          responseTime: 24,
          verificationStatus: 'pending' as const,
          verificationDocuments: [],
          commissionRate: 5,
          availabilitySchedule: {},
        };
      }

      const result = await completeOnboarding({
        role: formData.role,
        profile,
      });

      if (result.success) {
        toast.success('Welcome to RentMe!');
        // Redirect based on role
        if (formData.role === 'renter') {
          router.push('/dashboard');
        } else if (formData.role === 'agent') {
          router.push('/agent/dashboard');
        }
      } else {
        toast.error(result.error || 'Failed to complete onboarding');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Step {step} of {formData.role === 'renter' ? 3 : 3}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <Label className="text-lg font-medium">What best describes you?</Label>
              <RadioGroup value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="renter" id="renter" />
                  <Label htmlFor="renter" className="flex-1 cursor-pointer">
                    <div className="font-medium">Student Renter</div>
                    <div className="text-sm text-muted-foreground">
                      Looking for accommodation near your university
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="agent" id="agent" />
                  <Label htmlFor="agent" className="flex-1 cursor-pointer">
                    <div className="font-medium">Real Estate Agent</div>
                    <div className="text-sm text-muted-foreground">
                      Manage properties and connect with student renters
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="e.g., +234 801 234 5678"
                />
              </div>

              {formData.role === 'agent' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company/Agency</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Enter your company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="e.g., Real Estate Agent, Property Manager"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number (Optional)</Label>
                    <Input
                      id="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      placeholder="Enter your license number"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {step === 3 && formData.role === 'renter' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="university">University</Label>
                <Select value={formData.university} onValueChange={(value) => setFormData({ ...formData, university: value })}>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budgetMin">Min Budget (₦/month)</Label>
                  <Input
                    id="budgetMin"
                    type="number"
                    value={formData.preferredBudgetMin}
                    onChange={(e) => setFormData({ ...formData, preferredBudgetMin: e.target.value })}
                    placeholder="50000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetMax">Max Budget (₦/month)</Label>
                  <Input
                    id="budgetMax"
                    type="number"
                    value={formData.preferredBudgetMax}
                    onChange={(e) => setFormData({ ...formData, preferredBudgetMax: e.target.value })}
                    placeholder="200000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preferred Property Types</Label>
                <div className="grid grid-cols-2 gap-2">
                  {PROPERTY_TYPES.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={formData.preferredPropertyTypes.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              preferredPropertyTypes: [...formData.preferredPropertyTypes, type]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              preferredPropertyTypes: formData.preferredPropertyTypes.filter(t => t !== type)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={type} className="capitalize">{type.replace('_', ' ')}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preferred Locations</Label>
                <div className="grid grid-cols-2 gap-2">
                  {NIGERIAN_STATES.map((state) => (
                    <div key={state} className="flex items-center space-x-2">
                      <Checkbox
                        id={state}
                        checked={formData.preferredLocations.includes(state)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              preferredLocations: [...formData.preferredLocations, state]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              preferredLocations: formData.preferredLocations.filter(l => l !== state)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={state}>{state}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && formData.role === 'agent' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="officeAddress">Office Address</Label>
                <Textarea
                  id="officeAddress"
                  value={formData.officeAddress}
                  onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                  placeholder="Enter your office address"
                />
              </div>

              <div className="space-y-2">
                <Label>Property Specialties</Label>
                <div className="grid grid-cols-2 gap-2">
                  {PROPERTY_TYPES.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`specialty-${type}`}
                        checked={formData.specialties.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              specialties: [...formData.specialties, type]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              specialties: formData.specialties.filter(t => t !== type)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={`specialty-${type}`} className="capitalize">{type.replace('_', ' ')}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Service Areas</Label>
                <div className="grid grid-cols-2 gap-2">
                  {NIGERIAN_STATES.map((state) => (
                    <div key={state} className="flex items-center space-x-2">
                      <Checkbox
                        id={`area-${state}`}
                        checked={formData.serviceAreas.includes(state)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              serviceAreas: [...formData.serviceAreas, state]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              serviceAreas: formData.serviceAreas.filter(l => l !== state)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={`area-${state}`}>{state}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            
            <div className="ml-auto">
              {step < 3 ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Profile...
                    </>
                  ) : (
                    'Complete Setup'
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}