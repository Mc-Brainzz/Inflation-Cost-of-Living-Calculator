import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';

type InvestmentData = {
  year: number;
  nominal: number;
  real: number;
};

export default function InvestmentCalculator() {
  const [initialAmount, setInitialAmount] = useState('100000');
  const [monthlyContribution, setMonthlyContribution] = useState('10000');
  const [years, setYears] = useState('10');
  const [returnRate, setReturnRate] = useState('12');
  const [inflationRate, setInflationRate] = useState('6');
  const [investmentData, setInvestmentData] = useState<InvestmentData[]>([]);

  useEffect(() => {
    calculateInvestment();
  }, [initialAmount, monthlyContribution, years, returnRate, inflationRate]);

  const calculateInvestment = () => {
    const data: InvestmentData[] = [];
    const initial = parseFloat(initialAmount);
    const monthly = parseFloat(monthlyContribution);
    const period = parseInt(years);
    const return_rate = parseFloat(returnRate) / 100;
    const inflation = parseFloat(inflationRate) / 100;

    let nominalValue = initial;
    let realValue = initial;

    for (let year = 0; year <= period; year++) {
      data.push({
        year,
        nominal: nominalValue,
        real: realValue,
      });

      // Calculate next year's values
      nominalValue = (nominalValue + monthly * 12) * (1 + return_rate);
      realValue = (realValue + monthly * 12) * (1 + (return_rate - inflation));
    }

    setInvestmentData(data);
  };

  const chartData = {
    labels: investmentData.map(d => `Year ${d.year}`),
    datasets: [
      {
        label: 'Nominal Value',
        data: investmentData.map(d => d.nominal),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Real Value (Inflation Adjusted)',
        data: investmentData.map(d => d.real),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
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
        text: 'Investment Growth Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(this: any, tickValue: number | string) {
            return `₹${(Number(tickValue) / 100000).toFixed(1)}L`;
          },
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card space-y-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Investment Growth Calculator
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Initial Amount (₹)
          </label>
          <input
            type="number"
            value={initialAmount}
            onChange={(e) => setInitialAmount(e.target.value)}
            className="input mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Monthly Contribution (₹)
          </label>
          <input
            type="number"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(e.target.value)}
            className="input mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Investment Period (Years)
          </label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            min="1"
            max="50"
            className="input mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Expected Return Rate (%)
          </label>
          <input
            type="number"
            value={returnRate}
            onChange={(e) => setReturnRate(e.target.value)}
            step="0.1"
            className="input mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Expected Inflation Rate (%)
          </label>
          <input
            type="number"
            value={inflationRate}
            onChange={(e) => setInflationRate(e.target.value)}
            step="0.1"
            className="input mt-1"
          />
        </div>
      </div>

      <div className="mt-6">
        <div className="h-[400px]">
          <Line options={chartOptions} data={chartData} />
        </div>
      </div>

      {investmentData.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-primary-50 dark:bg-primary-900/50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Final Nominal Value
            </h3>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              ₹{investmentData[investmentData.length - 1].nominal.toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Final Real Value
            </h3>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              ₹{investmentData[investmentData.length - 1].real.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
} 