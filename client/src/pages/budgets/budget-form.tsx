import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useBudgetRecords } from '../../contexts/budget-context';
import './budget-form.css';

export const BudgetForm = () => {
  const [category, setCategory] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addBudget } = useBudgetRecords();
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const parsedLimit = parseFloat(monthlyLimit);
    const normalizedCategory = category.trim().toLowerCase();

    if (isNaN(parsedLimit) || parsedLimit < 0) {
      alert('Only zero or positive values are allowed for budget.');
      setIsSubmitting(false);
      return;
    }

    // General max limit
    if (parsedLimit > 1_000_000_000_000) {
      alert('Max value is 1 trillion.');
      setIsSubmitting(false);
      return;
    }

    // Custom limits
    if (normalizedCategory === 'clothes' && parsedLimit > 10000) {
      alert('Max value for Clothes is 7000.');
      setIsSubmitting(false);
      return;
    }

    if (normalizedCategory === 'food' && parsedLimit > 12000) {
      alert('Max value for Food is 12000.');
      setIsSubmitting(false);
      return;
    }

    const newBudget = {
      userId: user?.id ?? '',
      category,
      monthlyLimit: parsedLimit,
    };

    try {
      await addBudget(newBudget);
      setCategory('');
      setMonthlyLimit('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding budget:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="budget-form-container">
      <form onSubmit={handleSubmit} className="budget-form">
        <div className="form-row">
          <div className="input-group">
            <label htmlFor="category" className="input-label">
              Category
            </label>
            <div className="input-wrapper">
              <input
                id="category"
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Food, Transport, Entertainment"
                required
              />
              <div className="input-border"></div>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="monthlyLimit" className="input-label">
              Monthly Limit
            </label>
            <div className="input-wrapper">
              <div className="currency-input-wrapper">
                <span className="currency-symbol">$</span>
                <input
                  id="monthlyLimit"
                  className="form-input currency-input"
                  type="number"
                  value={monthlyLimit}
                  onChange={(e) => setMonthlyLimit(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="input-border"></div>
            </div>
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              className={`submit-btn ${isSubmitting ? 'submitting' : ''} ${showSuccess ? 'success' : ''}`}
              disabled={isSubmitting}
            >
              <span className="btn-content">
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    <span>Creating...</span>
                  </>
                ) : showSuccess ? (
                  <>
                    <span className="success-icon">✓</span>
                    <span>Created!</span>
                  </>
                ) : (
                  <>
                    <span className="btn-icon">✨</span>
                    <span>Add Budget</span>
                  </>
                )}
              </span>
              <div className="btn-shine"></div>
            </button>
          </div>
        </div>
      </form>

      {/* Success Message */}
      {showSuccess && (
        <div className="success-message">
          <div className="success-animation">
            <div className="checkmark">
              <div className="checkmark-circle"></div>
              <div className="checkmark-stem"></div>
              <div className="checkmark-kick"></div>
            </div>
          </div>
          <p>Budget added successfully!</p>
        </div>
      )}
    </div>
  );
};
