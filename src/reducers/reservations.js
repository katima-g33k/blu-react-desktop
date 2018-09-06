import createReducer from './reducerFactory';
import {
  CLEAR_RESERVATIONS_SUCCESS,
  FETCH_RESERVATIONS_SUCCESS,
} from '../actions/actionTypes';

const initialState = {
  reservations: [],
};

const handlers = {
  [CLEAR_RESERVATIONS_SUCCESS]: () => initialState,
  [FETCH_RESERVATIONS_SUCCESS]: (state, action) => ({
    reservations: action.reservations,
  }),
};

export default createReducer(initialState, handlers);
