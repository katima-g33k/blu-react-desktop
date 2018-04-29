import createReducer from './reducerFactory';
import {
  FETCH_ITEM_FAIL,
  FETCH_ITEM_PENDING,
  FETCH_ITEM_SUCCESS,
  UPDATE_STATUS_SUCCESS,
} from '../actions/actionTypes';
import { Item } from '../lib/models';

const initialState = {
  id: 0,
  isLoading: false,
  item: new Item(),
};

const handlers = {
  [FETCH_ITEM_FAIL]: state => ({
    ...state,
    isLoading: false,
  }),
  [FETCH_ITEM_PENDING]: state => ({
    ...state,
    isLoading: true,
    item: new Item(),
  }),
  [FETCH_ITEM_SUCCESS]: (state, action) => ({
    ...state,
    isLoading: false,
    item: new Item(action.item),
  }),
  [UPDATE_STATUS_SUCCESS]: (state, action) => {
    const item = new Item(state.item);
    item.updateStatus(action.status);

    return {
      ...state,
      item,
    };
  },
};

export default createReducer(initialState, handlers);
