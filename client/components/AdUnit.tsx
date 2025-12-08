import React from 'react';
import { useLocation } from 'react-router-dom';

export const AdUnit: React.FC = () => {
  const location = useLocation();
  const protectedRoutes = ['/wallet', '/admin'];

  const shouldHideAds = protectedRoutes.some(route => location.pathname.startsWith(route));

  if (shouldHideAds) {
    return null; 
  }

  return (
    <div className="w-full my-4 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-800/50 flex items-center justify-center h-32 text-gray-400 dark:text-gray-500 select-none">
      <div className="text-center">
        <p className="font-bold">Google Ad Placeholder</p>
        <p className="text-xs">Ads visible here (Hidden on Wallet/Admin pages)</p>
      </div>
    </div>
  );
};