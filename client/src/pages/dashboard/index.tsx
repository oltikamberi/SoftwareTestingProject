import { useUser } from '@clerk/clerk-react';
import { FinancialRecordForm } from './financial-record-form';
import { FinancialRecordList } from './financial-record-list';
import './financial-record.css';
import './dashboard.css';

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
    <div className="dashboard">
      <div className="dashboard__topbar">
        <h1 className="dashboard__title">Welcome {user?.firstName}</h1>
        <div className="month-picker">
          <label htmlFor="month">Select Month</label>
          <input
            id="month"
            type="month"
            min="2000-01"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
      </div>

      <section className="stats-grid">
        <div className="stat-card stat-card--income">
          <div className="stat-card__label">Total Income</div>
          <div className="stat-card__value">${totalIncome}</div>
        </div>
        <div className="stat-card stat-card--expense">
          <div className="stat-card__label">Total Expenses</div>
          <div className="stat-card__value">${-totalExpenses}</div>
        </div>
        <div className={`stat-card ${incomeState >= 0 ? 'stat-card--positive' : 'stat-card--negative'}`}>
          <div className="stat-card__label">Balance</div>
          <div className="stat-card__value">${incomeState}</div>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="panel__header">
            <h2>Add Financial Record</h2>
          </div>
          <div className="panel__body">
            <FinancialRecordForm />
          </div>
        </div>

        <div className="panel">
          <div className="panel__header">
            <h2>Budgets Overview</h2>
          </div>
          <div className="panel__body budgets-list">
            {budgets.length === 0 && (
              <div className="empty">No budgets yet.</div>
            )}
            {budgets.map((budget) => {
              const used = budgetUsage[budget.category] || 0;
              const limit = budget.monthlyLimit;
              const remaining = limit - used;
              const isOverspent = remaining < 0;
              const percent = Math.min(100, Math.round((used / Math.max(1, limit)) * 100));
              return (
                <div className={`budget-card ${isOverspent ? 'budget-card--danger' : ''}`} key={budget._id}>
                  <div className="budget-card__top">
                    <div className="budget-card__title">{budget.category}</div>
                    <div className="budget-card__amounts">
                      <span className="budget-card__used">${used}</span>
                      <span className="budget-card__sep">/</span>
                      <span className="budget-card__limit">${limit}</span>
                    </div>
                  </div>
                  <div className="progress">
                    <div className="progress__bar" style={{ width: `${percent}%` }} />
                  </div>
                  <div className={`budget-card__footer ${isOverspent ? 'danger' : ''}`}>
                    {isOverspent ? (
                      <span>Overspent ${Math.abs(remaining)}</span>
                    ) : (
                      <span>{remaining} remaining</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="panel panel--grow">
        <div className="panel__header">
          <h2>Transactions</h2>
        </div>
        <div className="panel__body">
          <FinancialRecordList filenameHint={selectedMonth} />
        </div>
      </section>
    </div>
  );
};
