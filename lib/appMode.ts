export type AppMode = 'live' | 'waitlist';

/**
 * Get the current app mode for middleware (Edge Runtime compatible)
 * Uses environment variables and HTTP fetch to avoid Node.js dependencies
 */
export async function getCurrentAppModeForMiddleware(): Promise<AppMode> {
  // Check if we're forcing live mode (development)
  const forceLiveMode = process.env.NEXT_PUBLIC_FORCE_LIVE_MODE === 'true';
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment && forceLiveMode) {
    return 'live';
  }

  // For Edge Runtime, we'll use a simple fallback to environment default
  // The real-time database check will happen in the API route
  const defaultMode = process.env.NEXT_PUBLIC_DEFAULT_APP_MODE as AppMode;
  return defaultMode === 'live' ? 'live' : 'waitlist';
}

/**
 * Get the current app mode for server-side components
 * This version can use Firebase Admin SDK
 */
export async function getCurrentAppMode(): Promise<AppMode> {
  // Check if we're forcing live mode (development)
  const forceLiveMode = process.env.NEXT_PUBLIC_FORCE_LIVE_MODE === 'true';
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment && forceLiveMode) {
    return 'live';
  }

  // Try to get mode from database using API route to avoid Edge Runtime issues
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/app-mode`);
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.mode) {
        return data.mode;
      }
    }
  } catch (error) {
    console.error('Failed to get app mode from API:', error);
  }

  // Fall back to environment default
  const defaultMode = process.env.NEXT_PUBLIC_DEFAULT_APP_MODE as AppMode;
  return defaultMode === 'live' ? 'live' : 'waitlist';
}

/**
 * Client-side helper to check if we're in development with forced live mode
 * This can be used on the client side without async calls
 */
export function isDevelopmentLiveMode(): boolean {
  return (
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_FORCE_LIVE_MODE === 'true'
  );
}