import { getStudents, getApplicationsByStudent, getSavedPropertiesByUser } from '../../data';
import { BottomNavigation } from '../../components/BottomNavigation';
import { Header } from '../../components/Header';
import { StudentProfile as StudentProfileType } from '../../types';
import Image from 'next/image';

export default function ProfilePage() {
  const currentUser = getStudents()[3];
  const profile = currentUser.profile as StudentProfileType;
  const applications = getApplicationsByStudent(currentUser.id);
  const savedProperties = getSavedPropertiesByUser(currentUser.id);

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 md:pt-[2rem]">
      {/* Mobile Header */}
      <div className="md:hidden">
        <Header user={currentUser} />
      </div>

      <main className="pb-20 md:pb-0 md:pt-16">
        <div className="md:max-w-7xl md:mx-auto md:px-4 lg:px-6">
          {/* Profile Header */}
          <div className="bg-white md:rounded-lg md:border md:shadow-sm md:mb-6">
            <div className="px-4 py-6 md:px-6 md:py-8">
              <div className="flex items-start space-x-4 md:space-x-6">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gray-200">
                    <Image
                      src={profile.profilePicture}
                      alt={`${profile.firstName} ${profile.lastName}`}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute -bottom-1 -right-1 p-1.5 md:p-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors">
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="text-gray-600 text-sm md:text-base mb-2">{profile.course} • Year {profile.yearOfStudy}</p>
                  <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">{profile.university}</p>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <button className="px-4 py-2 md:px-6 md:py-3 bg-orange-600 text-white rounded-lg text-sm md:text-base font-medium hover:bg-orange-700 transition-colors">
                      Edit Profile
                    </button>
                    <button className="px-4 py-2 md:px-6 md:py-3 border border-gray-300 text-gray-700 rounded-lg text-sm md:text-base font-medium hover:bg-gray-50 transition-colors">
                      Share Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">{profile.bio}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="px-4 py-4 md:px-0 md:py-0 md:mb-6">
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              <div className="bg-white rounded-lg p-4 md:p-6 text-center border border-gray-200 shadow-sm">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{savedProperties.length}</div>
                <div className="text-xs md:text-sm text-gray-600">Saved Properties</div>
              </div>
              <div className="bg-white rounded-lg p-4 md:p-6 text-center border border-gray-200 shadow-sm">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{applications.length}</div>
                <div className="text-xs md:text-sm text-gray-600">Applications</div>
              </div>
              <div className="bg-white rounded-lg p-4 md:p-6 text-center border border-gray-200 shadow-sm">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {applications.filter(app => app.status === 'approved').length}
                </div>
                <div className="text-xs md:text-sm text-gray-600">Approved</div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-4 md:space-y-6 px-4 md:px-0 md:grid md:grid-cols-2 md:gap-6">
            {/* Budget */}
            <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 md:text-lg">Budget Range</h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 md:text-base">Monthly budget</span>
                <span className="font-medium text-gray-900 md:text-base">
                  {formatBudget(profile.budget.min)} - {formatBudget(profile.budget.max)}
                </span>
              </div>
            </div>

            {/* Preferred Property Types */}
            <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 md:text-lg">Preferred Property Types</h3>
              <div className="flex flex-wrap gap-2">
                {profile.preferredPropertyTypes.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center px-3 py-1 md:px-4 md:py-2 rounded-full text-sm md:text-base bg-orange-100 text-orange-800 capitalize"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 md:text-lg">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 md:text-base">Phone</span>
                  <span className="font-medium text-gray-900 md:text-base">{profile.phoneNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 md:text-base">Email</span>
                  <span className="font-medium text-gray-900 md:text-base">{currentUser.email}</span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 md:text-lg">Emergency Contact</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 md:text-base">Name</span>
                  <span className="font-medium text-gray-900 md:text-base">{profile.emergencyContact.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 md:text-base">Relationship</span>
                  <span className="font-medium text-gray-900 md:text-base">{profile.emergencyContact.relationship}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 md:text-base">Phone</span>
                  <span className="font-medium text-gray-900 md:text-base">{profile.emergencyContact.phoneNumber}</span>
                </div>
              </div>
            </div>

            {/* Video Introduction - Full Width on Desktop */}
            {profile.videoIntroduction && (
              <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200 shadow-sm md:col-span-2">
                <h3 className="font-semibold text-gray-900 mb-3 md:text-lg">Video Introduction</h3>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <button className="flex items-center space-x-2 text-orange-600 hover:text-orange-700">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span className="font-medium md:text-lg">Play Video</span>
                  </button>
                </div>
              </div>
            )}

            {/* Account Settings - Full Width on Desktop */}
            <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200 shadow-sm md:col-span-2">
              <h3 className="font-semibold text-gray-900 mb-3 md:text-lg">Account Settings</h3>
              <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                <button className="w-full flex items-center justify-between py-2 md:py-3">
                  <span className="text-gray-700 md:text-base">Notifications</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button className="w-full flex items-center justify-between py-2 md:py-3">
                  <span className="text-gray-700 md:text-base">Privacy</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button className="w-full flex items-center justify-between py-2 md:py-3">
                  <span className="text-gray-700 md:text-base">Help & Support</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button className="w-full flex items-center justify-between py-2 md:py-3">
                  <span className="text-red-600 md:text-base">Sign Out</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation currentRoute="profile" />
    </div>
  );
}