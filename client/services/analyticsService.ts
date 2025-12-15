// Google Analytics (gtag.js) helper for the Vite SPA

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __bharatRewardsGtagInitialized?: boolean;
  }
}

const GTAG_SRC_PREFIX = 'https://www.googletagmanager.com/gtag/js?id=';

const ensureGtagScript = (measurementId: string): void => {
  const src = `${GTAG_SRC_PREFIX}${encodeURIComponent(measurementId)}`;
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
  if (existing) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
};

export const initGoogleAnalytics = (measurementId?: string): void => {
  if (!measurementId) return;
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.__bharatRewardsGtagInitialized) return;

  window.__bharatRewardsGtagInitialized = true;

  ensureGtagScript(measurementId);

  window.dataLayer = window.dataLayer || [];
  const gtag = window.gtag || function gtagShim(...args: unknown[]) {
    window.dataLayer?.push(args);
  };

  window.gtag = gtag;

  // Disable automatic page_view; SPA navigation is tracked manually.
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: false });
};

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
