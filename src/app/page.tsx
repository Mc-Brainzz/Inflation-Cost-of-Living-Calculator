'use client';

import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';
import CostOfLivingComparison from '@/components/CostOfLivingComparison';
import InvestmentCalculator from '@/components/InvestmentCalculator';
import HistoricalTrends from '@/components/HistoricalTrends';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Sample data - In a real app, this would come from an API
const inflationData = {
  labels: ['2000', '2005', '2010', '2015', '2020', '2023'],
  datasets: [
    {
      label: 'Inflation Rate (%)',
      data: [4.0, 4.2, 5.9, 4.9, 6.2, 5.5],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Historical Inflation Rates',
    },
  },
};

export default function Home() {
  const [amount, setAmount] = useState('100');
  const [fromYear, setFromYear] = useState('2000');
  const [toYear, setToYear] = useState('2023');
  const [result, setResult] = useState<number | null>(null);

  const calculateInflation = () => {
    // This is a simplified calculation. In a real app, you would use actual inflation data
    const inflationRate = 0.05; // 5% average inflation rate
    const years = parseInt(toYear) - parseInt(fromYear);
    const calculatedAmount = parseFloat(amount) * Math.pow(1 + inflationRate, years);
    setResult(calculatedAmount);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Inflation Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Calculate how much your money would be worth in today's terms
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Amount (₹)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input mt-1"
            />
          </div>
          
          <div>
            <label htmlFor="fromYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              From Year
            </label>
            <input
              type="number"
              id="fromYear"
              value={fromYear}
              onChange={(e) => setFromYear(e.target.value)}
              min="1900"
              max="2023"
              className="input mt-1"
            />
          </div>
          
          <div>
            <label htmlFor="toYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              To Year
            </label>
            <input
              type="number"
              id="toYear"
              value={toYear}
              onChange={(e) => setToYear(e.target.value)}
              min="1900"
              max="2023"
              className="input mt-1"
            />
          </div>
        </div>

        <button
          onClick={calculateInflation}
          className="button mt-6"
        >
          Calculate
        </button>

        {result !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 bg-primary-50 dark:bg-primary-900 rounded-lg"
          >
            <p className="text-lg font-semibold text-primary-900 dark:text-primary-100">
              ₹{amount} in {fromYear} is worth approximately ₹{result.toFixed(2)} in {toYear}
            </p>
          </motion.div>
        )}
      </motion.div>

      <HistoricalTrends />
      <InvestmentCalculator />
      <CostOfLivingComparison />
    </div>
  );
} 