import {
  CLOSE_MODAL,
  SEARCH_FAIL,
} from '../actions/actionTypes';

const initialState = {
  display: false,
  message: '',
  title: '',
};

export default function modalReducer(state = initialState, action = {}) {
  switch (action.type) {
    case CLOSE_MODAL:
      return {
        ...state,
        display: false,
        message: '',
        title: '',
      };
    case SEARCH_FAIL:
      return {
        ...state,
        display: true,
        message: action.message,
        title: action.title,
      };
    default:
      return state;
  }
}
