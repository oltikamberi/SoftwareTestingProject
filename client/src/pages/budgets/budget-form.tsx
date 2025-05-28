import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useBudgetRecords } from '../../contexts/budget-context';

export const BudgetForm = () => {
  const [category, setCategory] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [date, setDate] = useState('');
  const { addBudget } = useBudgetRecords();
  const { user } = useUser();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newBudget = {
      userId: user?.id ?? '',
      category,
      monthlyLimit: parseFloat(monthlyLimit),
      date: new Date(date),
    };

    addBudget(newBudget);

    // Reset fields
    setCategory('');
    setMonthlyLimit('');
    setDate('');
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

        <label>Date</label>
        <input
          className="input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <button type="submit" className="button">
          Add Budget
        </button>
      </form>
    </div>
  );
};
