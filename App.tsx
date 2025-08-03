import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import RiskMeter from './components/RiskMeter';
import SmartJournal from './components/SmartJournal';
import MarketPulseMini from './components/MarketPulseMini';
import ShareMyStats from './components/ShareMyStats';
import { BookOpen, BarChart3, Calendar, Settings } from 'lucide-react';
import './i18n';

interface Position {
  symbol: string;
  volume: number;
  openPrice: number;
  currentPrice: number;
  type: 'buy' | 'sell';
}

function App() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentSymbol, setCurrentSymbol] = useState('EURUSD');
  const [accountBalance, setAccountBalance] = useState(10000);
  const [positions, setPositions] = useState<Position[]>([
    {
      symbol: 'EURUSD',
      volume: 0.1,
      openPrice: 1.0850,
      currentPrice: 1.0865,
      type: 'buy'
    },
    {
      symbol: 'GBPUSD',
      volume: 0.05,
      openPrice: 1.2650,
      currentPrice: 1.2640,
      type: 'sell'
    }
  ]);
  
  const [showJournal, setShowJournal] = useState(false);
  const [activeTab, setActiveTab] = useState<'analytics' | 'history' | 'share'>('analytics');

  // Mock weekly data for ShareMyStats
  const weeklyData = {
    totalTrades: 15,
    profitableTrades: 9,
    totalProfit: 450.75,
    winRate: 60,
    topSymbol: 'EURUSD',
    dominantSentiment: 'positive'
  };

  useEffect(() => {
    // Detect system theme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mediaQuery.matches ? 'dark' : 'light');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPositions(prev => prev.map(pos => ({
        ...pos,
        currentPrice: pos.currentPrice + (Math.random() - 0.5) * 0.001
      })));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Market Pulse Mini - Top Bar */}
      <MarketPulseMini symbol={currentSymbol} theme={theme} />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Risk Meter */}
          <div className="lg:col-span-1">
            <RiskMeter 
              accountBalance={accountBalance}
              positions={positions}
              theme={theme}
            />
          </div>
          
          {/* Middle Column - Chart Placeholder */}
          <div className="lg:col-span-1">
            <div className={`p-6 rounded-lg shadow-lg h-64 flex items-center justify-center ${
              theme === 'dark' 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}>
              <div className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-semibold">Trading Chart</p>
                <p className="text-sm opacity-75">cTrader native chart integration</p>
              </div>
            </div>
          </div>
          
          {/* Right Column - Controls */}
          <div className="lg:col-span-1 space-y-4">
            {/* Symbol Selector */}
            <div className={`p-4 rounded-lg shadow-lg ${
              theme === 'dark' 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}>
              <label className="block text-sm font-medium mb-2">Current Symbol</label>
              <select
                value={currentSymbol}
                onChange={(e) => setCurrentSymbol(e.target.value)}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="EURUSD">EUR/USD</option>
                <option value="GBPUSD">GBP/USD</option>
                <option value="USDJPY">USD/JPY</option>
                <option value="AUDUSD">AUD/USD</option>
                <option value="USDCAD">USD/CAD</option>
              </select>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => setShowJournal(true)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                <span>Open Smart Journal</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Tabs */}
        <div className="mt-8">
          <div className="flex space-x-1 mb-4">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📊 Analytics
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📅 History
            </button>
            <button
              onClick={() => setActiveTab('share')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'share'
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📤 Share
            </button>
          </div>
          
          <div className={`p-6 rounded-lg shadow-lg ${
            theme === 'dark' 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}>
            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Performance Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <div className="text-2xl font-bold text-green-500">+$450.75</div>
                    <div className="text-sm opacity-75">This Week</div>
                  </div>
                  <div className={`p-4 rounded ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <div className="text-2xl font-bold text-blue-500">60%</div>
                    <div className="text-sm opacity-75">Win Rate</div>
                  </div>
                  <div className={`p-4 rounded ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <div className="text-2xl font-bold text-purple-500">15</div>
                    <div className="text-sm opacity-75">Total Trades</div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'history' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Trade History</h3>
                <p className="opacity-75">Recent trades will appear here. Use the Smart Journal to track your trading decisions and outcomes.</p>
              </div>
            )}
            
            {activeTab === 'share' && (
              <ShareMyStats theme={theme} weeklyData={weeklyData} />
            )}
          </div>
        </div>
      </div>
      
      {/* Smart Journal Modal */}
      <SmartJournal 
        theme={theme}
        isOpen={showJournal}
        onClose={() => setShowJournal(false)}
      />
    </div>
  );
}

export default App;
