import {
  CLOSE_MODAL,
  FETCH_MEMBER_FAIL,
  RENEW_MEMBER_FAIL,
  SEARCH_FAIL,
  OPEN_MODAL,
  UPDATE_MODAL_INPUT,
} from '../actions/actionTypes';

const initialState = {
  actions: [],
  cancelable: false,
  display: false,
  inputType: 'text',
  inputValue: '',
  message: '',
  title: '',
  type: 'info',
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
        inputType: action.inputType,
        inputValue: action.inputValue,
        message: action.message,
        title: action.title,
        type: action.modalType || 'info',
      };
    case FETCH_MEMBER_FAIL:
    case RENEW_MEMBER_FAIL:
    case SEARCH_FAIL:
      return {
        ...state,
        display: true,
        message: action.message,
        title: action.title,
        type: 'info',
      };
    case UPDATE_MODAL_INPUT:
      return {
        ...state,
        inputValue: action.inputValue,
      };
    default:
      return initialState;
  }
}
