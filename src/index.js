'use babel';

import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import App from './App';

moment.locale('fr');
moment.semester = () => {
  const session = moment().get('month') < 7 ? 'hiver' : 'automne';
  return `Session ${session} ${moment().get('y')}`;
};

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
