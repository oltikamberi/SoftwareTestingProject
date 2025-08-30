import { useEffect, useMemo, useState } from 'react';
import {
  type FinancialRecord,
  useFinancialRecords,
} from '../../contexts/financial-record-context';
import { useTable, type Column, type CellProps, type Row } from 'react-table';

import SaveTableButton from './save-table-button';

interface EditableCellProps extends CellProps<FinancialRecord> {
  updateRecord: (rowIndex: number, columnId: string, value: any) => void;
  editable: boolean;
}

const EditableCell: React.FC<EditableCellProps> = ({
  value: initialValue,
  row,
  column,
  updateRecord,
  editable,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  /* Ktu e kemi rregullu bugin per me i ba sync mausin edhe enterin mi shfaq vlerat meniher pa e trus enter 
  e kena shtu use effectin i cili mundson me ba i ba sync qe ndryshimet me u ba meniher, e man te njejt vleren lokale 
  kur kemi ndryshime te prindit */

  //Sync local value when parent updates
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  //Me kta e kemi mundsu me rujt vleren me enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      updateRecord(row.index, column.id, value);
    }
  };

  //Me kta e kemi mundesu me rujt vlerat kur ta shtypim mausin kudo"
  const handleBlur = () => {
    setIsEditing(false);
    updateRecord(row.index, column.id, value);
  };

  return (
    <div
      onClick={() => editable && setIsEditing(true)}
      style={{ cursor: editable ? 'pointer' : 'default' }}
    >
      {isEditing ? (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        value
      )}
    </div>
  );
};

export const FinancialRecordList = () => {
  const { records, updateRecord, deleteRecord } = useFinancialRecords();

  const updateCellRecord = (rowIndex: number, columnId: string, value: any) => {
    const id = records[rowIndex]?._id;
    updateRecord(id ?? '', { ...records[rowIndex], [columnId]: value });
  };

  const columns: Array<Column<FinancialRecord>> = useMemo(
    () => [
      {
        Header: 'Description',
        accessor: 'description',
        Cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        Cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      },
      {
        Header: 'Category',
        accessor: 'category',
        Cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      },
      {
        Header: 'Payment Method',
        accessor: 'paymentMethod',
        Cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      },
      {
        Header: 'Date',
        accessor: 'date',
        Cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={false}
          />
        ),
      },
      {
        Header: 'Delete',
        id: 'delete',
        Cell: ({ row }) => (
          <button
            onClick={() => deleteRecord(row.original._id ?? '')}
            className="button"
          >
            Delete
          </button>
        ),
      },
    ],
    [records]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: records,
    });

  return (
    <div className="table-row">
      <div className="table-wrapper">
        <table {...getTableProps()} className="table">
          <thead>
            {headerGroups.map((hg) => (
              <tr {...hg.getHeaderGroupProps()}>
                {hg.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Button OUTSIDE the table, to the RIGHT of it */}
      <SaveTableButton records={records} />
    </div>
  );
};
