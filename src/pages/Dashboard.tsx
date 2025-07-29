import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { 
  CurrencyRupeeIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useFinance } from '../context/FinanceContext';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export default function Dashboard() {
  const { transactions, savings, budgets, roundUpSavings, getExpensesByCategory } = useFinance();

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const expensesByCategory = getExpensesByCategory();
  const pieData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  const monthlyData = [
    { month: 'Jan', income: 45000, expenses: 32000 },
    { month: 'Feb', income: 48000, expenses: 28000 },
    { month: 'Mar', income: 47000, expenses: 35000 },
    { month: 'Apr', income: 52000, expenses: 31000 },
    { month: 'May', income: 49000, expenses: 29000 },
    { month: 'Jun', income: 51000, expenses: 33000 },
  ];

  const stats = [
    {
      name: 'Total Balance',
      value: `₹${(totalIncome - totalExpenses).toLocaleString()}`,
      change: '+12.5%',
      trend: 'up',
      icon: CurrencyRupeeIcon,
      color: 'emerald'
    },
    {
      name: 'Monthly Income',
      value: `₹${totalIncome.toLocaleString()}`,
      change: '+8.2%',
      trend: 'up',
      icon: ArrowTrendingUpIcon,
      color: 'blue'
    },
    {
      name: 'Monthly Expenses',
      value: `₹${totalExpenses.toLocaleString()}`,
      change: '-3.1%',
      trend: 'down',
      icon: ArrowTrendingDownIcon,
      color: 'red'
    },
    {
      name: 'Round-up Savings',
      value: `₹${roundUpSavings}`,
      change: '+15.3%',
      trend: 'up',
      icon: BanknotesIcon,
      color: 'amber'
    }
  ];

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's your financial overview.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                <div className={`flex items-center mt-2 text-sm ${
                  stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className={`p-3 rounded-xl ${
                stat.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/20' :
                stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
                stat.color === 'red' ? 'bg-red-100 dark:bg-red-900/20' :
                stat.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/20' :
                'bg-gray-100 dark:bg-gray-900/20'
              }`}>
                <stat.icon className={`w-8 h-8 ${
                  stat.color === 'emerald' ? 'text-emerald-600' :
                  stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'red' ? 'text-red-600' :
                  stat.color === 'amber' ? 'text-amber-600' :
                  'text-gray-600'
                }`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Categories Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Expense Categories</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Monthly Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, '']} />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name="Income"
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#EF4444" 
                  strokeWidth={3}
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Budget Overview and Savings Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Budget Overview</h3>
          <div className="space-y-4">
            {budgets.map((budget, index) => {
              const percentage = (budget.spent / budget.limit) * 100;
              const isOverBudget = percentage > 100;
              
              return (
                <div key={budget.category}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {budget.category}
                    </span>
                    <span className={`text-sm font-medium ${
                      isOverBudget ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      ₹{budget.spent} / ₹{budget.limit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(percentage, 100)}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-2 rounded-full ${
                        isOverBudget 
                          ? 'bg-red-500' 
                          : percentage > 80 
                          ? 'bg-amber-500' 
                          : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                  {isOverBudget && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center mt-1 text-red-600 text-xs"
                    >
                      <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                      Over budget by ₹{budget.spent - budget.limit}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Savings Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Savings Goals</h3>
          <div className="space-y-6">
            {savings.map((goal, index) => {
              const percentage = (goal.current / goal.target) * 100;
              const daysLeft = Math.ceil((goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={goal.id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">{goal.name}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {daysLeft} days left
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ₹{goal.current.toLocaleString()} / ₹{goal.target.toLocaleString()}
                    </span>
                    <span className="text-sm font-medium text-emerald-600">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Round-up Savings Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-6 text-white shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Round-up Savings</h3>
            <p className="text-emerald-100 mb-4">Your spare change is adding up!</p>
            <div className="text-4xl font-bold">₹{roundUpSavings}</div>
            <p className="text-emerald-100 mt-2">Saved automatically from your purchases</p>
          </div>
          <div className="relative">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="text-6xl"
            >
              🪙
            </motion.div>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity 
              }}
              className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {transactions.slice(0, 5).map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  transaction.type === 'income' 
                    ? 'bg-emerald-100 dark:bg-emerald-900/20' 
                    : 'bg-red-100 dark:bg-red-900/20'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'income' 
                    ? 'text-emerald-600' 
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {transaction.date.toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}