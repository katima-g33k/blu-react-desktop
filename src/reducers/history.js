import createReducer from './reducerFactory';
import {
  HISTORY_PUSH,
} from '../actions/actionTypes';

const initialState = {
  currentPath: '',
  history: ['/'],
};

const handlers = {
  [HISTORY_PUSH]: (state, { path }) => ({
    ...state,
    currentPath: path,
    history: [...state.history, path],
  }),
};

export default createReducer(initialState, handlers);
