import moment from 'moment';
import I18n from './i18n/i18n';

const highlightResults = (cell, row, extra = {}) => {
  const regex = new RegExp(`(${extra.highlight})`, 'i');

  return cell.split(regex).map((string) => {
    return regex.test(string) ? `<span class="highlight">${string}</span>` : string;
  }).join('');
};

export const CommentColumns = [
  {
    dataField: 'id',
    isKey: true,
    hidden: true,
  },
  {
    dataField: 'comment',
    label: I18n.t('TableColumns.comment.comment'),
  },
  {
    dataField: 'updated_at',
    label: I18n.t('TableColumns.comment.date'),
    dataFormat(date) {
      return date ? moment(date).format('LL') : '';
    },
  },
];

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
    },
    {
      dataField: 'name',
      label: I18n.t('TableColumns.search.item.title'),
      dataSort: true,
      dataFormat: highlightResults,
      formatExtraData: { props: ['highlight'] },
    },
    {
      dataField: 'editor',
      label: I18n.t('TableColumns.search.item.editor'),
      dataSort: true,
      dataFormat: highlightResults,
      formatExtraData: { props: ['highlight'] },
    },
    {
      dataField: 'edition',
      label: I18n.t('TableColumns.search.item.edition'),
      dataSort: true,
      dataFormat: highlightResults,
      formatExtraData: { props: ['highlight'] },
    },
    {
      dataField: 'publication',
      label: I18n.t('TableColumns.search.item.publication'),
      dataSort: true,
      dataFormat: highlightResults,
    },
    {
      dataField: 'author',
      label: I18n.t('TableColumns.search.item.authors'),
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

export const MemberCopyColumns = [
  {
    dataField: 'id',
    isKey: true,
    hidden: true,
  },
  {
    dataField: 'name',
    label: I18n.t('TableColumns.memberCopy.title'),
  },
  {
    dataField: 'editor',
    label: I18n.t('TableColumns.memberCopy.editor'),
  },
  {
    dataField: 'edition',
    label: I18n.t('TableColumns.memberCopy.edition'),
  },
  {
    dataField: 'added',
    label: I18n.t('TableColumns.memberCopy.added'),
    dataFormat(date) {
      return date === '' ? '' : moment(date).format('LL');
    },
  },
  {
    dataField: 'sold',
    label: I18n.t('TableColumns.memberCopy.sold'),
    dataFormat(date) {
      return date ? moment(date).format('LL') : '';
    },
  },
  {
    dataField: 'paid',
    label: I18n.t('TableColumns.memberCopy.paid'),
    dataFormat(date) {
      return date ? moment(date).format('LL') : '';
    },
  },
  {
    dataField: 'price',
    label: I18n.t('TableColumns.memberCopy.price'),
    dataFormat(prix) {
      return `${prix} $`;
    },
  },
];

export const ItemCopyColumns = [
  {
    dataField: 'id',
    isKey: true,
    hidden: true,
  },
  {
    dataField: 'member',
    label: I18n.t('TableColumns.itemCopy.member'),
  },
  {
    dataField: 'added',
    label: I18n.t('TableColumns.itemCopy.added'),
    dataFormat(transaction) {
      return transaction[0] ? moment(transaction[0].date).format('LL') : '';
    },
  },
  {
    dataField: 'sold',
    label: I18n.t('TableColumns.itemCopy.sold'),
    dataFormat(transaction) {
      return transaction[0] ? moment(transaction[0].date).format('LL') : '';
    },
  },
  {
    dataField: 'paid',
    label: I18n.t('TableColumns.itemCopy.paid'),
    dataFormat(transaction) {
      return transaction[0] ? moment(transaction[0].date).format('LL') : '';
    },
  },
  {
    dataField: 'price',
    label: I18n.t('TableColumns.itemCopy.price'),
    dataFormat(prix) {
      return `${prix} $`;
    },
  },
];
