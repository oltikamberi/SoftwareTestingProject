// Personal-finance/client/src/utils/export-to-excel.ts
import * as XLSX from 'xlsx';
import type { FinancialRecord } from '../contexts/financial-record-context';

/** Export given records to an .xlsx file with the 5 columns in your table. */
export function exportRecordsToXlsx(
  records: FinancialRecord[],
  filenameHint?: string
) {
  const rows = records.map((r) => ({
    Description: r.description,
    Amount: r.amount,
    Category: r.category,
    'Payment Method': r.paymentMethod,
    Date: new Date(r.date).toLocaleString(),
  }));

  const ws = XLSX.utils.json_to_sheet(rows, {
    header: ['Description', 'Amount', 'Category', 'Payment Method', 'Date'],
    skipHeader: false,
  });

  // make columns look nice
  ws['!cols'] = [
    { wch: 30 },
    { wch: 12 },
    { wch: 18 },
    { wch: 18 },
    { wch: 22 },
  ];

  // add autofilter to header row
  ws['!autofilter'] = {
    ref: XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: Math.max(rows.length, 1), c: 4 },
    }),
  };

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Expenses');

  const safeHint =
    filenameHint?.toString().replace(/[^A-Za-z0-9_-]+/g, '_') ?? '';
  const filename = `expenses${safeHint ? '-' + safeHint : ''}.xlsx`;

  XLSX.writeFile(wb, filename);
}
