import { useUser } from '@clerk/clerk-react';
import { FinancialRecordForm } from './financial-record-form';
import { FinancialRecordList } from './financial-record-list';
import './financial-record.css';

import { useFinancialRecords } from '../../contexts/financial-record-context';
import { useIncomeRecords } from '../../contexts/income-context';
import { useBudgetRecords } from '../../contexts/budget-context';

import { useMemo } from 'react';

export const Dashboard = () => {
  const { user } = useUser();
  const { records } = useFinancialRecords();
  const { incomeRecords } = useIncomeRecords();
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

      {/* 📥 Record Form */}
      <FinancialRecordForm />

      {/* ✅ Dashboard Summary (moved below the form) */}
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <h3>Total Income: ${totalIncome}</h3>
        <h3>Budgets:</h3>
        {budgets.map((budget) => {
          const used = budgetUsage[budget.category] || 0;
          const remaining = budget.monthlyLimit - used;
          return (
            <div key={budget._id}>
              Budget for {budget.category}: ${remaining} remaining of $
              {budget.monthlyLimit}
            </div>
          );
        })}
        <h3>Income State: ${incomeState}</h3>
        <h3>Total Expenses: -${-totalExpenses}</h3>
      </div>

      {/* 📄 Records Table */}
      <FinancialRecordList />
    </div>
  );
};
