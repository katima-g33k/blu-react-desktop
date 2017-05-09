import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import './style.css';
import './react-bootstrap-table-all.min.css';

import App from './App';

moment.locale('fr');

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
