'use client';

import { User, Property, AgentProfile } from '../types';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface NewMessageFormProps {
  agent: User;
  property: Property | null;
  currentUser: User;
}

export function NewMessageForm({ agent, property, currentUser }: NewMessageFormProps) {
  const [message, setMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const router = useRouter();

  const agentProfile = agent.profile as AgentProfile;

  const messageTemplates = [
    {
      id: 'viewing',
      title: 'Request Viewing',
      content: `Hi ${agentProfile.firstName}, I'm interested in viewing this property. When would be a good time to schedule a viewing?`
    },
    {
      id: 'questions',
      title: 'Ask Questions',
      content: `Hi ${agentProfile.firstName}, I have some questions about this property. Could you please provide more information?`
    },
    {
      id: 'application',
      title: 'Application Inquiry',
      content: `Hi ${agentProfile.firstName}, I'm interested in applying for this property. What documents do I need to provide?`
    },
    {
      id: 'custom',
      title: 'Write Custom Message',
      content: ''
    }
  ];

  const handleTemplateSelect = (template: typeof messageTemplates[0]) => {
    setSelectedTemplate(template.id);
    if (template.id === 'custom') {
      setMessage('');
    } else {
      setMessage(template.content);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // In a real app, this would create a conversation and send the message
    console.log('Sending message:', message);

    // Redirect to messages page or the conversation
    router.push('/messages');
  };

  return (
    <div className="px-4 py-6 space-y-6 md:max-w-5xl mx-auto">
      {/* Agent Info */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={agentProfile.profilePicture}
              alt={`${agentProfile.firstName} ${agentProfile.lastName}`}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {agentProfile.firstName} {agentProfile.lastName}
            </h3>
            <p className="text-sm text-gray-600">{agentProfile.company}</p>
            <div className="flex items-center">
              <svg className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs text-gray-500">{agentProfile.rating} ({agentProfile.totalReviews} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Property Context */}
      {property && (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2">About this property</h3>
          <div className="flex items-start space-x-3">
            <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={property.images[0]?.url || '/placeholder-property.jpg'}
                alt={property.title}
                width={64}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">{property.title}</h4>
              <p className="text-xs text-gray-500">{property.location.address}</p>
              <p className="text-sm font-medium text-gray-900">
                {new Intl.NumberFormat('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                  minimumFractionDigits: 0,
                }).format(property.price.amount)}/{property.price.period}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Message Templates */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-3">Quick Templates</h3>
        <div className="space-y-2">
          {messageTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedTemplate === template.id
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:bg-gray-50'
                }`}
            >
              <div className="font-medium text-sm text-gray-900">{template.title}</div>
              {template.content && (
                <div className="text-xs text-gray-600 mt-1 line-clamp-2">{template.content}</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Message Composer */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-3">Your Message</h3>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={selectedTemplate === 'custom' ? 'Type your message here...' : 'Select a template above or write a custom message'}
          rows={6}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-500">
            {message.length}/500 characters
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
        <h3 className="font-medium text-orange-900 mb-2">💡 Tips for messaging agents</h3>
        <ul className="text-sm text-orange-800 space-y-1">
          <li>• Be specific about your requirements and timeline</li>
          <li>• Ask about viewing availability and application process</li>
          <li>• Mention your university and course if relevant</li>
          <li>• Be polite and professional in your communication</li>
        </ul>
      </div>
    </div>
  );
}