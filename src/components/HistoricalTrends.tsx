import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';

// Sample historical data - In a real app, this would come from an API
const historicalData = {
  years: ['2000', '2005', '2010', '2015', '2020', '2023'],
  metrics: {
    inflation: [4.0, 4.2, 10.9, 4.9, 6.2, 5.5],
    gdpGrowth: [4.3, 9.3, 8.5, 8.0, -6.6, 7.2],
    wageGrowth: [3.5, 6.8, 8.2, 6.5, 3.8, 6.0],
    foodInflation: [2.1, 4.2, 10.1, 4.4, 7.7, 4.9],
    housingInflation: [4.5, 3.9, 9.8, 5.2, 3.3, 4.8],
  },
};

const metricColors = {
  inflation: { border: 'rgb(59, 130, 246)', background: 'rgba(59, 130, 246, 0.5)' },
  gdpGrowth: { border: 'rgb(34, 197, 94)', background: 'rgba(34, 197, 94, 0.5)' },
  wageGrowth: { border: 'rgb(249, 115, 22)', background: 'rgba(249, 115, 22, 0.5)' },
  foodInflation: { border: 'rgb(239, 68, 68)', background: 'rgba(239, 68, 68, 0.5)' },
  housingInflation: { border: 'rgb(168, 85, 247)', background: 'rgba(168, 85, 247, 0.5)' },
};

export default function HistoricalTrends() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['inflation', 'gdpGrowth']);

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const chartData = {
    labels: historicalData.years,
    datasets: selectedMetrics.map(metric => ({
      label: metric.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase()),
      data: historicalData.metrics[metric as keyof typeof historicalData.metrics],
      borderColor: metricColors[metric as keyof typeof metricColors].border,
      backgroundColor: metricColors[metric as keyof typeof metricColors].background,
      tension: 0.3,
    })),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Historical Economic Trends',
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `${value}%`,
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card space-y-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Historical Economic Trends
      </h2>

      <div className="flex flex-wrap gap-2">
        {Object.keys(historicalData.metrics).map(metric => (
          <button
            key={metric}
            onClick={() => toggleMetric(metric)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${selectedMetrics.includes(metric)
                ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            {metric.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <div className="h-[400px]">
          <Line options={chartOptions} data={chartData} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedMetrics.map(metric => {
          const values = historicalData.metrics[metric as keyof typeof historicalData.metrics];
          const currentValue = values[values.length - 1];
          const previousValue = values[values.length - 2];
          const change = currentValue - previousValue;
          
          return (
            <div
              key={metric}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {metric.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase())}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentValue}%
              </p>
              <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}% from previous year
              </p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
} 