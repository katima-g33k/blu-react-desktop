import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import I18n from './i18n/i18n';

const formatDate = (date) => {
  return moment(date).format('YYYY-MM-DD');
};

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
    dataField: 'updatedAt',
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
      hidden: true,
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

export const CopyColumns = [
  {
    dataField: 'id',
    isKey: true,
    hidden: true,
  },
  {
    dataField: 'member',
    label: I18n.t('TableColumns.itemCopy.member'),
    dataSort: true,
    width: '400',
    itemOnly: true,
    dataFormat(cell) {
      return (
        <Link to={{ pathname: `/member/view/${cell.no}` }}>
          {cell.name}
        </Link>);
    },
  },
  {
    dataField: 'name',
    label: I18n.t('TableColumns.memberCopy.title'),
    dataSort: true,
    width: '400',
    memberOnly: true,
    dataFormat(cell, row) {
      return (
        <Link to={{ pathname: `/item/view/${row.item.id}` }}>
          {row.item.name}
        </Link>);
    },
  },
  {
    dataField: 'editor',
    label: I18n.t('TableColumns.memberCopy.editor'),
    dataSort: true,
    memberOnly: true,
    dataFormat(cell, row) {
      return row.item.editor || '';
    },
  },
  {
    dataField: 'edition',
    label: I18n.t('TableColumns.memberCopy.edition'),
    dataSort: true,
    width: '85',
    memberOnly: true,
    dataFormat(cell, row) {
      return row.item.edition || '';
    },
  },
  {
    dataField: 'dateAdded',
    label: I18n.t('TableColumns.memberCopy.added'),
    dataSort: true,
    width: '150',
    dataFormat(date) {
      return date ? formatDate(date) : '';
    },
  },
  {
    dataField: 'dateSold',
    label: I18n.t('TableColumns.memberCopy.sold'),
    dataSort: true,
    width: '150',
    dataFormat(date) {
      return date ? formatDate(date) : '';
    },
  },
  {
    dataField: 'datePaid',
    label: I18n.t('TableColumns.memberCopy.paid'),
    dataSort: true,
    width: '150',
    dataFormat(date) {
      return date ? formatDate(date) : '';
    },
  },
  {
    dataField: 'priceString',
    label: I18n.t('TableColumns.memberCopy.price'),
    dataSort: true,
    width: '60',
  },
  {
    dataField: 'actions',
    label: '',
    dataAlign: 'center',
    width: '175',
  },
];
