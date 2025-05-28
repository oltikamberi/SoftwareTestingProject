import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useBudgetRecords } from '../../contexts/budget-context';

export const BudgetForm = () => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const { addBudget } = useBudgetRecords();
  const { user } = useUser();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newBudget = {
      userId: user?.id ?? '',
      date: new Date(),
      category,
      amount: parseFloat(amount),
    };

    addBudget(newBudget);
    setCategory('');
    setAmount('');
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
        <label>Amount</label>
        <input
          className="input"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit" className="button">
          Add Budget
        </button>
      </form>
    </div>
  );
};
