'use client';

import { useState, useRef } from 'react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
}

export function MessageInput({ value, onChange, onSend, placeholder = 'Type a message...' }: MessageInputProps) {
  const [showAttachments, setShowAttachments] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      {/* Attachment Options */}
      {showAttachments && (
        <div className="mb-3 flex space-x-3">
          <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Photo</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Document</span>
          </button>
        </div>
      )}

      {/* Message Input Area */}
      <div className="flex items-end space-x-3">
        {/* Attachment Button */}
        <button
          onClick={() => setShowAttachments(!showAttachments)}
          className={`p-2 rounded-lg transition-colors flex-shrink-0 ${showAttachments ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:bg-gray-100'
            }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            rows={1}
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 max-h-32"
            style={{ minHeight: '44px' }}
          />
        </div>

        {/* Send Button */}
        <button
          onClick={onSend}
          disabled={!value.trim()}
          className={`p-2 rounded-full transition-colors flex-shrink-0 ${value.trim()
              ? 'bg-orange-600 text-white hover:bg-orange-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="mt-2 flex space-x-2">
        <button
          onClick={() => onChange("I'm interested in this property. When can I schedule a viewing?")}
          className="text-xs text-orange-600 hover:text-orange-700 bg-orange-50 px-2 py-1 rounded-full"
        >
          Request Viewing
        </button>
        <button
          onClick={() => onChange("Could you provide more details about the amenities?")}
          className="text-xs text-orange-600 hover:text-orange-700 bg-orange-50 px-2 py-1 rounded-full"
        >
          Ask About Amenities
        </button>
        <button
          onClick={() => onChange("What documents do I need for the application?")}
          className="text-xs text-orange-600 hover:text-orange-700 bg-orange-50 px-2 py-1 rounded-full"
        >
          Application Info
        </button>
      </div>
    </div>
  );
}