import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ADSENSE_SCRIPT_ID = 'adsense-script';

const CONTENT_ROUTE_ALLOWLIST = ['/', '/faq', '/terms', '/privacy', '/contact'];

const normalizePath = (pathname: string) => {
  const trimmed = pathname.trim();
  if (!trimmed) return '/';
  const withoutTrailing = trimmed.replace(/\/+$/g, '');
  return withoutTrailing === '' ? '/' : withoutTrailing;
};

const isAllowedRoute = (pathname: string) => {
  const normalized = normalizePath(pathname);
  return CONTENT_ROUTE_ALLOWLIST.includes(normalized);
};

export const AdSenseScript: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (!isAllowedRoute(location.pathname)) return;

    const clientId =
      (import.meta as any).env?.VITE_ADSENSE_CLIENT || 'ca-pub-6858186841946082';

    if (!clientId || typeof clientId !== 'string') return;

    // Prevent global AdSense on non-content screens:
    // only inject the script when we are on a contentful, public route.
    const existing = document.getElementById(ADSENSE_SCRIPT_ID);
    if (existing) return;

    const script = document.createElement('script');
    script.id = ADSENSE_SCRIPT_ID;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`;

    document.head.appendChild(script);
  }, [location.pathname]);

  return null;
};
