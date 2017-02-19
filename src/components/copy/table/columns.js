import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

import I18n from '../../../lib/i18n/i18n';

const formatDate = date => date ? moment(date).format('YYYY-MM-DD') : '';
const link = (href, label) => (<Link to={{ pathname: href }}>{label}</Link>);

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
    itemOnly: true,
    dataFormat: (cell) => link(`/member/view/${cell.no}`, cell.name),
  },
  {
    dataField: 'name',
    label: I18n.t('TableColumns.memberCopy.title'),
    dataSort: true,
    tdStyle: { whiteSpace: 'normal' },
    memberOnly: true,
    dataFormat: (cell, row) => link(`/item/view/${row.item.id}`, row.item.name),
  },
  {
    dataField: 'editor',
    label: I18n.t('TableColumns.memberCopy.editor'),
    tdStyle: { whiteSpace: 'normal' },
    width: '170px',
    dataSort: true,
    memberOnly: true,
    dataFormat: (cell, row) => row.item.editor,
  },
  {
    dataField: 'edition',
    label: I18n.t('TableColumns.memberCopy.edition'),
    dataSort: true,
    width: '85px',
    memberOnly: true,
    dataFormat: (cell, row) => row.item.edition,
  },
  {
    dataField: 'dateAdded',
    label: I18n.t('TableColumns.memberCopy.added'),
    dataSort: true,
    width: '120px',
    dataFormat: date => formatDate(date),
  },
  {
    dataField: 'dateSold',
    label: I18n.t('TableColumns.memberCopy.sold'),
    dataSort: true,
    width: '120px',
    dataFormat: date => formatDate(date),
  },
  {
    dataField: 'datePaid',
    label: I18n.t('TableColumns.memberCopy.paid'),
    dataSort: true,
    width: '120px',
    dataFormat: date => formatDate(date),
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
