import highlightSearchResults from './highlightSearchResults';
import i18n from './i18n';

const highlightResults = (cell, row, extra = {}) => highlightSearchResults(cell, extra.highlight);
const baseColumn = {
  dataFormat: highlightResults,
  dataSort: true,
  formatExtraData: { props: ['highlight'] },
};

const memberColumns = [
  {
    ...baseColumn,
    dataField: 'no',
    isKey: true,
    label: i18n('TableColumns.search.member.no'),
  },
  {
    ...baseColumn,
    dataField: 'firstName',
    label: i18n('TableColumns.search.member.firstName'),
  },
  {
    ...baseColumn,
    dataField: 'lastName',
    label: i18n('TableColumns.search.member.lastName'),
  },
  {
    ...baseColumn,
    dataField: 'email',
    label: i18n('TableColumns.search.member.email'),
  },
];

const itemColumns = [
  {
    dataField: 'id',
    isKey: true,
    hidden: true,
  },
  {
    ...baseColumn,
    dataField: 'name',
    label: i18n('TableColumns.search.item.title'),
    tdStyle: { whiteSpace: 'normal' },
  },
  {
    ...baseColumn,
    dataField: 'editor',
    label: i18n('TableColumns.search.item.editor'),
    tdStyle: { whiteSpace: 'normal' },
    width: '170px',
  },
  {
    dataField: 'edition',
    dataSort: true,
    label: i18n('TableColumns.search.item.edition'),
    width: '80px',
  },
  {
    dataField: 'publication',
    dataSort: true,
    label: i18n('TableColumns.search.item.publication'),
    width: '160px',
  },
  {
    ...baseColumn,
    dataField: 'author',
    dataFormat: (authors, item, extra = {}) => {
      if (!Array.isArray(authors)) {
        return '';
      }

      return highlightSearchResults(authors.map(author => author.toString()).join(', '), extra.highlight);
    },
    label: i18n('TableColumns.search.item.authors'),
    tdStyle: { whiteSpace: 'normal' },
  },
];

export default {
  item: itemColumns,
  member: memberColumns,
  parent: memberColumns,
};
