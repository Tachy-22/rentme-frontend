'use client';

export function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="absolute top-3 left-3 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
}