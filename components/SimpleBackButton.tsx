'use client';

export function SimpleBackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="p-2 -ml-2 mr-2 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
}