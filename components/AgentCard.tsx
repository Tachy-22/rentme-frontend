import { User, AgentProfile } from '../types';
import Image from 'next/image';
import Link from 'next/link';

interface AgentCardProps {
  agent: User;
}

export function AgentCard({ agent }: AgentCardProps) {
  const profile = agent.profile as AgentProfile;

  return (
    <div className="bg-white px-4 py-6 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Listed by</h2>

      <div className="flex items-start space-x-4">
        {/* Agent Photo */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
            <Image
              src={profile.profilePicture}
              alt={`${profile.firstName} ${profile.lastName}`}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Agent Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {profile.firstName} {profile.lastName}
            </h3>
            {profile.verificationStatus === 'verified' && (
              <div className="flex items-center">
                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-2">{profile.company}</p>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(profile.rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {profile.rating} ({profile.totalReviews} reviews)
            </span>
          </div>

          {/* Bio */}
          <p className="text-sm text-gray-700 mb-4 line-clamp-2">{profile.bio}</p>

          {/* Specialties */}
          <div className="flex flex-wrap gap-1 mb-4">
            {profile.specialties.slice(0, 3).map((specialty) => (
              <span
                key={specialty}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700 capitalize"
              >
                {specialty}
              </span>
            ))}
          </div>

          {/* Contact Buttons */}
          <div className="flex space-x-2">
            <Link
              href={`/messages/new?agentId=${agent.id}`}
              className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium text-center hover:bg-orange-700 transition-colors"
            >
              Message
            </Link>
            <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Call
            </button>
            <Link
              href={`/agent/${agent.id}`}
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Office Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-start space-x-2">
          <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div>
            <p className="text-sm text-gray-600">Office Address</p>
            <p className="text-sm text-gray-900">{profile.officeAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
}