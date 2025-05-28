import { useIncomeRecords } from '../../contexts/income-context';

export const IncomeList = () => {
  const { incomeRecords, updateIncome, deleteIncome } = useIncomeRecords();

  const handleUpdate = (
    id: string,
    field: keyof (typeof incomeRecords)[0],
    value: any
  ) => {
    updateIncome(id, { [field]: value });
  };

  return (
    <div className="list-container">
      <table className="table">
        <thead>
          <tr>
            <th>Source</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {incomeRecords.map((record) => (
            <tr key={record._id}>
              <td>
                <input
                  value={record.source}
                  onChange={(e) =>
                    handleUpdate(record._id ?? '', 'source', e.target.value)
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
                  onClick={() => deleteIncome(record._id ?? '')}
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
