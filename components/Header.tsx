import React from 'react';
import { Activity } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-black text-white p-1.5 rounded-lg">
            <Activity size={20} strokeWidth={2.5} />
          </div>
          <span className="text-lg font-semibold tracking-tight text-gray-900">MarketPulse</span>
        </div>
        <div className="hidden sm:block text-xs font-medium text-gray-500 uppercase tracking-wider">
          Intelligence v1.0
        </div>
      </div>
    </header>
  );
};

export default Header;