import createReducer from './reducerFactory';
import {
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
} from '../actions/actionTypes';

const initialState = {
  user: sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null,
};

const handlers = {
  [LOGIN_SUCCESS]: (state, { user }) => {
    sessionStorage.setItem('user', JSON.stringify(user));

    return {
      ...state,
      user,
    };
  },
  [LOGOUT_SUCCESS]: (state) => {
    sessionStorage.removeItem('user');

    return {
      ...state,
      user: null,
    };
  },
};

export default createReducer(initialState, handlers);
