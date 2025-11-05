'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, PropertyType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  AlertTriangle,
  Save
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { updateProperty } from '@/actions/properties/updateProperty';

interface EditPropertyPageProps {
  user: User;
  property: any;
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

export default function EditPropertyPage({ user, property }: EditPropertyPageProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 1: Basic Details
    title: property.title || '',
    type: property.type as PropertyType || '',
    price: property.price?.amount?.toString() || '',
    currency: property.price?.currency || 'NGN',
    period: property.price?.period || 'monthly',
    address: property.location?.address || '',
    city: property.location?.city || '',
    state: property.location?.state || '',
    
    // Step 2: Property Details
    bedrooms: property.details?.bedrooms?.toString() || '1',
    bathrooms: property.details?.bathrooms?.toString() || '1',
    area: property.details?.area?.value?.toString() || '',
    areaUnit: property.details?.area?.unit || 'sqm',
    furnished: property.furnished || false,
    availableFrom: property.availableFrom || '',
    leaseDurationMin: property.leaseDuration?.min?.toString() || '6',
    leaseDurationMax: property.leaseDuration?.max?.toString() || '12',
    
    // Step 3: Images & Description
    description: property.description || '',
    amenities: property.amenities || [],
    utilities: {
      included: property.utilities?.included || [],
      excluded: property.utilities?.excluded || []
    },
    rules: property.rules || [],
    existingImages: property.images || [],
    newImages: [] as File[],
    imagesToRemove: [] as string[]
  });

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
        if (!formData.description || (formData.existingImages.length === 0 && formData.newImages.length === 0)) {
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
      const totalImages = formData.existingImages.length + formData.newImages.length + newImages.length - formData.imagesToRemove.length;
      
      if (totalImages > 5) {
        toast.error('Maximum 5 images allowed');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        newImages: [...prev.newImages, ...newImages]
      }));
    }
  };

  const removeExistingImage = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      imagesToRemove: [...prev.imagesToRemove, imageUrl]
    }));
  };

  const removeNewImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index)
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
      // Prepare the update data
      const updates = {
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
        availableFrom: formData.availableFrom,
        leaseDuration: {
          min: parseInt(formData.leaseDurationMin),
          max: parseInt(formData.leaseDurationMax)
        },
        furnished: formData.furnished,
        newImages: formData.newImages.length > 0 ? formData.newImages : undefined,
        removeImages: formData.imagesToRemove.length > 0 ? formData.imagesToRemove : undefined
      };

      const result = await updateProperty({
        propertyId: property.id,
        updates
      });
      
      if (result.success) {
        toast.success('Property updated successfully!');
        router.push('/agent/properties');
      } else {
        toast.error(result.error || 'Failed to update property');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Failed to update property');
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
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/agent/properties">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Properties
            </Link>
          </Button>

          <h1 className="text-3xl font-bold">Edit Property</h1>
          <p className="text-muted-foreground">
            Update your property listing details
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
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
                    <span className="font-medium">{step.title}</span>
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
          <CardContent className="p-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms *</Label>
                    <Select value={formData.bedrooms} onValueChange={(value) => setFormData(prev => ({ ...prev, bedrooms: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5].map(num => (
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
                        {[1,2,3,4,5].map(num => (
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
                    <div className="flex gap-2 items-center">
                      <Select value={formData.leaseDurationMin} onValueChange={(value) => setFormData(prev => ({ ...prev, leaseDurationMin: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[3,6,9,12,18,24].map(num => (
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
                          {[6,12,18,24,36].map(num => (
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
              <div className="space-y-6">
                <div>
                  <Label htmlFor="description">Property Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your property, its features, and what makes it special..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Property Images * (Max 5)</Label>
                  
                  {/* Existing Images */}
                  {formData.existingImages.filter(img => !formData.imagesToRemove.includes(img.url)).length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium mb-2">Current Images</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {formData.existingImages
                          .filter(img => !formData.imagesToRemove.includes(img.url))
                          .map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                              <Image
                                src={image.url}
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
                              onClick={() => removeExistingImage(image.url)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Images Upload */}
                  <div className="mt-4">
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
                          Click to upload additional images or drag and drop
                        </p>
                      </div>
                    </label>

                    {formData.newImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {formData.newImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                              <Image
                                src={URL.createObjectURL(image)}
                                alt={`New property image ${index + 1}`}
                                width={200}
                                height={150}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeNewImage(index)}
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
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {AMENITIES.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          checked={formData.amenities.includes(amenity)}
                          onCheckedChange={() => toggleAmenity(amenity)}
                        />
                        <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
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
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Updating...' : 'Update Property'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}