'use babel';

import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import './lib/semester';

import App from './App';

moment.locale('fr');

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
