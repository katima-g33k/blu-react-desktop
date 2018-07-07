import createReducer from './reducerFactory';
import { UPDATE_SETTINGS_SUCCESS } from '../actions/actionTypes';

const initialState = {
  apiKey: localStorage.getItem('apiKey'),
  apiUrl: localStorage.getItem('apiUrl'),
  barcodeFirstChar: localStorage.getItem('barcodeFirstChar'),
  barcodeLastChar: localStorage.getItem('barcodeLastChar'),
  logLevel: localStorage.getItem('logLevel') || 'none',
  secretKey: localStorage.getItem('secretKey'),
};

const handlers = {
  [UPDATE_SETTINGS_SUCCESS]: (state, action) => ({
    ...state,
    ...Object.keys(action.settings).reduce((acc, key) => {
      if (state.hasOwnProperty(key)) {
        localStorage.setItem(key, action.settings[key]);

        return {
          ...acc,
          [key]: action[key],
        };
      }

      return acc;
    }, {}),
  }),
};

export default createReducer(initialState, handlers);
