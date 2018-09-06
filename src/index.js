'use babel';

import 'babel-core/register';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import moment from 'moment';

import './lib/semester';
import './lib/capitalize';
import App from './containers/AppContainer';
import store from './reducers/store';

moment.locale('fr');

const container = document.getElementById('app');
const component = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(component, container);
