import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Dashboard } from './pages/dashboard';
import { IncomePage } from './pages/income';
import { BudgetPage } from './pages/budgets';
import { Auth } from './pages/auth';
import { FinancialRecordsProvider } from './contexts/financial-record-context';
import { IncomeProvider } from './contexts/income-context';
import { BudgetProvider } from './contexts/budget-context';
import { SignedIn, UserButton } from '@clerk/clerk-react';

function App() {
  return (
    <Router>
      <FinancialRecordsProvider>
        <IncomeProvider>
          <BudgetProvider>
            <div className="app-container">
              <div className="navbar">
                <Link to="/">Dashboard</Link>
                <Link to="/income">Income</Link>
                <Link to="/budgets">Budgets</Link>
                <SignedIn>
                  <UserButton showName />
                </SignedIn>
              </div>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/income" element={<IncomePage />} />
                <Route path="/budgets" element={<BudgetPage />} />
              </Routes>
            </div>
          </BudgetProvider>
        </IncomeProvider>
      </FinancialRecordsProvider>
    </Router>
  );
}

export default App;
