import createReducer from './reducerFactory';
import { FETCH_STATES_SUCCESS } from '../actions/actionTypes';

const initialState = {
  states: [],
};

const handlers = {
  [FETCH_STATES_SUCCESS]: (state, action) => ({
    states: action.states,
  }),
};

export default createReducer(initialState, handlers);
