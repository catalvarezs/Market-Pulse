import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import { NewsCardSkeleton } from './components/Skeleton';
import { fetchMarketAnalysis } from './services/geminiService';
import { Country, Category, TimeRange, FilterState, NewsItem, COUNTRY_LABELS, CATEGORY_LABELS, TIME_RANGE_LABELS, Sentiment, Language, UI_TEXT } from './types';
import { Search, AlertCircle, Activity, ChevronDown } from 'lucide-react';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('es');
  const [filters, setFilters] = useState<FilterState>({
    country: Country.INT,
    category: Category.BUSINESS,
    timeRange: TimeRange.LAST_7D
  });
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const t = UI_TEXT[language];

  const handleToggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  const handleAnalyze = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNews([]);
    setHasSearched(true);
    
    try {
      const results = await fetchMarketAnalysis(filters.country, filters.category, filters.timeRange, language);
      setNews(results);
    } catch (err) {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  }, [filters, language, t.error]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, country: e.target.value as Country }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, category: e.target.value as Category }));
  };

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, timeRange: e.target.value as TimeRange }));
  };

  // Filter lists for display
  const opportunities = news.filter(item => item.sentiment === Sentiment.POSITIVE || item.sentiment === Sentiment.NEUTRAL);
  const risks = news.filter(item => item.sentiment === Sentiment.NEGATIVE);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 pb-10 flex flex-col">
      <Header language={language} onToggleLanguage={handleToggleLanguage} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        
        {/* Controls Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-8 shadow-sm">
          <div className="flex flex-col xl:flex-row gap-5 items-end">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full flex-grow">
              {/* Country Select */}
              <div className="w-full">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block pl-1">{t.region}</label>
                <div className="relative group">
                  <select 
                    value={filters.country}
                    onChange={handleCountryChange}
                    className="w-full appearance-none bg-white border border-gray-200 text-gray-900 text-sm font-medium rounded-xl focus:ring-2 focus:ring-black focus:border-transparent block py-3 pl-4 pr-10 cursor-pointer shadow-sm hover:border-gray-300 transition-all"
                  >
                    {Object.entries(COUNTRY_LABELS[language]).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" />
                </div>
              </div>

              {/* Category Select */}
              <div className="w-full">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block pl-1">{t.topic}</label>
                <div className="relative group">
                  <select 
                    value={filters.category}
                    onChange={handleCategoryChange}
                    className="w-full appearance-none bg-white border border-gray-200 text-gray-900 text-sm font-medium rounded-xl focus:ring-2 focus:ring-black focus:border-transparent block py-3 pl-4 pr-10 cursor-pointer shadow-sm hover:border-gray-300 transition-all"
                  >
                    {Object.entries(CATEGORY_LABELS[language]).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" />
                </div>
              </div>

              {/* Time Range Select */}
              <div className="w-full">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block pl-1">{t.period}</label>
                <div className="relative group">
                  <select 
                    value={filters.timeRange}
                    onChange={handleTimeRangeChange}
                    className="w-full appearance-none bg-white border border-gray-200 text-gray-900 text-sm font-medium rounded-xl focus:ring-2 focus:ring-black focus:border-transparent block py-3 pl-4 pr-10 cursor-pointer shadow-sm hover:border-gray-300 transition-all"
                  >
                    {Object.entries(TIME_RANGE_LABELS[language]).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" />
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button 
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full xl:w-auto min-w-[160px] flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-medium rounded-xl text-sm px-8 py-3.5 transition-all shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-70 disabled:cursor-not-allowed h-[46px]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t.analyzing}
                </>
              ) : (
                <>
                  <Search size={18} />
                  {t.analyzeButton}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Opportunities Column */}
          <div>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <h2 className="text-lg font-semibold text-gray-900">{t.opportunities}</h2>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full ml-auto">
                {loading ? '...' : opportunities.length}
              </span>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <>
                  <NewsCardSkeleton />
                  <NewsCardSkeleton />
                  <NewsCardSkeleton />
                </>
              ) : (
                opportunities.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))
              )}
              {!loading && hasSearched && opportunities.length === 0 && !error && (
                 <div className="text-center py-10 text-gray-400 text-sm">{t.noOpportunities}</div>
              )}
            </div>
          </div>

          {/* Risks Column */}
          <div>
             <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200">
              <div className="h-2 w-2 rounded-full bg-rose-500"></div>
              <h2 className="text-lg font-semibold text-gray-900">{t.risks}</h2>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full ml-auto">
                {loading ? '...' : risks.length}
              </span>
            </div>

            <div className="space-y-4">
              {loading ? (
                <>
                  <NewsCardSkeleton />
                  <NewsCardSkeleton />
                  <NewsCardSkeleton />
                </>
              ) : (
                risks.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))
              )}
              {!loading && hasSearched && risks.length === 0 && !error && (
                 <div className="text-center py-10 text-gray-400 text-sm">{t.noRisks}</div>
              )}
            </div>
          </div>

        </div>
        
        {!hasSearched && !loading && (
            <div className="mt-20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Activity size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t.waitingTitle}</h3>
                <p className="text-gray-500 max-w-sm mx-auto">{t.waitingDesc}</p>
            </div>
        )}

      </main>

      <footer className="w-full py-4 text-center mt-auto">
        <a 
          href="https://github.com/catalvarezs" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] text-gray-300 hover:text-gray-500 transition-colors uppercase tracking-widest font-medium"
        >
          Catalina
        </a>
      </footer>
    </div>
  );
};

export default App;