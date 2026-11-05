/**
 * Global in-memory state tracking for initial application splash screen.
 * - Resets on hard refresh (F5 / Ctrl+R) or initial cold visit because module scripts re-evaluate.
 * - Persists across all client-side SPA navigations (<Link> / router.push).
 */

let hasSplashLoaded = false;

export function hasAppLoaded(): boolean {
  return hasSplashLoaded;
}

export function markAppLoaded(): void {
  hasSplashLoaded = true;
}

export function resetAppLoaded(): void {
  hasSplashLoaded = false;
}

