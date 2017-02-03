const addCopiesColumns = [
  {
    dataField: 'id',
    isKey: true,
    hidden: true,
  },
  {
    dataField: 'title',
    label: 'Titre',
  },
  {
    dataField: 'price',
    label: 'Prix',
    dataFormat(cell) {
      return `${cell} $`;
    },
  },
  {
    dataField: 'actions',
    label: '',
    dataAlign: 'center',
  },
];

export default addCopiesColumns;
