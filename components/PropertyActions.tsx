'use client';

import { Property, User, AgentProfile } from '../types';
import { useState } from 'react';
import Link from 'next/link';

interface PropertyActionsProps {
  property: Property;
  agent: User;
  currentUser: User;
  isSaved: boolean;
}

export function PropertyActions({ property, agent, currentUser, isSaved }: PropertyActionsProps) {
  const [saved, setSaved] = useState(isSaved);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  const toggleSave = () => {
    setSaved(!saved);
    // In real app, this would make an API call
  };

  const agentProfile = agent.profile as AgentProfile;

  return (
    <>
      {/* Action Buttons */}
      <div className="bg-white px-4 py-4 border-b border-gray-200 sticky top-16 z-30">
        <div className="flex space-x-3">
          {/* Save Button */}
          <button
            onClick={toggleSave}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${saved
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
          >
            <svg
              className={`w-5 h-5 ${saved ? 'fill-current' : ''}`}
              fill={saved ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>

          {/* Message Agent Button */}
          <Link
            href={`/messages/new?agentId=${agent.id}&propertyId=${property.id}`}
            className="flex-1 py-3 px-4 bg-orange-50 text-orange-600 border border-orange-200 rounded-lg font-medium hover:bg-orange-100 transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>Message</span>
          </Link>

          {/* Apply Button */}
          <button
            onClick={() => setShowApplicationModal(true)}
            className="flex-1 py-3 px-4 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Apply</span>
          </button>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowApplicationModal(false)}></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Apply for {property.title}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Ready to apply? This will take you to the application form where you can submit your documents and details.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Link
                  href={`/apply/${property.id}`}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Continue Application
                </Link>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowApplicationModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}