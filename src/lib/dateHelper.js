import moment from 'moment';

export const formatLongDate = (date) => {
  if (date) {
    return moment(date).format('LL');
  }

  return '';
};

export const formatShortDate = (date) => {
  if (date) {
    return moment(date).format('YYYY-MM-DD');
  }

  return '';
};
