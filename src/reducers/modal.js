import {
  CLOSE_MODAL,
  FETCH_MEMBER_FAIL,
  RENEW_MEMBER_FAIL,
  SEARCH_FAIL,
  OPEN_MODAL,
  UPDATE_MODAL_INPUT,
} from '../actions/actionTypes';
import I18n from '../lib/i18n';

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
      return initialState;
    case OPEN_MODAL:
      return {
        ...action,
        display: true,
        message: action.messageKey ? I18n(action.messageKey, action.messageOptions) : action.message,
        title: action.titleKey ? I18n(action.titleKey, action.titleOptions) : action.title,
        type: action.modalType || 'info',
      };
    case FETCH_MEMBER_FAIL:
    case RENEW_MEMBER_FAIL:
    case SEARCH_FAIL:
      return {
        ...state,
        display: true,
        message: action.message || I18n(action.messageKey, action.messageOptions),
        title: action.title || I18n(action.titleKey, action.titleOptions),
        type: 'info',
      };
    case UPDATE_MODAL_INPUT:
      return {
        ...state,
        inputValue: action.inputValue,
      };
    default:
      return state;
  }
}
