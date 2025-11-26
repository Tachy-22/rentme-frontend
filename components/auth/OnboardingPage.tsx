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
  'Lagos State University (LASU)',
  'Federal University of Technology, Akure (FUTA)',
 
 
];

const NIGERIAN_STATES = [
  'Lagos', 'Ondo', 'Oyo'
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
          verificationStatus: 'pending' as const,
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
    <div className="min-h-screen bg-black flex">
      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-4 md:p-8 lg:p-12 max-h-screen overflow-auto">
        <div className="mb-6 md:mb-8">
          <img 
            src="/logo.png" 
            alt="RentMe Logo" 
            className="h-8 md:h-6 w-auto"
          />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-lg bg-black/80 border border-white/10 backdrop-blur-sm">
        <CardHeader className="px-4 md:px-6 pt-4 md:pt-6">
          <CardTitle className="text-white text-xl md:text-2xl">Complete Your Profile</CardTitle>
          <CardDescription className="text-gray-400 text-sm md:text-base">
            Step {step} of {formData.role === 'renter' ? 3 : 3}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6 px-4 md:px-6 pb-4 md:pb-6">
          {step === 1 && (
            <div className="space-y-4">
              <Label className="text-base md:text-lg font-medium text-white">What best describes you?</Label>
              <RadioGroup value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}>
                <div className="flex items-center space-x-3 p-3 md:p-4 border border-white/10 rounded-lg hover:bg-orange-500/10 cursor-pointer transition-colors"
                     onClick={() => setFormData({ ...formData, role: 'renter' })}>
                  <RadioGroupItem value="renter" id="renter" className="text-orange-500 border-orange-500/30" />
                  <Label htmlFor="renter" className="flex-1 cursor-pointer">
                    <div className="font-medium text-white text-sm md:text-base">Student Renter</div>
                    {/* <div className="text-sm text-gray-400">
                      Looking for accommodation near your university
                    </div> */}
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 md:p-4 border border-white/10 rounded-lg hover:bg-orange-500/10 cursor-pointer transition-colors"
                     onClick={() => setFormData({ ...formData, role: 'agent' })}>
                  <RadioGroupItem value="agent" id="agent" className="text-orange-500 border-orange-500/30" />
                  <Label htmlFor="agent" className="flex-1 cursor-pointer">
                    <div className="font-medium text-white text-sm md:text-base">Real Estate Agent</div>
                    {/* <div className="text-sm text-gray-400">
                      Manage properties and connect with student renters
                    </div> */}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white text-sm md:text-base">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Enter your first name"
                    className="text-white bg-white/5 border-white/20 placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white text-sm md:text-base">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Enter your last name"
                    className="text-white bg-white/5 border-white/20 placeholder:text-gray-400"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-white text-sm md:text-base">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="e.g., +234 801 234 5678"
                  className="text-white bg-white/5 border-white/20 placeholder:text-gray-400"
                />
              </div>

              {formData.role === 'agent' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-white text-sm md:text-base">Company/Agency</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Enter your company name"
                      className="text-white bg-white/5 border-white/20 placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-white text-sm md:text-base">Position</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="e.g., Real Estate Agent, Property Manager"
                      className="text-white bg-white/5 border-white/20 placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber" className="text-white text-sm md:text-base">License Number (Optional)</Label>
                    <Input
                      id="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      placeholder="Enter your license number"
                      className="text-white bg-white/5 border-white/20 placeholder:text-gray-400"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {step === 3 && formData.role === 'renter' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="university" className="text-white">University</Label>
                <Select value={formData.university} onValueChange={(value) => setFormData({ ...formData, university: value })}>
                  <SelectTrigger className="text-white bg-white/5 border-white/20 data-[placeholder]:text-gray-400">
                    <SelectValue placeholder="Select your university" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20">
                    {NIGERIAN_UNIVERSITIES.map((uni) => (
                      <SelectItem key={uni} value={uni} className="text-white hover:bg-white/10 focus:bg-white/10">{uni}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budgetMin" className="text-white text-sm md:text-base">Min Budget (₦/year)</Label>
                  <Input
                    id="budgetMin"
                    type="number"
                    value={formData.preferredBudgetMin}
                    onChange={(e) => setFormData({ ...formData, preferredBudgetMin: e.target.value })}
                    placeholder="50000"
                    className="text-white bg-white/5 border-white/20 placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetMax" className="text-white text-sm md:text-base">Max Budget (₦/month)</Label>
                  <Input
                    id="budgetMax"
                    type="number"
                    value={formData.preferredBudgetMax}
                    onChange={(e) => setFormData({ ...formData, preferredBudgetMax: e.target.value })}
                    placeholder="200000"
                    className="text-white bg-white/5 border-white/20 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white text-sm md:text-base">Preferred Property Types</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                      <Label htmlFor={type} className="capitalize text-white text-sm">{type.replace('_', ' ')}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white text-sm md:text-base">Preferred Locations</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                      <Label htmlFor={state} className="text-white text-sm">{state}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && formData.role === 'agent' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="officeAddress" className="text-white">Office Address</Label>
                <Textarea
                  id="officeAddress"
                  value={formData.officeAddress}
                  onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                  placeholder="Enter your office address"
                  className="text-white bg-white/5 border-white/20 placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Property Specialties</Label>
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
                      <Label htmlFor={`specialty-${type}`} className="capitalize text-white">{type.replace('_', ' ')}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Service Areas</Label>
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
                      <Label htmlFor={`area-${state}`} className="text-white">{state}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 md:pt-6">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} className="text-sm md:text-base">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            
            <div className="ml-auto">
              {step < 3 ? (
                <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600 text-white text-sm md:text-base">
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading} className="bg-orange-500 hover:bg-orange-600 text-white text-sm md:text-base">
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
      </div>

      {/* Right Column - Image Gallery */}
      <div className="hidden lg:block w-1/2 relative">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Student accommodation"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <h3 className="text-white text-2xl font-bold mb-2">Find Your Perfect Student Home</h3>
            <p className="text-gray-200">Discover comfortable, affordable accommodation near your university with verified agents and secure booking.</p>
          </div>
        </div>
      </div>
    </div>
  );
}