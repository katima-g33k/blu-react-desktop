import I18n from './i18n/i18n';

const formatString = (str, highlight) => highlight ? `<span class="highlight">${str}</span>` : str;
const highlightResults = (cell, row, extra = {}) => {
  const regex = new RegExp(`(${extra.highlight})`, 'i');
  return cell.split(regex).map(string => formatString(string, regex.test(string))).join('');
};

export const SearchColumns = {
  member: [
    {
      dataField: 'no',
      label: I18n.t('TableColumns.search.member.no'),
      dataSort: true,
      isKey: true,
      dataFormat: highlightResults,
      formatExtraData: { props: ['highlight'] },
    },
    {
      dataField: 'first_name',
      label: I18n.t('TableColumns.search.member.firstName'),
      dataSort: true,
      dataFormat: highlightResults,
      formatExtraData: { props: ['highlight'] },
    },
    {
      dataField: 'last_name',
      label: I18n.t('TableColumns.search.member.lastName'),
      dataSort: true,
      dataFormat: highlightResults,
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
      dataFormat: highlightResults,
      formatExtraData: { props: ['highlight'] },
    },
    {
      dataField: 'editor',
      label: I18n.t('TableColumns.search.item.editor'),
      width: '170px',
      tdStyle: { whiteSpace: 'normal' },
      dataSort: true,
      dataFormat: highlightResults,
      formatExtraData: { props: ['highlight'] },
    },
    {
      dataField: 'edition',
      label: I18n.t('TableColumns.search.item.edition'),
      dataSort: true,
      width: '80px',
      dataFormat: highlightResults,
      formatExtraData: { props: ['highlight'] },
    },
    {
      dataField: 'publication',
      label: I18n.t('TableColumns.search.item.publication'),
      width: '160px',
      dataSort: true,
      dataFormat: highlightResults,
    },
    {
      dataField: 'author',
      label: I18n.t('TableColumns.search.item.authors'),
      tdStyle: { whiteSpace: 'normal' },
      dataFormat(authors) {
        if (!Array.isArray(authors)) {
          return '';
        }
        return authors.map((author) => `${author.first_name} ${author.last_name}`).join(', ');
      },
      formatExtraData: { props: ['highlight'] },
    },
  ],
};
