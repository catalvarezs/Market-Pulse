import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import { NewsCardSkeleton } from './components/Skeleton';
import { fetchMarketAnalysis } from './services/geminiService';
import { Country, Category, FilterState, NewsItem, COUNTRY_LABELS, CATEGORY_LABELS, Sentiment } from './types';
import { Search, AlertCircle, Activity, ChevronDown } from 'lucide-react';

const App: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    country: Country.INT,
    category: Category.BUSINESS
  });
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleAnalyze = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNews([]);
    setHasSearched(true);
    
    try {
      const results = await fetchMarketAnalysis(filters.country, filters.category);
      setNews(results);
    } catch (err) {
      setError("No se pudieron obtener los datos del mercado. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, country: e.target.value as Country }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, category: e.target.value as Category }));
  };

  // Filter lists for display
  const opportunities = news.filter(item => item.sentiment === Sentiment.POSITIVE || item.sentiment === Sentiment.NEUTRAL);
  const risks = news.filter(item => item.sentiment === Sentiment.NEGATIVE);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Controls Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-5 items-end">
            
            <div className="flex flex-col sm:flex-row gap-5 w-full md:w-auto flex-grow">
              {/* Country Select */}
              <div className="w-full sm:w-1/2 md:w-64">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block pl-1">Región</label>
                <div className="relative group">
                  <select 
                    value={filters.country}
                    onChange={handleCountryChange}
                    className="w-full appearance-none bg-white border border-gray-200 text-gray-900 text-sm font-medium rounded-xl focus:ring-2 focus:ring-black focus:border-transparent block py-3 pl-4 pr-10 cursor-pointer shadow-sm hover:border-gray-300 transition-all"
                  >
                    {Object.entries(COUNTRY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" />
                </div>
              </div>

              {/* Category Select */}
              <div className="w-full sm:w-1/2 md:w-64">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block pl-1">Tema</label>
                <div className="relative group">
                  <select 
                    value={filters.category}
                    onChange={handleCategoryChange}
                    className="w-full appearance-none bg-white border border-gray-200 text-gray-900 text-sm font-medium rounded-xl focus:ring-2 focus:ring-black focus:border-transparent block py-3 pl-4 pr-10 cursor-pointer shadow-sm hover:border-gray-300 transition-all"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
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
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-medium rounded-xl text-sm px-8 py-3.5 transition-all shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-70 disabled:cursor-not-allowed h-[46px]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analizando...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Analizar
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
              <h2 className="text-lg font-semibold text-gray-900">Oportunidades / Neutral</h2>
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
                 <div className="text-center py-10 text-gray-400 text-sm">No se detectaron oportunidades claras.</div>
              )}
            </div>
          </div>

          {/* Risks Column */}
          <div>
             <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200">
              <div className="h-2 w-2 rounded-full bg-rose-500"></div>
              <h2 className="text-lg font-semibold text-gray-900">Riesgos / Negativo</h2>
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
                 <div className="text-center py-10 text-gray-400 text-sm">No se detectaron riesgos críticos.</div>
              )}
            </div>
          </div>

        </div>
        
        {!hasSearched && !loading && (
            <div className="mt-20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Activity size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Esperando análisis</h3>
                <p className="text-gray-500 max-w-sm mx-auto">Selecciona una región y un tema para generar inteligencia de mercado en tiempo real.</p>
            </div>
        )}

      </main>
    </div>
  );
};

export default App;