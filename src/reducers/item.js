import {
  FETCH_ITEM_FAIL,
  FETCH_ITEM_PENDING,
  FETCH_ITEM_SUCCESS,
} from '../actions/actionTypes';
import { Item } from '../lib/models';

const initialState = {
  id: 0,
  isLoading: false,
  item: new Item(),
};

export default function itemReducer(state = initialState, action = {}) {
  switch (action.type) {
    case FETCH_ITEM_FAIL:
      return {
        ...state,
        isLoading: false,
      };
    case FETCH_ITEM_PENDING:
      return {
        ...state,
        isLoading: true,
        item: new Item(),
      };
    case FETCH_ITEM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        item: new Item(action.item),
      };
    default:
      return state;
  }
}
