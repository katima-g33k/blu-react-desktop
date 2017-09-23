import highlightSearchResults from './highlightSearchResults';
import I18n from './i18n/i18n';

export const SearchColumns = {
  member: [
    {
      dataField: 'no',
      label: I18n.t('TableColumns.search.member.no'),
      dataSort: true,
      isKey: true,
      dataFormat: (cell, row, extra = {}) => highlightSearchResults(cell, extra.highlight),
      formatExtraData: { props: ['highlight'] },
    },
    {
      dataField: 'firstName',
      label: I18n.t('TableColumns.search.member.firstName'),
      dataSort: true,
      dataFormat: (cell, row, extra = {}) => highlightSearchResults(cell, extra.highlight),
      formatExtraData: { props: ['highlight'] },
    },
    {
      dataField: 'lastName',
      label: I18n.t('TableColumns.search.member.lastName'),
      dataSort: true,
      dataFormat: (cell, row, extra = {}) => highlightSearchResults(cell, extra.highlight),
      formatExtraData: { props: ['highlight'] },
    },
    {
      dataField: 'email',
      label: 'Courriel',
      dataSort: true,
      dataFormat: (cell, row, extra = {}) => highlightSearchResults(cell, extra.highlight),
      formatExtraData: { props: ['highlight'] },
    },
  ],
  item: [
    {
      dataField: 'id',
      isKey: true,
      hidden: true,
    },
    {
      dataField: 'name',
      label: I18n.t('TableColumns.search.item.title'),
      tdStyle: { whiteSpace: 'normal' },
      dataSort: true,
      dataFormat: (cell, row, extra = {}) => highlightSearchResults(cell, extra.highlight),
      formatExtraData: { props: ['highlight'] },
    },
    {
      dataField: 'editor',
      label: I18n.t('TableColumns.search.item.editor'),
      width: '170px',
      tdStyle: { whiteSpace: 'normal' },
      dataSort: true,
      dataFormat: (cell, row, extra = {}) => highlightSearchResults(cell, extra.highlight),
      formatExtraData: { props: ['highlight'] },
    },
    {
      dataField: 'edition',
      label: I18n.t('TableColumns.search.item.edition'),
      dataSort: true,
      width: '80px',
    },
    {
      dataField: 'publication',
      label: I18n.t('TableColumns.search.item.publication'),
      width: '160px',
      dataSort: true,
    },
    {
      dataField: 'author',
      label: I18n.t('TableColumns.search.item.authors'),
      tdStyle: { whiteSpace: 'normal' },
      dataFormat(authors, item, extra = {}) {
        if (!Array.isArray(authors)) {
          return '';
        }
        const str = authors.map(author => author.toString()).join(', ');
        return highlightSearchResults(str, extra.highlight);
      },
      formatExtraData: { props: ['highlight'] },
    },
  ],
};
