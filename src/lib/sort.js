import moment from 'moment';

export const sortDate = (a, b, order) => {
  if (b === '' || moment(a).isBefore(b)) {
    return order === 'asc' ? -1 : 1;
  }

  if (a === '' || moment(a).isAfter(b)) {
    return order === 'asc' ? 1 : -1;
  }

  return 0;
};

export const sortString = (a, b, order) => {
  if (order === 'asc') {
    return `${a}`.localeCompare(`${b}`);
  }

  return `${b}`.localeCompare(`${a}`);
};

export const sortNumber = (a, b, order) => {
  if (order === 'asc') {
    return a - b;
  }

  return b - a;
};
