import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

import highlightSearchResults from '../../../lib/highlightSearchResults';
import I18n from '../../../lib/i18n/i18n';

const formatDate = (date) => {
  if (date) {
    return moment(date).format('YYYY-MM-DD');
  }

  return '';
};

const link = (href, label) => (
  <Link
    to={{ pathname: href }}
    dangerouslySetInnerHTML={{ __html: label }}
  />
);

export default [
  {
    dataField: 'id',
    isKey: true,
    hidden: true,
  },
  {
    dataField: 'member',
    label: I18n.t('TableColumns.itemCopy.member'),
    dataSort: true,
    defaultSort: true,
    tdStyle: { whiteSpace: 'normal' },
    itemOnly: true,
    formatExtraData: { props: ['highlight'] },
    dataFormat: (member, copy, extra = {}) => {
      const label = `${copy.isDonated ? 'BLU - ' : ''}${copy.member.name}`;
      return link(`/member/view/${member.no}`, highlightSearchResults(label, extra.highlight));
    },
    sortFunc: (a, b, order) => {
      if (a.member.name < b.member.name) {
        return order === 'asc' ? -1 : 1;
      }

      if (a.member.name > b.member.name) {
        return order === 'asc' ? 1 : -1;
      }

      return 0;
    },
  },
  {
    dataField: 'name',
    label: I18n.t('TableColumns.memberCopy.title'),
    dataSort: true,
    defaultSort: true,
    tdStyle: { whiteSpace: 'normal' },
    memberOnly: true,
    formatExtraData: { props: ['highlight'] },
    dataFormat: (cell, { item }, extra = {}) => {
      const label = highlightSearchResults(item.name, extra.highlight);
      return link(`/item/view/${item.id}`, label);
    },
    sortFunc: (a, b, order) => {
      if (a.item.name < b.item.name) {
        return order === 'asc' ? -1 : 1;
      }

      if (a.item.name > b.item.name) {
        return order === 'asc' ? 1 : -1;
      }

      return 0;
    },
  },
  {
    dataField: 'editor',
    label: I18n.t('TableColumns.memberCopy.editor'),
    tdStyle: { whiteSpace: 'normal' },
    width: '170px',
    dataSort: true,
    memberOnly: true,
    formatExtraData: { props: ['highlight'] },
    dataFormat: (cell, { item }, extra = {}) =>
      highlightSearchResults(item.editor, extra.highlight),
    sortFunc: (a, b, order) => {
      if (a.item.editor < b.item.editor) {
        return order === 'asc' ? -1 : 1;
      }

      if (a.item.editor > b.item.editor) {
        return order === 'asc' ? 1 : -1;
      }

      return 0;
    },
  },
  {
    dataField: 'edition',
    label: I18n.t('TableColumns.memberCopy.edition'),
    dataSort: true,
    width: '85px',
    memberOnly: true,
    dataFormat: (cell, { item }) => item.edition,
    sortFunc: (a, b, order) => {
      if (order === 'asc') {
        return a.item.edition - b.item.edition;
      }
      return b.item.edition - a.item.edition;
    },
  },
  {
    dataField: 'dateAdded',
    label: I18n.t('TableColumns.memberCopy.added'),
    dataSort: true,
    width: '120px',
    dataFormat: date => formatDate(date),
    sortFunc: (a, b, order) => {
      if (moment(a.dateAdded).isBefore(b.dateAdded)) {
        return order === 'asc' ? -1 : 1;
      }

      if (moment(a.dateAdded).isAfter(b.dateAdded)) {
        return order === 'asc' ? 1 : -1;
      }

      return 0;
    },
  },
  {
    dataField: 'dateSold',
    label: I18n.t('TableColumns.memberCopy.sold'),
    dataSort: true,
    width: '120px',
    dataFormat: date => formatDate(date),
    sortFunc: (a, b, order) => {
      if (b.dateSold === '' || moment(a.dateSold).isBefore(b.dateSold)) {
        return order === 'asc' ? -1 : 1;
      }

      if (a.dateSold === '' || moment(a.dateSold).isAfter(b.dateSold)) {
        return order === 'asc' ? 1 : -1;
      }

      return 0;
    },
  },
  {
    dataField: 'datePaid',
    label: I18n.t('TableColumns.memberCopy.paid'),
    dataSort: true,
    width: '120px',
    dataFormat: date => formatDate(date),
    sortFunc: (a, b, order) => {
      if (b.datePaid === '' || moment(a.datePaid).isBefore(b.datePaid)) {
        return order === 'asc' ? -1 : 1;
      }

      if (a.datePaid === '' || moment(a.datePaid).isAfter(b.datePaid)) {
        return order === 'asc' ? 1 : -1;
      }

      return 0;
    },
  },
  {
    dataField: 'priceString',
    label: I18n.t('TableColumns.memberCopy.price'),
    dataSort: true,
    width: '60px',
    sortFunc: (a, b, order) => {
      if (order === 'asc') {
        return b.price - a.price;
      }

      return a.price - b.price;
    },
  },
  {
    dataField: 'actions',
    label: '',
    dataAlign: 'center',
    width: '175px',
  },
];
