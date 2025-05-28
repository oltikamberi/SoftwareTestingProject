import { useUser } from '@clerk/clerk-react';
import { createContext, useContext, useEffect, useState } from 'react';

export interface BudgetRecord {
  date: string | number | Date;
  amount: string | number | readonly string[] | undefined;
  _id?: string;
  userId: string;
  category: string;
  monthlyLimit: number;
}

interface BudgetContextType {
  budgets: BudgetRecord[];
  addBudget: (record: BudgetRecord) => void;
  updateBudget: (id: string, updatedFields: Partial<BudgetRecord>) => void;
  deleteBudget: (id: string) => void;
}

export const BudgetContext = createContext<BudgetContextType | undefined>(
  undefined
);

export const BudgetProvider = ({ children }: { children: React.ReactNode }) => {
  const [budgets, setBudgets] = useState<BudgetRecord[]>([]);
  const { user } = useUser();

  const fetchBudgets = async () => {
    if (!user) return;
    const response = await fetch(
      `http://localhost:3001/budgets/getAllByUserID/${user.id}`
    );
    if (response.ok) {
      const data = await response.json();
      setBudgets(data);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [user]);

  const addBudget = async (record: BudgetRecord) => {
    const response = await fetch('http://localhost:3001/budgets', {
      method: 'POST',
      body: JSON.stringify(record),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      const newBudget = await response.json();
      setBudgets((prev) => [...prev, newBudget]);
    }
  };

  const updateBudget = async (
    id: string,
    updatedFields: Partial<BudgetRecord>
  ) => {
    const response = await fetch(`http://localhost:3001/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedFields),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      setBudgets((prev) =>
        prev.map((record) =>
          record._id === id ? { ...record, ...updatedFields } : record
        )
      );
    }
  };

  const deleteBudget = async (id: string) => {
    const response = await fetch(`http://localhost:3001/budgets/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setBudgets((prev) => prev.filter((record) => record._id !== id));
    }
  };

  return (
    <BudgetContext.Provider
      value={{ budgets, addBudget, updateBudget, deleteBudget }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgetRecords = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudgetRecords must be used within a BudgetProvider');
  }
  return context;
};
