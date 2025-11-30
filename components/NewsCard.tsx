import React from 'react';
import { NewsItem, Sentiment } from '../types';
import { TrendingUp, TrendingDown, Minus, ExternalLink, AlertTriangle } from 'lucide-react';

interface NewsCardProps {
  item: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
  const isPositive = item.sentiment === Sentiment.POSITIVE;
  const isNegative = item.sentiment === Sentiment.NEGATIVE;

  return (
    <div className="group relative bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center justify-center p-1 rounded-md ${
            isPositive ? 'bg-emerald-50 text-emerald-600' :
            isNegative ? 'bg-rose-50 text-rose-600' :
            'bg-gray-100 text-gray-500'
          }`}>
            {isPositive && <TrendingUp size={16} />}
            {isNegative && <TrendingDown size={16} />}
            {!isPositive && !isNegative && <Minus size={16} />}
          </span>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {item.source}
          </span>
        </div>
        
        {/* Risk Score Indicator */}
        <div className="flex items-center gap-1" title="Puntaje de Riesgo (1-10)">
            <AlertTriangle size={12} className={item.risk_score > 6 ? 'text-orange-500' : 'text-gray-300'} />
            <span className={`text-xs font-bold ${
                item.risk_score > 7 ? 'text-rose-600' : 
                item.risk_score > 4 ? 'text-orange-500' : 'text-gray-400'
            }`}>
                {item.risk_score}/10
            </span>
        </div>
      </div>

      <h3 className="text-gray-900 font-semibold text-lg leading-snug mb-2 group-hover:text-black transition-colors">
        {item.title}
      </h3>
      
      <p className="text-gray-600 text-sm leading-relaxed mb-4">
        {item.summary}
      </p>

      {item.url && (
        <a 
          href={item.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-xs font-medium text-gray-400 hover:text-gray-900 transition-colors mt-auto"
        >
          Leer fuente original <ExternalLink size={10} className="ml-1" />
        </a>
      )}
    </div>
  );
};

export default NewsCard;