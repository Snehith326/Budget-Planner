import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  type: 'income' | 'expense';
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: Date;
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
}

interface FinanceContextType {
  transactions: Transaction[];
  savings: SavingsGoal[];
  budgets: Budget[];
  roundUpSavings: number;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateBudget: (category: string, limit: number) => void;
  getExpensesByCategory: () => { [key: string]: number };
  canAfford: (amount: number) => { canAfford: boolean; suggestion: string };
  checkRegretRisk: (amount: number, category: string) => { risk: number; message: string };
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      amount: 2500,
      category: 'Food',
      description: 'Grocery shopping',
      date: new Date(2024, 0, 15),
      type: 'expense'
    },
    {
      id: '2',
      amount: 5000,
      category: 'Salary',
      description: 'Monthly salary',
      date: new Date(2024, 0, 1),
      type: 'income'
    },
    {
      id: '3',
      amount: 800,
      category: 'Transportation',
      description: 'Uber rides',
      date: new Date(2024, 0, 10),
      type: 'expense'
    }
  ]);

  const [savings, setSavings] = useState<SavingsGoal[]>([
    {
      id: '1',
      name: 'Emergency Fund',
      target: 50000,
      current: 15000,
      deadline: new Date(2024, 11, 31)
    },
    {
      id: '2',
      name: 'Vacation',
      target: 25000,
      current: 8500,
      deadline: new Date(2024, 5, 30)
    }
  ]);

  const [budgets, setBudgets] = useState<Budget[]>([
    { category: 'Food', limit: 5000, spent: 2500 },
    { category: 'Transportation', limit: 2000, spent: 800 },
    { category: 'Entertainment', limit: 3000, spent: 1200 },
    { category: 'Shopping', limit: 4000, spent: 3500 }
  ]);

  const [roundUpSavings, setRoundUpSavings] = useState<number>(450);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Update round-up savings for expenses
    if (transaction.type === 'expense') {
      const roundUp = Math.ceil(transaction.amount) - transaction.amount;
      if (roundUp > 0) {
        setRoundUpSavings(prev => prev + roundUp);
      }
    }
    
    // Update budget spending
    if (transaction.type === 'expense') {
      setBudgets(prev => prev.map(budget => 
        budget.category === transaction.category 
          ? { ...budget, spent: budget.spent + transaction.amount }
          : budget
      ));
    }
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: Date.now().toString()
    };
    setSavings(prev => [...prev, newGoal]);
  };

  const updateBudget = (category: string, limit: number) => {
    setBudgets(prev => prev.map(budget => 
      budget.category === category 
        ? { ...budget, limit }
        : budget
    ));
  };

  const getExpensesByCategory = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {} as { [key: string]: number });
  };

  const canAfford = (amount: number) => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const availableBalance = totalIncome - totalExpenses;
    const canAfford = availableBalance >= amount;
    
    const suggestions = [
      "Consider saving for a few more days before this purchase",
      "Try the 24-hour rule before buying non-essentials",
      "Look for alternatives or wait for a sale",
      "Focus on your savings goals first",
      "Skip one dining out to make room for this purchase"
    ];
    
    return {
      canAfford,
      suggestion: canAfford 
        ? "You can afford this! Consider your other goals too." 
        : suggestions[Math.floor(Math.random() * suggestions.length)]
    };
  };

  const checkRegretRisk = (amount: number, category: string) => {
    const categoryExpenses = transactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const budget = budgets.find(b => b.category === category);
    const risk = budget ? (categoryExpenses + amount) / budget.limit : 0.5;
    
    const messages = [
      "You've been spending a lot in this category lately. Sure about this?",
      "Remember your savings goals. Is this purchase aligned?",
      "You bought something similar recently. Still need it?",
      "This might push you over budget. Consider waiting?",
      "Great choice! This fits well within your budget."
    ];
    
    return {
      risk: Math.min(risk, 1),
      message: risk > 0.8 ? messages[Math.floor(Math.random() * 4)] : messages[4]
    };
  };

  const editTransaction = (id: string, transaction: Omit<Transaction, 'id'>) => {
    // Find the transaction to edit
    const oldTransaction = transactions.find(t => t.id === id);
    
    if (!oldTransaction) return;
    
    // Update transactions
    setTransactions(prev => prev.map(t => 
      t.id === id ? { ...transaction, id } : t
    ));
    
    // If changing from expense to income or vice versa, or changing category/amount
    // we need to update budgets accordingly
    if (oldTransaction.type === 'expense') {
      // Remove old expense from budget
      setBudgets(prev => prev.map(budget => 
        budget.category === oldTransaction.category 
          ? { ...budget, spent: Math.max(0, budget.spent - oldTransaction.amount) }
          : budget
      ));
    }
    
    // Add new expense to budget if applicable
    if (transaction.type === 'expense') {
      setBudgets(prev => prev.map(budget => 
        budget.category === transaction.category 
          ? { ...budget, spent: budget.spent + transaction.amount }
          : budget
      ));
    }
  };
  
  const deleteTransaction = (id: string) => {
    // Find the transaction to delete
    const transaction = transactions.find(t => t.id === id);
    
    if (!transaction) return;
    
    // Remove transaction
    setTransactions(prev => prev.filter(t => t.id !== id));
    
    // Update budget if it was an expense
    if (transaction.type === 'expense') {
      setBudgets(prev => prev.map(budget => 
        budget.category === transaction.category 
          ? { ...budget, spent: Math.max(0, budget.spent - transaction.amount) }
          : budget
      ));
    }
  };

  return (
    <FinanceContext.Provider value={{
      transactions,
      savings,
      budgets,
      roundUpSavings,
      addTransaction,
      editTransaction,
      deleteTransaction,
      addSavingsGoal,
      updateBudget,
      getExpensesByCategory,
      canAfford,
      checkRegretRisk
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}