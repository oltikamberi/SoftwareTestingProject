import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useIncomeRecords } from '../../contexts/income-context';

export const IncomeForm = () => {
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const { addIncome } = useIncomeRecords();
  const { user } = useUser();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Only positive values are allowed for income.');
      return;
    }

    const newIncome = {
      userId: user?.id ?? '',
      date: new Date(),
      source,
      amount: parsedAmount,
    };

    addIncome(newIncome);
    setSource('');
    setAmount('');
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label>Source</label>
        <input
          className="input"
          value={source}
          onChange={(e) => setSource(e.target.value)}
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
          Add Income
        </button>
      </form>
    </div>
  );
};
