import type { BudgetRecord } from '../../contexts/budget-context';
import { useBudgetRecords } from '../../contexts/budget-context';

export const BudgetList = () => {
  const { budgets, updateBudget, deleteBudget } = useBudgetRecords();

  const handleUpdate = (id: string, field: keyof BudgetRecord, value: any) => {
    updateBudget(id, { [field]: value });
  };

  return (
    <div className="list-container">
      <table className="table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Monthly Limit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((record) => (
            <tr key={record._id}>
              <td>
                <input
                  value={record.category}
                  onChange={(e) =>
                    handleUpdate(record._id ?? '', 'category', e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={record.monthlyLimit}
                  onChange={(e) =>
                    handleUpdate(
                      record._id ?? '',
                      'monthlyLimit',
                      parseFloat(e.target.value)
                    )
                  }
                />
              </td>

              <td>
                <button
                  className="button-delete"
                  onClick={() => deleteBudget(record._id ?? '')}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
