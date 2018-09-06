import createReducer from './reducerFactory';
import {
  CLEAR_STORAGE_SUCCESS,
  FETCH_STORAGE_SUCCESS,
} from '../actions/actionTypes';

const initialState = {
  storage: [],
};

const handlers = {
  [CLEAR_STORAGE_SUCCESS]: () => initialState,
  [FETCH_STORAGE_SUCCESS]: (state, action) => ({
    storage: action.storage,
  }),
};

export default createReducer(initialState, handlers);
