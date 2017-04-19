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
    dataFormat: (cell, row) => row.item.name,
  },
  {
    dataField: 'price',
    label: 'Prix',
    width: '40px',
    dataFormat: cell => `${cell} $`,
  },
  {
    dataField: 'actions',
    label: '',
    dataAlign: 'center',
    width: '100px',
  },
];

export default addCopiesColumns;
