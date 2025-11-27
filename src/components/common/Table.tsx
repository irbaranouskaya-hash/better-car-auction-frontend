import React from 'react';
import './Table.css';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  loading?: boolean;
  emptyMessage?: string;
}

export function Table<T>({ 
  columns, 
  data, 
  keyExtractor, 
  loading = false,
  emptyMessage = 'No data available'
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="table-loading">
        <div className="spinner" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="table-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead className="table-header">
          <tr>
            {columns.map((column) => (
              <th 
                key={column.key} 
                style={{ width: column.width }}
                className="table-header-cell"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-body">
          {data.map((item) => (
            <tr key={keyExtractor(item)} className="table-row">
              {columns.map((column) => (
                <td key={column.key} className="table-cell">
                  {column.render 
                    ? column.render(item) 
                    : String((item as any)[column.key])
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

