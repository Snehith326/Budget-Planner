import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  ClockIcon,
  XCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useFinance } from '../context/FinanceContext';

export default function RegretRadar() {
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [purchaseCategory, setPurchaseCategory] = useState('');
  const [purchaseItem, setPurchaseItem] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { checkRegretRisk, transactions } = useFinance();

  const categories = ['Food', 'Transportation', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Other'];

  const analyzeRegretRisk = () => {
    if (!purchaseAmount || !purchaseCategory || !purchaseItem) return;

    setIsAnalyzing(true);
    
    setTimeout(() => {
      const regretResult = checkRegretRisk(parseFloat(purchaseAmount), purchaseCategory);
      
      // Generate additional insights
      const recentSimilarPurchases = transactions
        .filter(t => t.category === purchaseCategory && t.type === 'expense')
        .slice(0, 3);
      
      const lastWeekSpending = transactions
        .filter(t => {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return t.date >= weekAgo && t.type === 'expense';
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const insights = [
        `You've spent ₹${lastWeekSpending} in the last week`,
        `${recentSimilarPurchases.length} similar purchases in ${purchaseCategory} recently`,
        regretResult.risk > 0.7 ? 'High impulse purchase risk detected' : 'Purchase seems reasonable',
        regretResult.risk > 0.5 ? 'Consider waiting 24 hours before buying' : 'Aligns with your spending pattern'
      ];

      setAnalysis({
        ...regretResult,
        amount: parseFloat(purchaseAmount),
        category: purchaseCategory,
        item: purchaseItem,
        insights,
        recentPurchases: recentSimilarPurchases,
        recommendation: regretResult.risk > 0.7 ? 'PAUSE' : regretResult.risk > 0.4 ? 'CONSIDER' : 'PROCEED'
      });
      
      setIsAnalyzing(false);
    }, 2000);
  };

  const getRiskColor = (risk: number) => {
    if (risk > 0.7) return 'red';
    if (risk > 0.4) return 'amber';
    return 'emerald';
  };

  const getRiskLabel = (risk: number) => {
    if (risk > 0.7) return 'High Risk';
    if (risk > 0.4) return 'Medium Risk';
    return 'Low Risk';
  };

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
          className="mx-auto w-16 h-16 bg-gradient-to-r from-amber-500 to-red-500 rounded-2xl flex items-center justify-center mb-4"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ExclamationTriangleIcon className="w-8 h-8 text-white" />
          </motion.div>
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Regret Radar</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          AI-powered purchase analysis to prevent buyer's regret
        </p>
      </div>

      {/* Purchase Input Form */}
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Tell me about your purchase
          </h2>
          
          <div className="space-y-6">
            {/* Item Name */}
            <div>
              <label className="block text-lg font-medium text-gray-900 dark:text-white mb-3">
                What do you want to buy?
              </label>
              <input
                type="text"
                value={purchaseItem}
                onChange={(e) => setPurchaseItem(e.target.value)}
                className="w-full px-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="e.g., New sneakers, iPhone, weekend trip"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-lg font-medium text-gray-900 dark:text-white mb-3">
                How much does it cost?
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">₹</span>
                <input
                  type="number"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-lg font-medium text-gray-900 dark:text-white mb-3">
                What category is this?
              </label>
              <select
                value={purchaseCategory}
                onChange={(e) => setPurchaseCategory(e.target.value)}
                className="w-full px-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Analyze Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={analyzeRegretRisk}
              disabled={!purchaseAmount || !purchaseCategory || !purchaseItem || isAnalyzing}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-red-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3"
                  />
                  Analyzing purchase risk...
                </div>
              ) : (
                '🔍 Analyze Purchase Risk'
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-6 space-y-6"
            >
              {/* Main Result Card */}
              <div className={`p-8 rounded-2xl shadow-lg border-2 ${
                analysis.recommendation === 'PAUSE' 
                  ? 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-300 dark:border-red-700'
                  : analysis.recommendation === 'CONSIDER'
                  ? 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-300 dark:border-amber-700'
                  : 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-300 dark:border-emerald-700'
              }`}>
                <div className="flex items-start space-x-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className={`p-4 rounded-full ${
                      analysis.recommendation === 'PAUSE' 
                        ? 'bg-red-100 dark:bg-red-900/40'
                        : analysis.recommendation === 'CONSIDER'
                        ? 'bg-amber-100 dark:bg-amber-900/40'
                        : 'bg-emerald-100 dark:bg-emerald-900/40'
                    }`}
                  >
                    {analysis.recommendation === 'PAUSE' ? (
                      <XCircleIcon className="w-12 h-12 text-red-600" />
                    ) : analysis.recommendation === 'CONSIDER' ? (
                      <ClockIcon className="w-12 h-12 text-amber-600" />
                    ) : (
                      <CheckCircleIcon className="w-12 h-12 text-emerald-600" />
                    )}
                  </motion.div>
                  
                  <div className="flex-1">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className={`text-3xl font-bold mb-2 ${
                        analysis.recommendation === 'PAUSE' 
                          ? 'text-red-800 dark:text-red-400'
                          : analysis.recommendation === 'CONSIDER'
                          ? 'text-amber-800 dark:text-amber-400'
                          : 'text-emerald-800 dark:text-emerald-400'
                      }`}>
                        {analysis.recommendation}
                      </h3>
                      
                      <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">
                        {analysis.item} - ₹{analysis.amount}
                      </p>

                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`px-4 py-2 rounded-full ${
                          analysis.risk > 0.7 
                            ? 'bg-red-200 dark:bg-red-900/40 text-red-800 dark:text-red-400'
                            : analysis.risk > 0.4
                            ? 'bg-amber-200 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400'
                            : 'bg-emerald-200 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400'
                        }`}>
                          <span className="font-medium">
                            {getRiskLabel(analysis.risk)} - {(analysis.risk * 100).toFixed(0)}%
                          </span>
                        </div>
                        
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${analysis.risk * 100}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`h-3 rounded-full ${
                              analysis.risk > 0.7 ? 'bg-red-500' : analysis.risk > 0.4 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* AI Message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className={`mt-6 p-4 rounded-xl ${
                    analysis.recommendation === 'PAUSE' 
                      ? 'bg-red-100 dark:bg-red-900/30'
                      : analysis.recommendation === 'CONSIDER'
                      ? 'bg-amber-100 dark:bg-amber-900/30'
                      : 'bg-emerald-100 dark:bg-emerald-900/30'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <LightBulbIcon className={`w-6 h-6 mt-0.5 ${
                      analysis.recommendation === 'PAUSE' 
                        ? 'text-red-600'
                        : analysis.recommendation === 'CONSIDER'
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white mb-1">
                        AI Analysis:
                      </p>
                      <p className={`${
                        analysis.recommendation === 'PAUSE' 
                          ? 'text-red-800 dark:text-red-400'
                          : analysis.recommendation === 'CONSIDER'
                          ? 'text-amber-800 dark:text-amber-400'
                          : 'text-emerald-800 dark:text-emerald-400'
                      }`}>
                        {analysis.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  💡 Insights & Recommendations
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.insights.map((insight: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
                    >
                      <span className="text-lg">🔍</span>
                      <p className="text-gray-700 dark:text-gray-300">{insight}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  🚫 Cancel Purchase
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  ⏰ Wait 24 Hours
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  ✅ Proceed with Caution
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}