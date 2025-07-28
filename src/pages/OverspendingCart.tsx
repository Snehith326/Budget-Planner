import React from 'react';
import { motion } from 'framer-motion';
import { 
  ExclamationTriangleIcon, 
  ShoppingCartIcon,
  FireIcon,
  ChartBarIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { useFinance } from '../context/FinanceContext';

export default function OverspendingCart() {
  const { budgets, getExpensesByCategory } = useFinance();
  const expenses = getExpensesByCategory();

  const overspendingCategories = budgets
    .map(budget => ({
      ...budget,
      overspent: Math.max(0, budget.spent - budget.limit),
      percentage: (budget.spent / budget.limit) * 100
    }))
    .filter(item => item.overspent > 0)
    .sort((a, b) => b.overspent - a.overspent);

  const warningCategories = budgets
    .map(budget => ({
      ...budget,
      percentage: (budget.spent / budget.limit) * 100
    }))
    .filter(item => item.percentage >= 80 && item.percentage < 100)
    .sort((a, b) => b.percentage - a.percentage);

  const totalOverspent = overspendingCategories.reduce((sum, item) => sum + item.overspent, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Overspending Cart</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track categories where you're spending too much</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Overspent</p>
            <p className="text-2xl font-bold text-red-600">₹{totalOverspent}</p>
          </div>
          <motion.div
            animate={totalOverspent > 0 ? { 
              scale: [1, 1.1, 1],
              rotate: [0, -5, 5, 0] 
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-3 rounded-xl bg-red-100 dark:bg-red-900/20"
          >
            <ShoppingCartIcon className="w-8 h-8 text-red-600" />
          </motion.div>
        </div>
      </div>

      {/* Alert Summary */}
      {(overspendingCategories.length > 0 || warningCategories.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <ExclamationTriangleIcon className="w-8 h-8" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold">Budget Alert!</h2>
              <p className="text-red-100">
                {overspendingCategories.length > 0 
                  ? `You're over budget in ${overspendingCategories.length} categories`
                  : `${warningCategories.length} categories are approaching their limits`
                }
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-red-100 text-sm">Categories Over Budget</p>
              <p className="text-3xl font-bold">{overspendingCategories.length}</p>
            </div>
            <div>
              <p className="text-red-100 text-sm">Total Overspent</p>
              <p className="text-3xl font-bold">₹{totalOverspent}</p>
            </div>
            <div>
              <p className="text-red-100 text-sm">Avg. Overspending</p>
              <p className="text-3xl font-bold">
                {overspendingCategories.length > 0 
                  ? `₹${Math.round(totalOverspent / overspendingCategories.length)}`
                  : '₹0'
                }
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Overspending Categories */}
      {overspendingCategories.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FireIcon className="w-6 h-6 text-red-500 mr-2" />
            Over Budget Categories
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {overspendingCategories.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-l-4 border-red-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {category.category}
                    </h3>
                    <p className="text-red-600 font-medium mt-1">
                      Over by ₹{category.overspent}
                    </p>
                  </div>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0] 
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-2 rounded-full bg-red-100 dark:bg-red-900/20"
                  >
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                  </motion.div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Spent</span>
                    <span className="font-medium text-red-600">₹{category.spent}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Budget</span>
                    <span className="font-medium text-gray-900 dark:text-white">₹{category.limit}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className="h-3 bg-gray-400 relative"
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(category.percentage - 100, 50)}%` }}
                        transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
                        className="absolute right-0 top-0 h-3 bg-red-500"
                        style={{
                          background: 'repeating-linear-gradient(45deg, #ef4444, #ef4444 10px, #dc2626 10px, #dc2626 20px)'
                        }}
                      />
                    </motion.div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-600 font-medium">
                      {category.percentage.toFixed(1)}% of budget
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Limit: ₹{category.limit}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-800/30 text-red-700 dark:text-red-400 rounded-xl transition-colors text-sm font-medium"
                  >
                    Set Alert
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/20 dark:hover:bg-orange-800/30 text-orange-700 dark:text-orange-400 rounded-xl transition-colors text-sm font-medium"
                  >
                    Adjust Budget
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Warning Categories */}
      {warningCategories.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <ExclamationTriangleIcon className="w-6 h-6 text-amber-500 mr-2" />
            Approaching Budget Limit
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {warningCategories.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-l-4 border-amber-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {category.category}
                    </h3>
                    <p className="text-amber-600 font-medium mt-1">
                      {category.percentage.toFixed(1)}% of budget used
                    </p>
                  </div>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1] 
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/20"
                  >
                    <ExclamationTriangleIcon className="w-6 h-6 text-amber-600" />
                  </motion.div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Spent</span>
                    <span className="font-medium text-amber-600">₹{category.spent}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Remaining</span>
                    <span className="font-medium text-emerald-600">₹{category.limit - category.spent}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${category.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-amber-500"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-amber-600 font-medium">
                      ₹{category.limit - category.spent} remaining
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Limit: ₹{category.limit}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/20 dark:hover:bg-amber-800/30 text-amber-700 dark:text-amber-400 rounded-xl transition-colors text-sm font-medium"
                  >
                    Track More
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/20 dark:hover:bg-emerald-800/30 text-emerald-700 dark:text-emerald-400 rounded-xl transition-colors text-sm font-medium"
                  >
                    Slow Down
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {overspendingCategories.length === 0 && warningCategories.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0] 
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-8xl mb-4"
          >
            🎉
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Great Job!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            You're staying within all your budget limits. Keep up the excellent financial discipline!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
              <ChartBarIcon className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-emerald-800 dark:text-emerald-400 font-medium">All budgets on track</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <BanknotesIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-blue-800 dark:text-blue-400 font-medium">Savings goals achievable</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
              <TrophyIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-purple-800 dark:text-purple-400 font-medium">Financial discipline</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}