import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import I18n from './i18n/i18n';

const formatDate = date => moment(date).format('YYYY-MM-DD');

const highlightResults = (cell, row, extra = {}) => {
  const regex = new RegExp(`(${extra.highlight})`, 'i');

  return cell.split(regex).map((string) => {
    return regex.test(string) ? `<span class="highlight">${string}</span>` : string;
  }).join('');
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
    tdStyle: { whiteSpace: 'normal' },
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
    tdStyle: { whiteSpace: 'normal' },
    width: '170px',
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
    width: '85px',
    memberOnly: true,
    dataFormat(cell, row) {
      return row.item.edition || '';
    },
  },
  {
    dataField: 'dateAdded',
    label: I18n.t('TableColumns.memberCopy.added'),
    dataSort: true,
    width: '120px',
    dataFormat(date) {
      return date ? formatDate(date) : '';
    },
  },
  {
    dataField: 'dateSold',
    label: I18n.t('TableColumns.memberCopy.sold'),
    dataSort: true,
    width: '120px',
    dataFormat(date) {
      return date ? formatDate(date) : '';
    },
  },
  {
    dataField: 'datePaid',
    label: I18n.t('TableColumns.memberCopy.paid'),
    dataSort: true,
    width: '120px',
    dataFormat(date) {
      return date ? formatDate(date) : '';
    },
  },
  {
    dataField: 'priceString',
    label: I18n.t('TableColumns.memberCopy.price'),
    dataSort: true,
    width: '60px',
  },
  {
    dataField: 'actions',
    label: '',
    dataAlign: 'center',
    width: '175px',
  },
];
