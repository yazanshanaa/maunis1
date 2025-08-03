import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface RiskMeterProps {
  accountBalance: number;
  positions: Array<{
    symbol: string;
    volume: number;
    openPrice: number;
    currentPrice: number;
    type: 'buy' | 'sell';
  }>;
  theme: 'light' | 'dark';
}

const RiskMeter: React.FC<RiskMeterProps> = ({ accountBalance, positions, theme }) => {
  const [riskPercentage, setRiskPercentage] = useState<number>(0);
  const [riskColor, setRiskColor] = useState<string>('green');

  useEffect(() => {
    calculateRisk();
  }, [accountBalance, positions]);

  const calculateRisk = () => {
    if (!positions || positions.length === 0) {
      setRiskPercentage(0);
      setRiskColor('green');
      return;
    }

    let totalPotentialLoss = 0;

    positions.forEach(position => {
      // Calculate potential loss for each position
      // This is a simplified calculation - in real trading, you'd consider stop loss, margin, etc.
      const priceDifference = Math.abs(position.currentPrice - position.openPrice);
      const positionValue = position.volume * priceDifference;
      
      // Assume maximum potential loss is the position value (worst case scenario)
      totalPotentialLoss += positionValue;
    });

    const riskPercent = (totalPotentialLoss / accountBalance) * 100;
    setRiskPercentage(Math.min(riskPercent, 100)); // Cap at 100%

    // Set color based on risk level
    if (riskPercent <= 2) {
      setRiskColor('green');
    } else if (riskPercent <= 5) {
      setRiskColor('orange');
    } else {
      setRiskColor('red');
    }
  };

  const getRiskIcon = () => {
    if (riskPercentage <= 2) {
      return <TrendingUp className="w-5 h-5 text-green-500" />;
    } else if (riskPercentage <= 5) {
      return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    } else {
      return <TrendingDown className="w-5 h-5 text-red-500" />;
    }
  };

  const getRiskLabel = () => {
    if (riskPercentage <= 2) return 'Low Risk';
    if (riskPercentage <= 5) return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <div className={`p-4 rounded-lg shadow-lg ${
      theme === 'dark' 
        ? 'bg-gray-800 text-white border border-gray-700' 
        : 'bg-white text-gray-900 border border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Risk Meter</h3>
        {getRiskIcon()}
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <div className={`w-full h-3 rounded-full ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div
              className={`h-full rounded-full transition-all duration-500 ease-in-out ${
                riskColor === 'green' 
                  ? 'bg-green-500' 
                  : riskColor === 'orange' 
                  ? 'bg-orange-500' 
                  : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(riskPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs">
            <span>0%</span>
            <span>5%</span>
            <span>10%</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-2xl font-bold ${
            riskColor === 'green' 
              ? 'text-green-500' 
              : riskColor === 'orange' 
              ? 'text-orange-500' 
              : 'text-red-500'
          }`}>
            {riskPercentage.toFixed(1)}%
          </div>
          <div className="text-xs opacity-75">
            {getRiskLabel()}
          </div>
        </div>
      </div>
      
      <div className="mt-3 text-sm opacity-75">
        <div>Account Balance: ${accountBalance.toLocaleString()}</div>
        <div>Active Positions: {positions.length}</div>
      </div>
    </div>
  );
};

export default RiskMeter;

