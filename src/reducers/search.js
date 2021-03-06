import {
  CANCEL_SEARCH,
  RESET_SEARCH,
  RESET_STORES,
  SEARCH_FAIL,
  SEARCH_PENDING,
  SEARCH_SUCCESS,
  SET_RESULT_ON_CLICK,
  UPDATE_ARCHIVES,
  UPDATE_SEARCH_VALUE,
  UPDATE_TYPE,
} from '../actions/actionTypes';

const initialState = {
  archives: false,
  data: [],
  isCancelled: false,
  isLoading: false,
  type: 'member',
  value: '',
};

export default function searchReducer(state = initialState, action = {}) {
  const { Instance } = action;

  switch (action.type) {
    case CANCEL_SEARCH:
      return {
        ...state,
        data: [],
        isCancelled: true,
        isLoading: false,
      };
    case RESET_SEARCH:
    case RESET_STORES:
      return initialState;
    case SEARCH_FAIL:
      return {
        ...state,
        isCancelled: false,
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
        isCancelled: false,
        isLoading: false,
        data: state.isCancelled ? [] : action.data.map(row => new Instance(row)),
      };
    case SET_RESULT_ON_CLICK:
      return {
        ...state,
        onRowClick: action.onRowClick,
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
