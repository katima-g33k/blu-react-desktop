import createReducer from './reducerFactory';
import API from '../lib/api';
import {
  RESET_LAST_ITEM_SCANNED,
  SET_LAST_ITEM_SCANNED,
} from '../actions/actionTypes';

const apiUrl = localStorage.getItem('apiUrl');
const apiKey = localStorage.getItem('apiKey');

const initialState = {
  apiClient: new API(apiUrl, apiKey),
  lastItemScanned: null,
};

const handlers = {
  [RESET_LAST_ITEM_SCANNED]: state => ({
    ...state,
    lastItemScanned: initialState.lastItemScanned,
  }),
  [SET_LAST_ITEM_SCANNED]: (state, action) => ({
    ...state,
    lastItemScanned: action.lastItemScanned,
  }),
};

export default createReducer(initialState, handlers);
