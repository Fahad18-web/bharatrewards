import React, { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const CONTENT_ROUTE_ALLOWLIST = ['/', '/faq', '/terms', '/privacy', '/contact'];

const normalizePath = (pathname: string) => {
  const trimmed = pathname.trim();
  if (!trimmed) return '/';
  const withoutTrailing = trimmed.replace(/\/+$/g, '');
  return withoutTrailing === '' ? '/' : withoutTrailing;
};

export const AdUnit: React.FC = () => {
  const location = useLocation();
  const pushedRef = useRef(false);

  const isAllowedRoute = useMemo(() => {
    const normalized = normalizePath(location.pathname);
    return CONTENT_ROUTE_ALLOWLIST.includes(normalized);
  }, [location.pathname]);

  const clientId = (import.meta as any).env?.VITE_ADSENSE_CLIENT || 'ca-pub-6858186841946082';
  const slot = (import.meta as any).env?.VITE_ADSENSE_SLOT;

  if (!isAllowedRoute || !clientId || !slot) return null;

  useEffect(() => {
    if (pushedRef.current) return;
    pushedRef.current = true;

    try {
      (window.adsbygoogle = (window.adsbygoogle || []) as unknown[]).push({});
    } catch {
      // no-op; AdSense script may not be ready yet
    }
  }, []);

  return (
    <div className="w-full my-6 flex justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};