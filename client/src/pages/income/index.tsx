import { IncomeForm } from './income-form';
import { IncomeList } from './income-list';
import './income-page.css';

const IncomePage = () => {
  return (
    <div className="income-page-wrapper">
      <div className="income-page-container">
        <header className="income-header">
          <div className="income-header__icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12h18" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 3v18" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="income-title">Income</h1>
          <p className="income-subtitle">Track and edit your income records with ease</p>
        </header>

        <main className="income-content">
          <section className="income-panel">
            <div className="income-panel__header"><h2>Add Income</h2></div>
            <div className="income-panel__body">
              <IncomeForm />
            </div>
          </section>

          <section className="income-panel income-panel--grow">
            <div className="income-panel__header"><h2>Income Records</h2></div>
            <div className="income-panel__body">
              <div className="income-table-wrapper">
                <IncomeList />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default IncomePage;
