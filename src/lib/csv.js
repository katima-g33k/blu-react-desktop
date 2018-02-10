export const createCSV = (columns, data) => {
  const csvColumns = columns.filter(({ hidden }) => !hidden);
  const header = `${csvColumns.map(column => `"${column.label}"`).join(',')}\r\n`;
  const body = data.map(row =>
    csvColumns.map((column) => {
      if (column.exportDataFormat) {
        return `"${column.exportDataFormat(row[column.dataField], row)}"`;
      }

      if (column.dataFormat) {
        return `"${column.dataFormat(row)}"`;
      }

      return `"${row[column.dataField]}"` || '""';
    }).join(','),
  ).join('\r\n');

  return new Blob([`${header}${body}`], { type: 'csv' });
};
