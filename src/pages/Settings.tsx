import React from 'react';
import { motion } from 'framer-motion';
import { 
  SunIcon, 
  MoonIcon, 
  BellIcon, 
  ShieldCheckIcon,
  CreditCardIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { isDark, toggleTheme } = useTheme();

  const settingSections = [
    {
      title: 'Appearance',
      settings: [
        {
          name: 'Dark Mode',
          description: 'Toggle between light and dark theme',
          icon: isDark ? MoonIcon : SunIcon,
          action: (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDark ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
            >
              <motion.span
                layout
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDark ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </motion.button>
          )
        }
      ]
    },
    {
      title: 'Notifications',
      settings: [
        {
          name: 'Budget Alerts',
          description: 'Get notified when approaching budget limits',
          icon: BellIcon,
          action: (
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-emerald-600"
            >
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
            </motion.button>
          )
        },
        {
          name: 'Transaction Notifications',
          description: 'Get notified for new transactions',
          icon: CreditCardIcon,
          action: (
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300"
            >
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
            </motion.button>
          )
        }
      ]
    },
    {
      title: 'Privacy & Security',
      settings: [
        {
          name: 'Data Encryption',
          description: 'All your financial data is encrypted',
          icon: ShieldCheckIcon,
          action: (
            <span className="text-emerald-600 font-medium">Enabled</span>
          )
        },
        {
          name: 'Analytics',
          description: 'Help improve the app with anonymous usage data',
          icon: ChartBarIcon,
          action: (
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-emerald-600"
            >
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
            </motion.button>
          )
        }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
      
      {settingSections.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {section.title}
          </h2>
          
          <div className="space-y-4">
            {section.settings.map((setting, index) => (
              <motion.div
                key={setting.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: sectionIndex * 0.1 + index * 0.05 }}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <setting.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {setting.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {setting.description}
                    </p>
                  </div>
                </div>
                {setting.action}
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}