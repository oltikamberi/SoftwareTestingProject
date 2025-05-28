import { IncomeForm } from './income-form';
import { IncomeList } from './income-list';

const IncomePage = () => {
  return (
    //you can change from dashboard to income cnt
    <div className="dashboard-container">
      <h2>Income Page</h2>
      <IncomeForm />
      <IncomeList />
    </div>
  );
};

export default IncomePage;
