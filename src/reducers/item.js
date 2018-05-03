import createReducer from './reducerFactory';
import {
  DELETE_ITEM_SUCCESS,
  FETCH_ITEM_FAIL,
  FETCH_ITEM_PENDING,
  FETCH_ITEM_SUCCESS,
  RESERVE_ITEM_SUCCESS,
  UPDATE_STATUS_SUCCESS,
  UPDATE_STORAGE_SUCCESS,
} from '../actions/actionTypes';
import { Item } from '../lib/models';

const initialState = {
  id: 0,
  isLoading: false,
  item: new Item(),
};

const handlers = {
  [DELETE_ITEM_SUCCESS]: () => initialState,
  [FETCH_ITEM_FAIL]: state => ({
    ...state,
    isLoading: false,
  }),
  [FETCH_ITEM_PENDING]: state => ({
    ...state,
    isLoading: true,
    item: new Item(),
  }),
  [FETCH_ITEM_SUCCESS]: (state, { item }) => ({
    ...state,
    isLoading: false,
    item,
  }),
  [RESERVE_ITEM_SUCCESS]: (state, { reservation }) => {
    const item = state.item.clone();
    item.reservation.push(reservation);

    return {
      ...state,
      item,
    };
  },
  [UPDATE_STATUS_SUCCESS]: (state, { status }) => {
    const item = state.item.clone();
    item.updateStatus(status);

    return {
      ...state,
      item,
    };
  },
  [UPDATE_STORAGE_SUCCESS]: (state, action) => ({
    ...state,
    item: new Item({
      ...state.item,
      storage: action.storage,
    }),
  }),
};

export default createReducer(initialState, handlers);
