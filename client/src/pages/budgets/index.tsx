import { BudgetForm } from './budget-form';
import { BudgetList } from './budget-list';

const BudgetPage = () => {
  return (
    <div className="dashboard-container">
      <h2>Budget Page</h2>
      <BudgetForm />
      <BudgetList />
    </div>
  );
};

export default BudgetPage;
