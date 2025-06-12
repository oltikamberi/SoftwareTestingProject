import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useBudgetRecords } from '../../contexts/budget-context';

export const BudgetForm = () => {
  const [category, setCategory] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const { addBudget } = useBudgetRecords();
  const { user } = useUser();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedLimit = parseFloat(monthlyLimit);
    const normalizedCategory = category.trim().toLowerCase();

    if (isNaN(parsedLimit) || parsedLimit < 0) {
      alert('Only zero or positive values are allowed for budget.');
      return;
    }

    // General max limit
    if (parsedLimit > 1_000_000_000_000) {
      alert('Max value is 1 trillion.');
      return;
    }

    // Custom limits
    if (normalizedCategory === 'clothes' && parsedLimit > 7000) {
      alert('Max value for Clothes is 7000.');
      return;
    }

    if (normalizedCategory === 'food' && parsedLimit > 12000) {
      alert('Max value for Food is 12000.');
      return;
    }

    const newBudget = {
      userId: user?.id ?? '',
      category,
      monthlyLimit: parsedLimit,
    };

    addBudget(newBudget);
    setCategory('');
    setMonthlyLimit('');
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label>Category</label>
        <input
          className="input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <label>Monthly Limit</label>
        <input
          className="input"
          type="number"
          value={monthlyLimit}
          onChange={(e) => setMonthlyLimit(e.target.value)}
          required
        />
        <button type="submit" className="button">
          Add Budget
        </button>
      </form>
    </div>
  );
};
