import createReducer from './reducerFactory';
import {
  FETCH_SUBJECTS_SUCCESS,
} from '../actions/actionTypes';

const initialState = {
  subjectsByCategory: [],
};

const handlers = {
  [FETCH_SUBJECTS_SUCCESS]: (state, action) => ({
    subjectsByCategory: action.subjectsByCategory,
  }),
};

export default createReducer(initialState, handlers);
