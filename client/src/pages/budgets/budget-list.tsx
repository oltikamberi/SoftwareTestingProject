import type { BudgetRecord } from '../../contexts/budget-context';
import { useBudgetRecords } from '../../contexts/budget-context';
import { useState } from 'react';

export const BudgetList = () => {
  const { budgets, updateBudget, deleteBudget } = useBudgetRecords();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleUpdate = async (id: string, field: keyof BudgetRecord, value: any) => {
    try {
      await updateBudget(id, { [field]: value });
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteBudget(id);
    } catch (error) {
      console.error('Error deleting budget:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (budgets.length === 0) {
    return (
      <div className="budget-count">
        <span className="count-number">0</span>
        <span className="count-label">Active Budgets</span>
      </div>
    );
  }

  return (
    <div className="budget-count">
      <span className="count-number">{budgets.length}</span>
      <span className="count-label">Active Budgets</span>
    </div>
  );
};

export const BudgetTable = () => {
  const { budgets, updateBudget, deleteBudget } = useBudgetRecords();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleUpdate = async (id: string, field: keyof BudgetRecord, value: any) => {
    try {
      await updateBudget(id, { [field]: value });
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteBudget(id);
    } catch (error) {
      console.error('Error deleting budget:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (budgets.length === 0) {
    return (
      <div className="budget-table-container">
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="empty-title">No Budgets Yet</h3>
          <p className="empty-subtitle">Create your first budget to get started with financial planning</p>
        </div>
      </div>
    );
  }

  return (
    <div className="budget-table-container">
      <div className="budget-table-wrapper">
        <table className="budget-table">
          <thead>
            <tr>
              <th className="category-header">Category</th>
              <th className="amount-header">Monthly Limit</th>
              <th className="actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((record, index) => (
              <tr key={record._id} className={`budget-row ${editingId === record._id ? 'editing' : ''}`}>
                <td className="category-cell">
                  <div className="input-wrapper">
                    <input
                      className="table-input category-input"
                      value={record.category}
                      onChange={(e) =>
                        handleUpdate(record._id ?? '', 'category', e.target.value)
                      }
                      onFocus={() => setEditingId(record._id ?? '')}
                      onBlur={() => setEditingId(null)}
                      placeholder="Category name"
                    />
                  </div>
                </td>
                <td className="amount-cell">
                  <div className="input-wrapper">
                    <div className="currency-input-wrapper">
                      <span className="currency-symbol">$</span>
                      <input
                        className="table-input amount-input"
                        type="number"
                        value={record.monthlyLimit}
                        onChange={(e) =>
                          handleUpdate(
                            record._id ?? '',
                            'monthlyLimit',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        onFocus={() => setEditingId(record._id ?? '')}
                        onBlur={() => setEditingId(null)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button
                      className={`delete-btn ${deletingId === record._id ? 'deleting' : ''}`}
                      onClick={() => handleDelete(record._id ?? '')}
                      disabled={deletingId === record._id}
                    >
                      {deletingId === record._id ? (
                        <>
                          <div className="spinner-small"></div>
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <span>Delete</span>
                        </>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="list-footer">
        <div className="total-budgets">
          <span className="total-label">Total Budgets:</span>
          <span className="total-value">{budgets.length}</span>
        </div>
        <div className="total-amount">
          <span className="total-label">Total Monthly Limit:</span>
          <span className="total-value">
            {formatCurrency(budgets.reduce((sum, budget) => sum + budget.monthlyLimit, 0))}
          </span>
        </div>
      </div>
    </div>
  );
};
