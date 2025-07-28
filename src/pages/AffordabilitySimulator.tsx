import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalculatorIcon,
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline';
import { useFinance } from '../context/FinanceContext';

export default function AffordabilitySimulator() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { canAfford, checkRegretRisk } = useFinance();

  const categories = ['Food', 'Transportation', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Other'];

  const handleSimulation = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setIsCalculating(true);
    
    // Simulate calculation time
    setTimeout(() => {
      const affordabilityResult = canAfford(parseFloat(amount));
      const regretResult = category ? checkRegretRisk(parseFloat(amount), category) : null;
      
      setResult({
        ...affordabilityResult,
        regret: regretResult,
        amount: parseFloat(amount),
        category: category || 'Unspecified'
      });
      
      setIsCalculating(false);
    }, 1500);
  };

  const suggestions = [
    { amount: '500', category: 'Food', label: 'Dinner at restaurant' },
    { amount: '1200', category: 'Shopping', label: 'New shirt' },
    { amount: '3000', category: 'Entertainment', label: 'Weekend trip' },
    { amount: '15000', category: 'Shopping', label: 'New smartphone' },
    { amount: '800', category: 'Transportation', label: 'Monthly metro pass' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4"
        >
          <CalculatorIcon className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Affordability Simulator</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Ask "Can I afford this?" and get AI-powered financial advice
        </p>
      </div>

      {/* Main Simulator */}
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <div className="space-y-6">
            {/* Amount Input */}
            <div>
              <label className="block text-lg font-medium text-gray-900 dark:text-white mb-3">
                How much do you want to spend?
              </label>
              <div className="relative">
                <CurrencyRupeeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-2xl border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-lg font-medium text-gray-900 dark:text-white mb-3">
                What category is this for? (Optional)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category (optional)</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Simulate Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSimulation}
              disabled={!amount || parseFloat(amount) <= 0 || isCalculating}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCalculating ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3"
                  />
                  Analyzing your finances...
                </div>
              ) : (
                'Can I Afford This?'
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`mt-6 p-8 rounded-2xl shadow-lg ${
                result.canAfford 
                  ? 'bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800'
              }`}
            >
              <div className="flex items-start space-x-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className={`p-3 rounded-full ${
                    result.canAfford ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-red-100 dark:bg-red-900/40'
                  }`}
                >
                  {result.canAfford ? (
                    <CheckCircleIcon className="w-8 h-8 text-emerald-600" />
                  ) : (
                    <XCircleIcon className="w-8 h-8 text-red-600" />
                  )}
                </motion.div>
                
                <div className="flex-1">
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`text-2xl font-bold mb-2 ${
                      result.canAfford ? 'text-emerald-800 dark:text-emerald-400' : 'text-red-800 dark:text-red-400'
                    }`}
                  >
                    {result.canAfford ? 'Yes, you can afford it!' : 'It might be tight...'}
                  </motion.h3>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-700 dark:text-gray-300 text-lg mb-4"
                  >
                    Spending ₹{result.amount} on {result.category}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className={`flex items-start space-x-3 p-4 rounded-xl ${
                      result.canAfford 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                        : 'bg-red-100 dark:bg-red-900/30'
                    }`}
                  >
                    <LightBulbIcon className={`w-6 h-6 mt-0.5 ${
                      result.canAfford ? 'text-emerald-600' : 'text-red-600'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white mb-1">
                        AI Suggestion:
                      </p>
                      <p className={`${
                        result.canAfford 
                          ? 'text-emerald-800 dark:text-emerald-400' 
                          : 'text-red-800 dark:text-red-400'
                      }`}>
                        {result.suggestion}
                      </p>
                    </div>
                  </motion.div>

                  {/* Regret Risk */}
                  {result.regret && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mt-4 p-4 bg-amber-100 dark:bg-amber-900/30 rounded-xl"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 mt-0.5">⚠️</div>
                        <div>
                          <p className="font-medium text-amber-900 dark:text-amber-400 mb-1">
                            Regret Risk: {(result.regret.risk * 100).toFixed(0)}%
                          </p>
                          <p className="text-amber-800 dark:text-amber-300">
                            {result.regret.message}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Or try these common purchases:
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setAmount(suggestion.amount);
                  setCategory(suggestion.category);
                }}
                className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-200 text-left"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    ₹{suggestion.amount}
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                    {suggestion.category}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {suggestion.label}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}