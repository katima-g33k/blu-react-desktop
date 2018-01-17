import {
  CLOSE_MODAL,
  FETCH_MEMBER_FAIL,
  RENEW_MEMBER_FAIL,
  SEARCH_FAIL,
  OPEN_MODAL,
  PAY_MEMBER_SUCCESS,
} from '../actions/actionTypes';

const initialState = {
  actions: [],
  cancelable: false,
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
    case OPEN_MODAL:
      return {
        ...state,
        actions: action.actions,
        cancelable: action.cancelable,
        display: true,
        message: action.message,
        title: action.title,
      };
    case FETCH_MEMBER_FAIL:
    case RENEW_MEMBER_FAIL:
    case SEARCH_FAIL:
      return {
        ...state,
        display: true,
        message: action.message,
        title: action.title,
      };
    default:
      return initialState;
  }
}
