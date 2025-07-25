import { useUser } from '@clerk/clerk-react';
import { createContext, useContext, useEffect, useState } from 'react';

export interface FinancialRecord {
  _id?: string;
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

interface FinancialRecordsContextType {
  records: FinancialRecord[];
  addRecord: (record: FinancialRecord) => void;
  updateRecord: (id: string, updatedFields: Partial<FinancialRecord>) => void;
  deleteRecord: (id: string) => void;
}

export const FinancialRecordsContext = createContext<
  FinancialRecordsContextType | undefined
>(undefined);

export const FinancialRecordsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const { user } = useUser();

  const fetchRecords = async () => {
    if (!user) return;
    const response = await fetch(
      `http://localhost:3001/financial-records/getAllByUserID/${user.id}`
    );

    if (response.ok) {
      const records = await response.json();
      setRecords(records);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const addRecord = async (record: FinancialRecord) => {
    const response = await fetch('http://localhost:3001/financial-records', {
      method: 'POST',
      body: JSON.stringify(record),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    try {
      if (response.ok) {
        const newRecord = await response.json();
        setRecords((prev) => [...prev, newRecord]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateRecord = async (
    id: string,
    updatedFields: Partial<FinancialRecord>
  ) => {
    try {
      const response = await fetch(
        `http://localhost:3001/financial-records/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(updatedFields),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setRecords((prev) =>
          prev.map((record) =>
            record._id === id ? { ...record, ...updatedFields } : record
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteRecord = async (id: string) => {
    const response = await fetch(
      `http://localhost:3001/financial-records/${id}`,
      {
        method: 'DELETE',
      }
    );

    try {
      if (response.ok) {
        const deletedRecord = await response.json();
        setRecords((prev) =>
          prev.filter((record) => record._id !== deletedRecord._id)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <FinancialRecordsContext.Provider
      value={{ records, addRecord, updateRecord, deleteRecord }}
    >
      {children}
    </FinancialRecordsContext.Provider>
  );
};

export const useFinancialRecords = () => {
  const context = useContext(FinancialRecordsContext);

  if (!context) {
    throw new Error(
      'useFinancialRecords must be used within a FinancialRecordsProvider'
    );
  }

  return context;
};
