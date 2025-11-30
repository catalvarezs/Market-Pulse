import React from 'react';
import { Activity } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
}

const Header: React.FC<HeaderProps> = ({ language, onToggleLanguage }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-black text-white p-1.5 rounded-lg">
            <Activity size={20} strokeWidth={2.5} />
          </div>
          <span className="text-lg font-semibold tracking-tight text-gray-900">MarketPulse</span>
        </div>
        
        <button 
          onClick={onToggleLanguage}
          className="text-xs font-semibold tracking-wider px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600"
        >
          <span className={language === 'es' ? 'text-black' : 'text-gray-400'}>ES</span>
          <span className="mx-1 text-gray-300">|</span>
          <span className={language === 'en' ? 'text-black' : 'text-gray-400'}>EN</span>
        </button>
      </div>
    </header>
  );
};

export default Header;