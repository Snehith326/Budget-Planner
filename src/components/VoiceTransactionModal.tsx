import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  MicrophoneIcon, 
  StopIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useFinance } from '../context/FinanceContext';

interface VoiceTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceTransactionModal({ isOpen, onClose }: VoiceTransactionModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedTransaction, setParsedTransaction] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { addTransaction } = useFinance();

  // Real speech recognition implementation
  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    setParsedTransaction(null);
    
    // Check if browser supports speech recognition
    const SpeechRecognition: typeof window.SpeechRecognition = 
      window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        parseTranscript(transcript);
      };
      
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      // Fallback for browsers that don't support speech recognition
      alert('Your browser does not support speech recognition. Please try a different browser.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const parseTranscript = (text: string) => {
    setIsProcessing(true);
    
    // Simple parsing logic (in real app, you'd use NLP)
    setTimeout(() => {
      const amountMatch = text.match(/₹(\d+)/);
      const amount = amountMatch ? parseInt(amountMatch[1]) : 0;
      
      let type: 'income' | 'expense' = 'expense';
      let category = 'Other';
      let description = text;
      
      if (text.toLowerCase().includes('income') || text.toLowerCase().includes('earn')) {
        type = 'income';
        category = 'Salary';
      } else if (text.toLowerCase().includes('food') || text.toLowerCase().includes('lunch')) {
        category = 'Food';
      } else if (text.toLowerCase().includes('transport') || text.toLowerCase().includes('uber')) {
        category = 'Transportation';
      } else if (text.toLowerCase().includes('shopping') || text.toLowerCase().includes('clothes')) {
        category = 'Shopping';
      } else if (text.toLowerCase().includes('saving')) {
        category = 'Savings';
      }
      
      setParsedTransaction({
        amount,
        category,
        description,
        type,
        date: new Date()
      });
      
      setIsProcessing(false);
    }, 1500);
  };

  const confirmTransaction = () => {
    if (parsedTransaction) {
      addTransaction(parsedTransaction);
      
      // Show success message
      setTimeout(() => {
        onClose();
        setTranscript('');
        setParsedTransaction(null);
      }, 1000);
    }
  };

  const resetModal = () => {
    setTranscript('');
    setParsedTransaction(null);
    setIsProcessing(false);
    setIsListening(false);
  };

  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Voice Transaction</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Voice Input */}
            <div className="text-center mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isListening 
                    ? 'bg-red-500 shadow-lg shadow-red-500/50' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50'
                }`}
              >
                {isListening ? (
                  <>
                    <StopIcon className="w-8 h-8 text-white" />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border-4 border-red-300"
                    />
                  </>
                ) : (
                  <MicrophoneIcon className="w-8 h-8 text-white" />
                )}
              </motion.button>
              
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                {isListening 
                  ? 'Listening... Speak your transaction' 
                  : isProcessing 
                  ? 'Processing your request...' 
                  : 'Tap to start voice input'}
              </p>
            </div>

            {/* Transcript */}
            {transcript && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">You said:</h3>
                <p className="text-gray-700 dark:text-gray-300 italic">"{transcript}"</p>
              </motion.div>
            )}

            {/* Processing Animation */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center mb-6"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"
                />
                <span className="ml-3 text-gray-600 dark:text-gray-400">Processing...</span>
              </motion.div>
            )}

            {/* Parsed Transaction */}
            {parsedTransaction && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl"
              >
                <div className="flex items-center mb-3">
                  <CheckIcon className="w-5 h-5 text-emerald-600 mr-2" />
                  <h3 className="font-semibold text-emerald-800 dark:text-emerald-400">Transaction Parsed</h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Type:</span>
                    <span className={`font-medium ${
                      parsedTransaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {parsedTransaction.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                    <span className="font-medium text-gray-900 dark:text-white">₹{parsedTransaction.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Category:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{parsedTransaction.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Description:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{parsedTransaction.description}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {parsedTransaction ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetModal}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Try Again
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={confirmTransaction}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                  >
                    Confirm & Add
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </motion.button>
              )}
            </div>

            {/* Help Text */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-blue-800 dark:text-blue-400">
                  <p className="font-medium mb-1">Try saying:</p>
                  <ul className="text-xs space-y-1">
                    <li>"Add ₹500 to food for lunch"</li>
                    <li>"Deduct ₹150 for uber ride"</li>
                    <li>"Income ₹5000 from salary"</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}