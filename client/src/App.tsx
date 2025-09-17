import './App.css';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Dashboard } from './pages/dashboard';
import IncomePage from './pages/income';
import BudgetPage from './pages/budgets';
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
                <div className="navbar__inner">
                  <div className="nav-left">
                    <NavLink
                      to="/"
                      end
                      className={({ isActive }) =>
                        `nav-link${isActive ? ' nav-link--active' : ''}`
                      }
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/income"
                      className={({ isActive }) =>
                        `nav-link${isActive ? ' nav-link--active' : ''}`
                      }
                    >
                      Income
                    </NavLink>
                    <NavLink
                      to="/budgets"
                      className={({ isActive }) =>
                        `nav-link${isActive ? ' nav-link--active' : ''}`
                      }
                    >
                      Budgets
                    </NavLink>
                  </div>
                  <div className="nav-right">
                    <SignedIn>
                      <UserButton showName />
                    </SignedIn>
                  </div>
                </div>
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
