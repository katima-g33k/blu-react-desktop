import createReducer from './reducerFactory';
import { Employee } from '../lib/models';
import {
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
} from '../actions/actionTypes';

const initialState = {
  user: new Employee(sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : {}),
};

const handlers = {
  [LOGIN_SUCCESS]: (state, { user }) => {
    sessionStorage.setItem('user', JSON.stringify(user));

    return {
      ...state,
      user,
    };
  },
  [LOGOUT_SUCCESS]: () => {
    sessionStorage.removeItem('user');
    return initialState;
  },
};

export default createReducer(initialState, handlers);
