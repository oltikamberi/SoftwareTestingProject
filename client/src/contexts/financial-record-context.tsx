import { useUser } from '@clerk/clerk-react';
import { createContext, useContext, useEffect, useState } from 'react';

interface FinancialRecord {
  id?: string;
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
  //updateRecord: (id: string, newRecord: FinancialRecord) => void;
  //deleteRecord: (id: string) => void;
}

export const FinancialRecordContext = createContext<
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
    const response = await fetch(
      `http://localhost:3001/financial-records/getAllByUserID/${user?.id ?? ''}`
    );

    if (response.ok) {
      const records = await response.json();
      setRecords(records);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  //testimi i postit
  const addRecord = async (record: FinancialRecord) => {
    const response = await fetch('http://localhost:3001/financial-records', {
      method: 'POST',
      body: JSON.stringify(record),
      //me kta e kena rregullu POST-in
      headers: {
        'Content-Type': 'application/json',
      },
    });

    try {
      if (response.ok) {
        const newRecord = await response.json();
        setRecords((prev) => [...prev, newRecord]);
      }
    } catch (err) {}
  };

  return (
    <FinancialRecordContext.Provider value={{ records, addRecord }}>
      {children}
    </FinancialRecordContext.Provider>
  );
};

export const useFinancialRecords = () => {
  const context = useContext<FinancialRecordsContextType | undefined>(
    FinancialRecordContext
  );

  if (!context) {
    throw new Error(
      'useFinancialRecords must be used within a FinancialRecordsProvider'
    );
  }

  return context;
};
