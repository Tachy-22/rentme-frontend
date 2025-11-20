'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, PropertyType, AgentProfile } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  X,
  Plus,
  MapPin,
  Home,
  DollarSign,
  Image as ImageIcon,
  FileText,
  Check,
  Shield,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { getUserAccessRules, checkPropertyLimit } from '@/lib/access-control';
import { getAgentPropertyCount } from '@/actions/properties/getAgentPropertyCount';
import { createProperty } from '@/actions/properties/createProperty';

interface AddPropertyPageProps {
  user: User;
}

const PROPERTY_TYPES: PropertyType[] = ['apartment', 'house', 'room', 'studio', 'shared', 'shared_room', 'lodge'];
const AMENITIES = [
  'WiFi', 'Parking', 'Kitchen', 'Air Conditioning', 'Laundry', 'Security',
  'Gym', 'Pool', 'Generator', 'Water Supply', 'Cable TV', 'Furnished'
];
const NIGERIAN_STATES = [
  'Lagos', 'Abuja', 'Kano', 'Oyo', 'Rivers', 'Kaduna', 'Ogun', 'Imo', 'Plateau',
  'Kwara', 'Anambra', 'Borno', 'Delta', 'Osun', 'Edo', 'Sokoto'
];

export default function AddPropertyPage({ user }: AddPropertyPageProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [propertyCount, setPropertyCount] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [isLoadingCount, setIsLoadingCount] = useState(true);

  const [formData, setFormData] = useState({
    // Step 1: Basic Details
    title: '',
    type: '' as PropertyType,
    price: '',
    currency: 'NGN',
    period: 'monthly',
    address: '',
    city: '',
    state: '',

    // Step 2: Property Details
    bedrooms: '1',
    bathrooms: '1',
    area: '',
    areaUnit: 'sqm',
    furnished: false,
    availableFrom: '',
    leaseDurationMin: '6',
    leaseDurationMax: '12',

    // Step 3: Images & Description
    description: '',
    amenities: [] as string[],
    utilities: {
      included: [] as string[],
      excluded: [] as string[]
    },
    rules: [] as string[],
    images: [] as File[]
  });

  const agentProfile = user.profile as AgentProfile;
  const isVerified = agentProfile.verificationStatus === "verified" || false;
  const accessRules = getUserAccessRules(user);

  useEffect(() => {
    loadPropertyCount();
  }, []);

  const loadPropertyCount = async () => {
    try {
      const result = await getAgentPropertyCount();
      if (result.success) {
        setPropertyCount(result.count || 0);
      }
    } catch (error) {
      console.error('Error loading property count:', error);
    } finally {
      setIsLoadingCount(false);
    }
  };

  const propertyLimitCheck = checkPropertyLimit(user, propertyCount);

  useEffect(() => {
    if (!isLoadingCount && !propertyLimitCheck.canAdd) {
      setShowLimitModal(true);
    }
  }, [isLoadingCount, propertyLimitCheck.canAdd]);

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (!formData.title || !formData.type || !formData.price || !formData.address || !formData.city || !formData.state) {
          toast.error('Please fill in all required fields');
          return false;
        }
        break;
      case 2:
        if (!formData.bedrooms || !formData.bathrooms || !formData.availableFrom) {
          toast.error('Please fill in all required fields');
          return false;
        }
        break;
      case 3:
        if (!formData.description || formData.images.length === 0) {
          toast.error('Please add a description and at least one image');
          return false;
        }
        break;
    }
    return true;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 5) // Max 5 images
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      // Prepare the property data
      const propertyData = {
        title: formData.title,
        type: formData.type,
        price: {
          amount: parseInt(formData.price),
          currency: formData.currency,
          period: formData.period
        },
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state
        },
        details: {
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          area: {
            value: formData.area ? parseInt(formData.area) : 0,
            unit: formData.areaUnit
          }
        },
        description: formData.description,
        amenities: formData.amenities,
        utilities: {
          included: formData.utilities.included,
          excluded: formData.utilities.excluded
        },
        rules: formData.rules,
        images: formData.images,
        availableFrom: formData.availableFrom,
        leaseDuration: {
          min: parseInt(formData.leaseDurationMin),
          max: parseInt(formData.leaseDurationMax)
        },
        furnished: formData.furnished
      };

      const result = await createProperty(propertyData);

      if (result.success) {
        toast.success('Property added successfully!');
        router.push('/agent/properties');
      } else {
        toast.error(result.error || 'Failed to add property');
      }
    } catch (error) {
      console.error('Error creating property:', error);
      toast.error('Failed to add property');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Details', icon: Home },
    { number: 2, title: 'Property Details', icon: MapPin },
    { number: 3, title: 'Images & Description', icon: ImageIcon }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className=" max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/agent/properties">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Properties</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </Button>

          <h1 className="text-2xl md:text-3xl font-bold">Add New Property</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Create a new property listing for your portfolio
          </p>
        </div>

        {/* Verification Warning */}
        {!isVerified && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> As an unverified agent, your listing will require admin approval before going live.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Progress Steps */}
        <div className="mb-6 md:mb-8">
          {/* Mobile Progress - Simple Step Indicator */}
          <div className="sm:hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Step {currentStep} of {steps.length}</span>
              <span className="text-sm font-medium">{steps[currentStep - 1].title}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Desktop Progress - Full Steps */}
          <div className="hidden sm:flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center gap-2 ${isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'}`}>
                    <div className={`p-2 rounded-full border-2 ${isActive ? 'border-primary bg-primary/10' : isCompleted ? 'border-green-600 bg-green-100' : 'border-muted'}`}>
                      {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span className="text-sm font-medium">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`mx-4 h-px w-24 ${isCompleted ? 'bg-green-600' : 'bg-muted'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardContent className="p-4 md:p-6">
            {currentStep === 1 && (
              <div className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Property Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Modern 2-Bedroom Apartment near UNILAG"
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Property Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as PropertyType }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROPERTY_TYPES.map((type) => (
                          <SelectItem key={type} value={type} className="capitalize">
                            {type.replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="price">Monthly Rent (₦) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="150000"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="123 Allen Avenue"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Ikeja"
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select value={formData.state} onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {NIGERIAN_STATES.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms *</Label>
                    <Select value={formData.bedrooms} onValueChange={(value) => setFormData(prev => ({ ...prev, bedrooms: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="bathrooms">Bathrooms *</Label>
                    <Select value={formData.bathrooms} onValueChange={(value) => setFormData(prev => ({ ...prev, bathrooms: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="area">Floor Area</Label>
                    <div className="flex gap-2">
                      <Input
                        id="area"
                        type="number"
                        value={formData.area}
                        onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                        placeholder="85"
                      />
                      <Select value={formData.areaUnit} onValueChange={(value) => setFormData(prev => ({ ...prev, areaUnit: value }))}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sqm">sqm</SelectItem>
                          <SelectItem value="sqft">sqft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="availableFrom">Available From *</Label>
                    <Input
                      id="availableFrom"
                      type="date"
                      value={formData.availableFrom}
                      onChange={(e) => setFormData(prev => ({ ...prev, availableFrom: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label>Lease Duration (months)</Label>
                    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                      <Select value={formData.leaseDurationMin} onValueChange={(value) => setFormData(prev => ({ ...prev, leaseDurationMin: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[3, 6, 9, 12, 18, 24].map(num => (
                            <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-muted-foreground">to</span>
                      <Select value={formData.leaseDurationMax} onValueChange={(value) => setFormData(prev => ({ ...prev, leaseDurationMax: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[6, 12, 18, 24, 36].map(num => (
                            <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="furnished"
                        checked={formData.furnished}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, furnished: !!checked }))}
                      />
                      <Label htmlFor="furnished">Property is furnished</Label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4 md:space-y-6">
                <div>
                  <Label htmlFor="description">Property Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your property, its features, and what makes it special..."
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.description.length}/500 characters
                  </p>
                </div>

                <div>
                  <Label>Property Images * (Max 5)</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="images"
                    />
                    <label htmlFor="images" className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 block cursor-pointer hover:border-muted-foreground/50 transition-colors">
                      <div className="text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload images or drag and drop
                        </p>
                      </div>
                    </label>

                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                              <Image
                                src={URL.createObjectURL(image)}
                                alt={`Property image ${index + 1}`}
                                width={200}
                                height={150}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Amenities</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    {AMENITIES.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id={amenity}
                          checked={formData.amenities.includes(amenity)}
                          onCheckedChange={() => toggleAmenity(amenity)}
                        />
                        <Label htmlFor={amenity} className="text-sm font-medium cursor-pointer flex-1">{amenity}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-4 md:pt-6 border-t">
              {/* Mobile Navigation */}
              <div className="sm:hidden space-y-3">
                {currentStep < 3 ? (
                  <>
                    <Button onClick={handleNext} className="w-full" size="lg">
                      Continue to {steps[currentStep]?.title}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    {currentStep > 1 && (
                      <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="w-full"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to {steps[currentStep - 2]?.title}
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full" size="lg">
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          Publishing...
                        </>
                      ) : (
                        'Publish Property'
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleBack}
                      className="w-full"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to {steps[currentStep - 2]?.title}
                    </Button>
                  </>
                )}
              </div>

              {/* Desktop Navigation */}
              <div className="hidden sm:flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>

                {currentStep < 3 ? (
                  <Button onClick={handleNext}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Publishing...' : 'Publish Property'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Benefits Card */}
        {!isVerified && (
          <Card className="border-blue-200 bg-blue-50 mt-6">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg self-center md:self-start">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-2 text-center md:text-left">Get Verified for More Benefits</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-600" />
                      <span>Unlimited property listings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-600" />
                      <span>Featured listing placement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-600" />
                      <span>Access to matched renters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-600" />
                      <span>Priority in search results</span>
                    </div>
                  </div>
                  <Button asChild className="mt-4 w-full sm:w-auto" size="sm">
                    <Link href="/verification">
                      <Shield className="w-4 h-4 mr-2" />
                      Get Verified Now
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Property Limit Warning */}
        {!isVerified && accessRules.propertyLimit && (
          <Card className="border-yellow-200 bg-yellow-50 mt-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div className="text-center sm:text-left">
                  <p className="font-medium text-yellow-800">
                    Property Limit: {propertyCount}/{accessRules.propertyLimit}
                  </p>
                  <p className="text-sm text-yellow-700">
                    {propertyLimitCheck.remaining ?
                      `${propertyLimitCheck.remaining} properties remaining.` :
                      'You\'ve reached your property limit.'
                    } Get verified for unlimited listings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Property Limit Modal */}
      <AlertDialog open={showLimitModal} onOpenChange={setShowLimitModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Property Limit Reached
            </AlertDialogTitle>
            <AlertDialogDescription>
              {propertyLimitCheck.message || 'You have reached your property listing limit.'}
              <br /><br />
              <strong>Verification Benefits:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Unlimited property listings</li>
                <li>Featured listing placement</li>
                <li>Access to matched renters</li>
                <li>Priority in search results</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => router.push('/agent/properties')}>
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link href="/verification">
                <Shield className="w-4 h-4 mr-2" />
                Get Verified
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}