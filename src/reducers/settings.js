import createReducer from './reducerFactory';
import { UPDATE_SETTINGS_SUCCESS } from '../actions/actionTypes';

const initialState = {
  apiKey: localStorage.getItem('apiKey') || '',
  apiUrl: localStorage.getItem('apiUrl') || '',
  barcodeFirstChar: localStorage.getItem('barcodeFirstChar'),
  barcodeLastChar: localStorage.getItem('barcodeLastChar'),
  logLevel: localStorage.getItem('logLevel') || 'none',
  secretKey: localStorage.getItem('secretKey') || '',
};

const handlers = {
  [UPDATE_SETTINGS_SUCCESS]: (state, action) => {
    Object.keys(action.settings).forEach(key => localStorage.setItem(key, action.settings[key]));
    return {
      ...state,
      ...action.settings,
    };
  },
};

export default createReducer(initialState, handlers);
