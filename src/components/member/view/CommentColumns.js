import moment from 'moment';
import I18n from '../../../lib/i18n/i18n';

export default [
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
    dataFormat: date => moment(date).format('LL'),
  },
];
