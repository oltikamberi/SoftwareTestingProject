import { useBudgetRecords } from '../../contexts/budget-context';

export const BudgetList = () => {
  const { budgetRecords, updateBudget, deleteBudget } = useBudgetRecords();

  const handleUpdate = (
    id: string,
    field: keyof (typeof budgetRecords)[0],
    value: any
  ) => {
    updateBudget(id, { [field]: value });
  };

  return (
    <div className="list-container">
      <table className="table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {budgetRecords.map((record) => (
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
                  value={record.amount}
                  onChange={(e) =>
                    handleUpdate(
                      record._id ?? '',
                      'amount',
                      parseFloat(e.target.value)
                    )
                  }
                />
              </td>
              <td>{new Date(record.date).toLocaleDateString()}</td>
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
