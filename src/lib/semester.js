import moment from 'moment';

const FIRST_SEMESTER = {
  code: 'A09',
  name: 'Automne 2009',
};

function getNextSemester(previous) {
  if (previous === moment.semester('code')) {
    return null;
  }

  const seasonCode = previous.substr(0, 1);
  const yearCode = +previous.substr(1);

  const nextSemester = seasonCode === 'A' ? 'Hiver' : 'Automne';
  const nextSeasonCode = seasonCode === 'A' ? 'H' : 'A';
  const nextYearCode = seasonCode === 'A' ? yearCode + 1 : yearCode;

  return {
    code: `${nextSeasonCode}${nextYearCode < 10 ? '0' : ''}${nextYearCode}`,
    name: `${nextSemester} ${moment(nextYearCode, 'YY').get('y')}`,
  };
}

function getSemesterList() {
  const semesters = [FIRST_SEMESTER];

  let nextSemester = getNextSemester(FIRST_SEMESTER.code);

  while (nextSemester) {
    semesters.push(nextSemester);
    nextSemester = getNextSemester(nextSemester.code);
  }

  return semesters;
}

moment.semester = (data) => {
  const year = moment().get('y');
  switch (data) {
    case 'start':
      return moment(`${year}-${moment().get('month') < 7 ? '01' : '08'}-01`);
    case 'end':
      return moment(`${year}-${moment().get('month') < 7 ? '07' : '12'}-31`);
    case 'list':
      return getSemesterList();
    case 'code':
      return `${moment().get('month') < 7 ? 'H' : 'A'}${moment().format('YY')}`;
    case 'name':
    default:
      return `Session ${moment().get('month') < 7 ? 'hiver' : 'automne'} ${year}`;
  }
};
