import { useUser } from '@clerk/clerk-react';
import { createContext, useContext, useEffect, useState } from 'react';

export interface IncomeRecord {
  _id?: string;
  userId: string;
  date: Date;
  source: string;
  amount: number;
}

interface IncomeContextType {
  incomeRecords: IncomeRecord[];
  addIncome: (record: IncomeRecord) => void;
  updateIncome: (id: string, updatedFields: Partial<IncomeRecord>) => void;
  deleteIncome: (id: string) => void;
}

export const IncomeContext = createContext<IncomeContextType | undefined>(
  undefined
);

export const IncomeProvider = ({ children }: { children: React.ReactNode }) => {
  const [incomeRecords, setIncomeRecords] = useState<IncomeRecord[]>([]);
  const { user } = useUser();

  const fetchIncomes = async () => {
    if (!user) return;
    const response = await fetch(
      `http://localhost:3001/income/getAllByUserID/${user.id}`
    );
    if (response.ok) {
      const data = await response.json();
      setIncomeRecords(data);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, [user]);

  const addIncome = async (record: IncomeRecord) => {
    const response = await fetch('http://localhost:3001/income', {
      method: 'POST',
      body: JSON.stringify(record),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      const newIncome = await response.json();
      setIncomeRecords((prev) => [...prev, newIncome]);
    }
  };

  const updateIncome = async (
    id: string,
    updatedFields: Partial<IncomeRecord>
  ) => {
    const response = await fetch(`http://localhost:3001/income/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedFields),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      setIncomeRecords((prev) =>
        prev.map((record) =>
          record._id === id ? { ...record, ...updatedFields } : record
        )
      );
    }
  };

  const deleteIncome = async (id: string) => {
    const response = await fetch(`http://localhost:3001/income/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setIncomeRecords((prev) => prev.filter((record) => record._id !== id));
    }
  };

  return (
    <IncomeContext.Provider
      value={{ incomeRecords, addIncome, updateIncome, deleteIncome }}
    >
      {children}
    </IncomeContext.Provider>
  );
};

export const useIncomeRecords = () => {
  const context = useContext(IncomeContext);
  if (!context) {
    throw new Error('useIncomeRecords must be used within an IncomeProvider');
  }
  return context;
};
