import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';

interface MarketPulseMiniProps {
  symbol: string;
  theme: 'light' | 'dark';
}

interface NewsData {
  title: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  description?: string;
  url?: string;
  publishedAt?: string;
}

const MarketPulseMini: React.FC<MarketPulseMiniProps> = ({ symbol, theme }) => {
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (symbol) {
      fetchNews();
    }
  }, [symbol]);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/news-sentiment?symbol=${symbol}&count=1`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      
      const data = await response.json();
      setNewsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentIcon = () => {
    if (!newsData) return <Minus className="w-4 h-4" />;
    
    switch (newsData.sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSentimentColor = () => {
    if (!newsData) return 'bg-gray-500';
    
    switch (newsData.sentiment) {
      case 'positive':
        return 'bg-green-500';
      case 'negative':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const truncateTitle = (title: string, maxLength: number = 60) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  return (
    <div className={`w-full px-4 py-2 border-b ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700 text-white' 
        : 'bg-white border-gray-200 text-gray-900'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Sentiment Indicator */}
          <div className={`w-3 h-3 rounded-full ${getSentimentColor()} flex-shrink-0`} />
          
          {/* Symbol */}
          <span className="font-semibold text-sm flex-shrink-0">{symbol}</span>
          
          {/* News Title */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm opacity-75">Loading news...</span>
              </div>
            ) : error ? (
              <span className="text-sm text-red-500">Error loading news</span>
            ) : newsData ? (
              <div className="flex items-center space-x-2">
                {getSentimentIcon()}
                <span className="text-sm truncate" title={newsData.title}>
                  {truncateTitle(newsData.title)}
                </span>
              </div>
            ) : (
              <span className="text-sm opacity-75">No news available</span>
            )}
          </div>
        </div>
        
        {/* Refresh Button */}
        <button
          onClick={fetchNews}
          disabled={loading}
          className={`p-1 rounded hover:bg-opacity-75 transition-colors ${
            theme === 'dark' 
              ? 'hover:bg-gray-700' 
              : 'hover:bg-gray-100'
          }`}
          title="Refresh news"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {/* Additional Info on Hover/Click */}
      {newsData && newsData.description && (
        <div className="mt-1">
          <p className="text-xs opacity-75 line-clamp-2" title={newsData.description}>
            {newsData.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default MarketPulseMini;

