import { BudgetForm } from './budget-form';
import { BudgetList, BudgetTable } from './budget-list';
import './budget-page.css';

const BudgetPage = () => {
  return (
    <div className="budget-page-wrapper">
      <div className="budget-page-container">
        <div className="budget-page-header">
          <div className="header-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
              <path d="M19 15L19.5 17L21 17.5L19.5 18L19 20L18.5 18L17 17.5L18.5 17L19 15Z" fill="currentColor"/>
              <path d="M5 15L5.5 17L7 17.5L5.5 18L5 20L4.5 18L3 17.5L4.5 17L5 15Z" fill="currentColor"/>
            </svg>
          </div>
          <h1 className="page-title">Budget Management</h1>
          <p className="page-subtitle">Take control of your finances with beautiful budget tracking</p>
        </div>

        <div className="budget-content">
          <div className="unified-budget-container">
            <div className="budget-sections-header">
              <div className="section-header-left">
                <div className="section-title-group">
                  <div className="section-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                      <path d="M19 15L19.5 17L21 17.5L19.5 18L19 20L18.5 18L17 17.5L18.5 17L19 15Z" fill="currentColor"/>
                      <path d="M5 15L5.5 17L7 17.5L5.5 18L5 20L4.5 18L3 17.5L4.5 17L5 15Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="section-titles">
                    <h2 className="create-title">Create New Budget</h2>
                    <h2 className="list-title">Your Budgets</h2>
                  </div>
                </div>
              </div>
              <div className="section-header-right">
                <BudgetList />
              </div>
            </div>
            <div className="budget-form-section">
              <BudgetForm />
            </div>
            <div className="budget-table-section">
              <BudgetTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;
