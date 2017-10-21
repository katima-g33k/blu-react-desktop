'use babel';

import 'babel-core/register';
import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import './lib/semester';

import App from './App';

moment.locale('fr');

ReactDOM.render(
  <App />,
  document.getElementById('app'),
);
