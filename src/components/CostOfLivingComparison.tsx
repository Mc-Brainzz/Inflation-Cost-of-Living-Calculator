import { useState } from 'react';
import { motion } from 'framer-motion';

// Sample data - In a real app, this would come from an API
const citiesData = {
  'Mumbai': { 
    costIndex: 100,
    rent: { '1bhk': 25000, '2bhk': 45000, '3bhk': 75000 },
    expenses: {
      groceries: 10000,
      transport: 3000,
      utilities: 2500,
      entertainment: 5000,
    }
  },
  'Delhi': { 
    costIndex: 85,
    rent: { '1bhk': 20000, '2bhk': 35000, '3bhk': 60000 },
    expenses: {
      groceries: 9000,
      transport: 2500,
      utilities: 2000,
      entertainment: 4500,
    }
  },
  'Bangalore': { 
    costIndex: 95,
    rent: { '1bhk': 22000, '2bhk': 40000, '3bhk': 65000 },
    expenses: {
      groceries: 9500,
      transport: 3000,
      utilities: 2200,
      entertainment: 5000,
    }
  },
  'Chennai': { 
    costIndex: 80,
    rent: { '1bhk': 18000, '2bhk': 32000, '3bhk': 55000 },
    expenses: {
      groceries: 8500,
      transport: 2000,
      utilities: 2000,
      entertainment: 4000,
    }
  },
};

export default function CostOfLivingComparison() {
  const [sourceCity, setSourceCity] = useState('Mumbai');
  const [targetCity, setTargetCity] = useState('Bangalore');
  const [salary, setSalary] = useState('100000');

  const calculateEquivalentSalary = () => {
    const sourceCostIndex = citiesData[sourceCity as keyof typeof citiesData].costIndex;
    const targetCostIndex = citiesData[targetCity as keyof typeof citiesData].costIndex;
    return (parseInt(salary) * targetCostIndex / sourceCostIndex).toFixed(2);
  };

  const getExpenseComparison = () => {
    const sourceData = citiesData[sourceCity as keyof typeof citiesData];
    const targetData = citiesData[targetCity as keyof typeof citiesData];
    
    return {
      rent: {
        source: sourceData.rent,
        target: targetData.rent,
      },
      expenses: {
        source: sourceData.expenses,
        target: targetData.expenses,
      }
    };
  };

  const comparison = getExpenseComparison();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card space-y-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Cost of Living Comparison
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Current City
          </label>
          <select
            value={sourceCity}
            onChange={(e) => setSourceCity(e.target.value)}
            className="input mt-1"
          >
            {Object.keys(citiesData).map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Target City
          </label>
          <select
            value={targetCity}
            onChange={(e) => setTargetCity(e.target.value)}
            className="input mt-1"
          >
            {Object.keys(citiesData).map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Monthly Salary (₹)
          </label>
          <input
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="input mt-1"
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/50 rounded-lg">
        <p className="text-lg font-semibold text-primary-900 dark:text-primary-100">
          To maintain the same standard of living, you need ₹{calculateEquivalentSalary()} in {targetCity}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Rent Comparison</h3>
          <div className="space-y-3">
            {Object.entries(comparison.rent.source).map(([type, amount]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">{type.toUpperCase()}</span>
                <div className="flex space-x-4">
                  <span className="text-gray-900 dark:text-white">₹{amount}</span>
                  <span className="text-gray-400">vs</span>
                  <span className="text-gray-900 dark:text-white">
                    ₹{comparison.rent.target[type as keyof typeof comparison.rent.target]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Expenses Comparison</h3>
          <div className="space-y-3">
            {Object.entries(comparison.expenses.source).map(([category, amount]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300 capitalize">{category}</span>
                <div className="flex space-x-4">
                  <span className="text-gray-900 dark:text-white">₹{amount}</span>
                  <span className="text-gray-400">vs</span>
                  <span className="text-gray-900 dark:text-white">
                    ₹{comparison.expenses.target[category as keyof typeof comparison.expenses.target]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 