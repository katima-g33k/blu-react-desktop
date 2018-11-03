import moment from 'moment';

const LONG_DATE_FORMAT = 'LL';
const SHORT_DATE_FORMAT = 'YYYY-MM-DD';

const formatDate = (date, format) => (date ? moment(date).format(format) : '');

export const formatLongDate = date => formatDate(date, LONG_DATE_FORMAT);
export const formatShortDate = date => formatDate(date, SHORT_DATE_FORMAT);
