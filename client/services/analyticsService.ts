// Google Analytics (gtag.js) helper for the Vite SPA

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const trackPageView = (pagePath: string, pageTitle?: string): void => {
  if (typeof window === 'undefined') return;
  if (!window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  });
};

export const trackEvent = (eventName: string, params?: Record<string, unknown>): void => {
  if (typeof window === 'undefined') return;
  if (!window.gtag) return;

  window.gtag('event', eventName, params ?? {});
};
