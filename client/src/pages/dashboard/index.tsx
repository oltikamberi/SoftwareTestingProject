import { useUser } from '@clerk/clerk-react';
import { FinancialRecordForm } from './financial-record-form';
import { FinancialRecordList } from './financial-record-list';
import './financial-record.css';

import { useFinancialRecords } from '../../contexts/financial-record-context';
import { useIncomeRecords } from '../../contexts/income-context';
import { useBudgetRecords } from '../../contexts/budget-context';
import { useState } from 'react';

import { useMemo } from 'react';

export const Dashboard = () => {
  const { user } = useUser();
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const { records: allRecords } = useFinancialRecords();
  const { incomeRecords: allIncomeRecords } = useIncomeRecords();

  // Filter records for selected month
  const records = allRecords.filter((record) =>
    new Date(record.date).toISOString().startsWith(selectedMonth)
  );
  const incomeRecords = allIncomeRecords.filter((income) =>
    new Date(income.date).toISOString().startsWith(selectedMonth)
  );
  const { budgets } = useBudgetRecords();

  // 🟢 Total Income
  const totalIncome = useMemo(() => {
    return incomeRecords.reduce(
      (sum, income) => sum + Number(income.amount),
      0
    );
  }, [incomeRecords]);

  // 🔴 Total Expenses
  const totalExpenses = useMemo(() => {
    return records.reduce((sum, record) => sum + Number(record.amount), 0);
  }, [records]);

  // 📊 Budget usage per category
  const budgetUsage = useMemo(() => {
    const usage: Record<string, number> = {};
    records.forEach((record) => {
      if (!usage[record.category]) usage[record.category] = 0;
      usage[record.category] += Number(record.amount);
    });
    return usage;
  }, [records]);

  // 🟡 Income State
  const incomeState = useMemo(() => {
    return totalIncome - totalExpenses;
  }, [totalIncome, totalExpenses]);

  return (
    <div className="dashboard-container">
      <h1>Welcome {user?.firstName}! Here Are Your Finances:</h1>

      {/* Caktimi i shpenzimeve per muaj */}
      {/* 📅 Month Picker */}
      <label style={{ marginBottom: '10px', display: 'block' }}>
        📅 Select Month:{' '}
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </label>

      {/* 📥 Record Form */}
      <FinancialRecordForm />

      {/* ✅ Dashboard Summary (moved below the form) */}
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <h3>Total Income: ${totalIncome}</h3>
        <h3>Budgets:</h3>
        {budgets.map((budget) => {
          const used = budgetUsage[budget.category] || 0;
          const remaining = budget.monthlyLimit - used;
          const isOverspent = remaining < 0;
          //Nese e kalon vleren kthen me te kuqe qe e ke kalu, nese jo vetem tregon sa tkan met
          return (
            <div key={budget._id}>
              {isOverspent ? (
                <span style={{ color: 'red' }}>
                  Budget for {budget.category}: Overspent ${Math.abs(remaining)}{' '}
                  of ${budget.monthlyLimit}
                </span>
              ) : (
                <span>
                  Budget for {budget.category}: ${remaining} remaining of $
                  {budget.monthlyLimit}
                </span>
              )}
            </div>
          );
        })}

        <h3>Income State: ${incomeState}</h3>
        <h3>Total Expenses: ${-totalExpenses}</h3>
      </div>

      {/* 📄 Records Table */}
      <FinancialRecordList />
    </div>
  );
};
