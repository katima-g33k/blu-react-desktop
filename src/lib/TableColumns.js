import moment from 'moment';
import I18n from './i18n/i18n';

export const CommentColumns = [
  {
    key: 'id',
    id: true,
  },
  {
    key: 'comment',
    label: I18n.t('TableColumns.comment.comment'),
  },
  {
    key: 'updated_at',
    label: I18n.t('TableColumns.comment.date'),
    value(date) {
      return date ? moment(date).format('LL') : '';
    },
  },
];

export const SearchColumns = {
  member: [
    {
      key: 'no',
      label: I18n.t('TableColumns.search.member.no'),
      id: true,
    },
    {
      key: 'first_name',
      label: I18n.t('TableColumns.search.member.firstName'),
    },
    {
      key: 'last_name',
      label: I18n.t('TableColumns.search.member.lastName'),
    },
  ],
  item: [
    {
      key: 'id',
      id: true,
    },
    {
      key: 'name',
      label: I18n.t('TableColumns.search.item.title'),
    },
    {
      key: 'editor',
      label: I18n.t('TableColumns.search.item.editor'),
    },
    {
      key: 'edition',
      label: I18n.t('TableColumns.search.item.edition'),
    },
    {
      key: 'publication',
      label: I18n.t('TableColumns.search.item.publication'),
    },
    {
      key: 'author',
      label: I18n.t('TableColumns.search.item.authors'),
      value(authors) {
        if (!Array.isArray(authors)) {
          return '';
        }
        return authors.map((author) => `${author.first_name} ${author.last_name}`).join(', ');
      },
    },
  ],
};

export const MemberCopyColumns = [
  {
    key: 'id',
    id: true,
  },
  {
    key: 'name',
    label: I18n.t('TableColumns.memberCopy.title'),
  },
  {
    key: 'editor',
    label: I18n.t('TableColumns.memberCopy.editor'),
  },
  {
    key: 'edition',
    label: I18n.t('TableColumns.memberCopy.edition'),
  },
  {
    key: 'added',
    label: I18n.t('TableColumns.memberCopy.added'),
    value(transaction) {
      return transaction[0] ? moment(transaction[0].date).format('LL') : '';
    },
  },
  {
    key: 'sold',
    label: I18n.t('TableColumns.memberCopy.sold'),
    value(transaction) {
      return transaction[0] ? moment(transaction[0].date).format('LL') : '';
    },
  },
  {
    key: 'paid',
    label: I18n.t('TableColumns.memberCopy.paid'),
    value(transaction) {
      return transaction[0] ? moment(transaction[0].date).format('LL') : '';
    },
  },
  {
    key: 'price',
    label: I18n.t('TableColumns.memberCopy.price'),
    value(prix) {
      return `${prix} $`;
    },
  },
];

export const ItemCopyColumns = [
  {
    key: 'id',
    id: true,
  },
  {
    key: 'member',
    label: I18n.t('TableColumns.itemCopy.member'),
  },
  {
    key: 'added',
    label: I18n.t('TableColumns.itemCopy.added'),
    value(transaction) {
      return transaction[0] ? moment(transaction[0].date).format('LL') : '';
    },
  },
  {
    key: 'sold',
    label: I18n.t('TableColumns.itemCopy.sold'),
    value(transaction) {
      return transaction[0] ? moment(transaction[0].date).format('LL') : '';
    },
  },
  {
    key: 'paid',
    label: I18n.t('TableColumns.itemCopy.paid'),
    value(transaction) {
      return transaction[0] ? moment(transaction[0].date).format('LL') : '';
    },
  },
  {
    key: 'price',
    label: I18n.t('TableColumns.itemCopy.price'),
    value(prix) {
      return `${prix} $`;
    },
  },
];
