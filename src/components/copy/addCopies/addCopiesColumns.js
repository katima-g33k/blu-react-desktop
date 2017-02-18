const addCopiesColumns = [
  {
    dataField: 'id',
    isKey: true,
    hidden: true,
  },
  {
    dataField: 'title',
    label: 'Titre',
    tdStyle: { whiteSpace: 'normal' },
    dataFormat(cell, row) {
      return row.item.name;
    },
  },
  {
    dataField: 'price',
    label: 'Prix',
    width: '40px',
    dataFormat(cell) {
      return `${cell} $`;
    },
  },
  {
    dataField: 'actions',
    label: '',
    dataAlign: 'center',
    width: '60px',
  },
];

export default addCopiesColumns;
