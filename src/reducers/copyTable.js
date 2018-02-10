import {
  UPDATE_COPY_TABLE_FILTER,
} from '../actions/actionTypes';

const initialState = {
  filters: {
    added: true,
    sold: true,
    reserved: true,
    paid: true,
    search: '',
  },
};

export default function copyTableReducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE_COPY_TABLE_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.filter]: action.value,
        },
      };
    default:
      return state;
  }
}
