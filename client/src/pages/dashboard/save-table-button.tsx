// Personal-finance/client/src/pages/dashboard/save-table-button.tsx
import React from 'react';
import type { FinancialRecord } from '../../contexts/financial-record-context';
import { exportRecordsToXlsx } from '../../utils/export-to-excel';

type Props = {
  records: FinancialRecord[];
  filenameHint?: string; // optional (e.g., the selected month label)
};

const SaveTableButton: React.FC<Props> = ({ records, filenameHint }) => {
  const handleClick = () => {
    if (!records || records.length === 0) {
      alert('There are no records to export yet.');
      return;
    }
    exportRecordsToXlsx(records, filenameHint);
  };

  return (
    <button type="button" className="saveTableBtn" onClick={handleClick}>
      Save Table
    </button>
  );
};

export default SaveTableButton;
