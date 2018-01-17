import moment from 'moment';

export const formatLongDate = (date) => {
  if (date) {
    return moment(date).format('LL');
  }

  return '';
};
