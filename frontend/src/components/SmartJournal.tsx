import React, { useState, useEffect } from 'react';
import { PlusCircle, BookOpen, BarChart3, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Trade {
  id: string;
  symbol: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  result: 'profit' | 'loss' | 'breakeven';
  timestamp: number;
  notes?: string;
}

interface SmartJournalProps {
  theme: 'light' | 'dark';
  isOpen: boolean;
  onClose: () => void;
}

const SmartJournal: React.FC<SmartJournalProps> = ({ theme, isOpen, onClose }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [showAddTrade, setShowAddTrade] = useState(false);
  const [newTrade, setNewTrade] = useState({
    symbol: '',
    sentiment: 'neutral' as 'positive' | 'negative' | 'neutral',
    result: 'breakeven' as 'profit' | 'loss' | 'breakeven',
    notes: ''
  });

  useEffect(() => {
    loadTrades();
  }, []);

  const loadTrades = async () => {
    try {
      // Load from IndexedDB
      const request = indexedDB.open('SynapseTradeJournal', 1);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('trades')) {
          db.createObjectStore('trades', { keyPath: 'id' });
        }
      };
      
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['trades'], 'readonly');
        const store = transaction.objectStore('trades');
        const getAllRequest = store.getAll();
        
        getAllRequest.onsuccess = () => {
          setTrades(getAllRequest.result || []);
        };
      };
    } catch (error) {
      console.error('Error loading trades:', error);
    }
  };

  const saveTrade = async (trade: Trade) => {
    try {
      const request = indexedDB.open('SynapseTradeJournal', 1);
      
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['trades'], 'readwrite');
        const store = transaction.objectStore('trades');
        store.add(trade);
        
        transaction.oncomplete = () => {
          setTrades(prev => [...prev, trade]);
        };
      };
    } catch (error) {
      console.error('Error saving trade:', error);
    }
  };

  const handleAddTrade = () => {
    if (!newTrade.symbol) return;
    
    const trade: Trade = {
      id: Date.now().toString(),
      symbol: newTrade.symbol.toUpperCase(),
      sentiment: newTrade.sentiment,
      result: newTrade.result,
      timestamp: Date.now(),
      notes: newTrade.notes
    };
    
    saveTrade(trade);
    setNewTrade({ symbol: '', sentiment: 'neutral', result: 'breakeven', notes: '' });
    setShowAddTrade(false);
  };

  const getStatistics = () => {
    const sentimentCounts = trades.reduce((acc, trade) => {
      acc[trade.sentiment] = (acc[trade.sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const resultCounts = trades.reduce((acc, trade) => {
      acc[trade.result] = (acc[trade.result] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: trades.length,
      sentimentData: [
        { name: 'Positive', value: sentimentCounts.positive || 0, fill: '#10b981' },
        { name: 'Neutral', value: sentimentCounts.neutral || 0, fill: '#6b7280' },
        { name: 'Negative', value: sentimentCounts.negative || 0, fill: '#ef4444' }
      ],
      resultData: [
        { name: 'Profit', value: resultCounts.profit || 0, fill: '#10b981' },
        { name: 'Breakeven', value: resultCounts.breakeven || 0, fill: '#6b7280' },
        { name: 'Loss', value: resultCounts.loss || 0, fill: '#ef4444' }
      ]
    };
  };

  const stats = getStatistics();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`w-full max-w-4xl h-5/6 rounded-lg shadow-xl ${
        theme === 'dark' 
          ? 'bg-gray-800 text-white' 
          : 'bg-white text-gray-900'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Smart Trading Journal</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="p-6 h-full overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Statistics */}
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Sentiment Analysis
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.sentimentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Trade Results
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.resultData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Add Trade Form */}
          {showAddTrade && (
            <div className={`p-4 rounded-lg mb-6 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <h3 className="text-lg font-semibold mb-4">Add New Trade</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Symbol (e.g., EURUSD)"
                  value={newTrade.symbol}
                  onChange={(e) => setNewTrade(prev => ({ ...prev, symbol: e.target.value }))}
                  className={`p-2 rounded border ${
                    theme === 'dark' 
                      ? 'bg-gray-600 border-gray-500 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                />
                <select
                  value={newTrade.sentiment}
                  onChange={(e) => setNewTrade(prev => ({ ...prev, sentiment: e.target.value as any }))}
                  className={`p-2 rounded border ${
                    theme === 'dark' 
                      ? 'bg-gray-600 border-gray-500 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="positive">Positive Sentiment</option>
                  <option value="neutral">Neutral Sentiment</option>
                  <option value="negative">Negative Sentiment</option>
                </select>
                <select
                  value={newTrade.result}
                  onChange={(e) => setNewTrade(prev => ({ ...prev, result: e.target.value as any }))}
                  className={`p-2 rounded border ${
                    theme === 'dark' 
                      ? 'bg-gray-600 border-gray-500 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="profit">Profit</option>
                  <option value="breakeven">Breakeven</option>
                  <option value="loss">Loss</option>
                </select>
                <input
                  type="text"
                  placeholder="Notes (optional)"
                  value={newTrade.notes}
                  onChange={(e) => setNewTrade(prev => ({ ...prev, notes: e.target.value }))}
                  className={`p-2 rounded border ${
                    theme === 'dark' 
                      ? 'bg-gray-600 border-gray-500 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={handleAddTrade}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save Trade
                </button>
                <button
                  onClick={() => setShowAddTrade(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Add Trade Button */}
          {!showAddTrade && (
            <button
              onClick={() => setShowAddTrade(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mb-6"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add Trade</span>
            </button>
          )}

          {/* Trade History */}
          <div className={`rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <h3 className="text-lg font-semibold p-4 border-b border-gray-200 dark:border-gray-600 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Trade History ({stats.total} trades)
            </h3>
            <div className="max-h-64 overflow-y-auto">
              {trades.length === 0 ? (
                <p className="p-4 text-gray-500">No trades recorded yet.</p>
              ) : (
                trades.map(trade => (
                  <div key={trade.id} className="p-4 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{trade.symbol}</div>
                        <div className="text-sm opacity-75">
                          {new Date(trade.timestamp).toLocaleDateString()}
                        </div>
                        {trade.notes && (
                          <div className="text-sm mt-1 opacity-75">{trade.notes}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className={`px-2 py-1 rounded text-xs ${
                          trade.sentiment === 'positive' 
                            ? 'bg-green-100 text-green-800' 
                            : trade.sentiment === 'negative' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {trade.sentiment}
                        </div>
                        <div className={`px-2 py-1 rounded text-xs mt-1 ${
                          trade.result === 'profit' 
                            ? 'bg-green-100 text-green-800' 
                            : trade.result === 'loss' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {trade.result}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartJournal;

