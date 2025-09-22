import { getPropertyById, getUserById, getStudents, getSavedPropertiesByUser } from '../../../data';
import { Header } from '../../../components/Header';
import { PropertyImageGallery } from '../../../components/PropertyImageGallery';
import { AgentCard } from '../../../components/AgentCard';
import { PropertyActions } from '../../../components/PropertyActions';
import { notFound } from 'next/navigation';

interface PropertyPageProps {
  params: {
    id: string;
  };
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const property = getPropertyById(params.id);
  const currentUser = getStudents()[3]; // Mock current user

  if (!property) {
    notFound();
  }

  const agent = getUserById(property.agentId);
  const savedProperties = getSavedPropertiesByUser(currentUser.id);
  const isSaved = savedProperties.some(saved => saved.propertyId === property.id);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const primaryUniversity = property.location.nearbyUniversities[0];
  const distanceInfo = property.location.distanceToUniversity[primaryUniversity];

  return (
    <div className="min-h-screen bg-gray-50 ">
      <Header user={currentUser} />

      <main className="pb-20 md:max-w-5xl mx-auto">
        {/* Image Gallery */}
        <PropertyImageGallery images={property.images} title={property.title} />

        {/* Property Header */}
        <div className="bg-white px-4 py-6 border-b border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <p className="text-gray-600 mb-2">{property.location.address}, {property.location.city}</p>

              {/* Property Type Badge */}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 capitalize">
                {property.type}
              </span>
            </div>

            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">{formatPrice(property.price.amount)}</p>
              <p className="text-sm text-gray-500">/{property.price.period}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              {property.details.bedrooms} bedroom{property.details.bedrooms !== 1 ? 's' : ''}
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
              {property.details.bathrooms} bathroom{property.details.bathrooms !== 1 ? 's' : ''}
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              {property.details.area.value} {property.details.area.unit}
            </div>
          </div>
        </div>

        {/* Property Actions */}
        <PropertyActions
          property={property}
          agent={agent!}
          currentUser={currentUser}
          isSaved={isSaved}
        />

        {/* Description */}
        <div className="bg-white px-4 py-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
          <p className="text-gray-700 leading-relaxed">{property.description}</p>
        </div>

        {/* Distance to University */}
        <div className="bg-white px-4 py-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Location</h2>
          <div className="space-y-3">
            <div className="flex items-center text-gray-700">
              <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{distanceInfo?.distance} {distanceInfo?.unit} from {primaryUniversity}</span>
            </div>

            {/* Transport Methods */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <svg className="w-6 h-6 mx-auto mb-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-xs text-gray-600">Walking</p>
                <p className="font-semibold text-sm">{distanceInfo?.transportMethods.walking}min</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <svg className="w-6 h-6 mx-auto mb-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <p className="text-xs text-gray-600">Driving</p>
                <p className="font-semibold text-sm">{distanceInfo?.transportMethods.driving}min</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <svg className="w-6 h-6 mx-auto mb-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="text-xs text-gray-600">Public Transport</p>
                <p className="font-semibold text-sm">{distanceInfo?.transportMethods.publicTransport}min</p>
              </div>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-white px-4 py-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Furnished:</span>
              <span className="ml-2 font-medium">{property.details.furnished ? 'Yes' : 'No'}</span>
            </div>
            <div>
              <span className="text-gray-600">Pets Allowed:</span>
              <span className="ml-2 font-medium">{property.details.petsAllowed ? 'Yes' : 'No'}</span>
            </div>
            <div>
              <span className="text-gray-600">Smoking:</span>
              <span className="ml-2 font-medium">{property.details.smokingAllowed ? 'Allowed' : 'Not Allowed'}</span>
            </div>
            <div>
              <span className="text-gray-600">Available From:</span>
              <span className="ml-2 font-medium">{new Date(property.details.availableFrom).toLocaleDateString()}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600">Lease Duration:</span>
              <span className="ml-2 font-medium">
                {property.details.leaseDuration.min}-{property.details.leaseDuration.max} {property.details.leaseDuration.unit}
              </span>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-white px-4 py-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
          <div className="grid grid-cols-2 gap-3">
            {property.amenities.map((amenity) => (
              <div key={amenity} className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-700">{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Utilities */}
        <div className="bg-white px-4 py-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Utilities</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Included</h3>
              <div className="flex flex-wrap gap-2">
                {property.utilities.included.map((utility) => (
                  <span key={utility} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {utility}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Not Included</h3>
              <div className="flex flex-wrap gap-2">
                {property.utilities.excluded.map((utility) => (
                  <span key={utility} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {utility}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="bg-white px-4 py-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">House Rules</h2>
          <div className="space-y-2">
            {property.rules.map((rule, index) => (
              <div key={index} className="flex items-start">
                <svg className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
                <span className="text-sm text-gray-700">{rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Info */}
        <AgentCard agent={agent!} />

        {/* Virtual Tour */}
        {property.virtualTourUrl && (
          <div className="bg-white px-4 py-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Virtual Tour</h2>
            <button className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors">
              Take Virtual Tour
            </button>
          </div>
        )}
      </main>
    </div>
  );
}