import {
  SEARCH_FAIL,
  SEARCH_PENDING,
  SEARCH_SUCCESS,
  UPDATE_ARCHIVES,
  UPDATE_SEARCH_VALUE,
  UPDATE_TYPE,
} from '../actions/actionTypes';

const initialState = {
  archives: false,
  data: [],
  isLoading: false,
  type: 'member',
  value: '',
};

export default function searchReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SEARCH_FAIL:
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };
    case SEARCH_PENDING:
      return {
        ...state,
        isLoading: true,
        error: '',
      };
    case SEARCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: '',
        data: action.data,
      };
    case UPDATE_ARCHIVES:
      return {
        ...state,
        archives: !state.archives,
      };
    case UPDATE_TYPE:
      return {
        ...state,
        data: [],
        type: action.searchType,
        value: '',
      };
    case UPDATE_SEARCH_VALUE:
      return {
        ...state,
        value: action.value,
      };
    default:
      return state;
  }
}
