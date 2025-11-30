import React from 'react';
import { Activity } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  loading?: boolean;
}

const Header: React.FC<HeaderProps> = ({ language, onToggleLanguage, loading = false }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Dynamic Logo Container */}
          <div className={`relative transition-all duration-500 ${
            loading ? 'scale-110' : ''
          }`}>
             {/* Background Glow Effect when loading */}
            {loading && (
              <div className="absolute inset-0 bg-emerald-500 rounded-lg blur opacity-40 animate-pulse"></div>
            )}
            
            {/* Main Logo Box */}
            <div className={`relative p-1.5 rounded-lg transition-colors duration-300 ${
              loading ? 'bg-black shadow-lg shadow-emerald-500/20' : 'bg-black'
            }`}>
              <Activity 
                size={20} 
                strokeWidth={2.5} 
                className={`transition-all duration-300 ${
                  loading ? 'text-emerald-400 animate-pulse' : 'text-white'
                }`} 
              />
            </div>
          </div>
          
          <span className="text-lg font-semibold tracking-tight text-gray-900">
            MarketPulse
          </span>
          
          {/* Status Badge (Optional visual indicator) */}
          {loading && (
             <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 ml-2 animate-fade-in">
               LIVE
             </span>
          )}
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