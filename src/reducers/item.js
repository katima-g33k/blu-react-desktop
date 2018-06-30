import createReducer from './reducerFactory';
import {
  DELETE_ITEM_SUCCESS,
  DELETE_RESERVATION_SUCCESS,
  FETCH_ITEM_FAIL,
  FETCH_ITEM_PENDING,
  FETCH_ITEM_SUCCESS,
  INSERT_ITEM_SUCCESS,
  RESERVE_ITEM_SUCCESS,
  UPDATE_ITEM_SUCCESS,
  UPDATE_STATUS_SUCCESS,
  UPDATE_STORAGE_SUCCESS,
} from '../actions/actionTypes';
import { Item } from '../lib/models';

const initialState = {
  id: 0,
  isLoading: false,
  item: new Item({ isBook: true }),
};

const handlers = {
  [DELETE_ITEM_SUCCESS]: () => initialState,
  [DELETE_RESERVATION_SUCCESS]: (state, action) => {
    const item = state.item.clone();

    if (action.reservation.copy) {
      item.copies.find(copy => copy.id === action.reservation.copy.id).cancelReservation();
    } else {
      item.reservation = item.reservation.filter(reservation => reservation.id !== action.reservation.id);
    }

    return {
      ...state,
      item,
    };
  },
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
  [INSERT_ITEM_SUCCESS]: (state, { item }) => ({
    ...state,
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
  [UPDATE_ITEM_SUCCESS]: (state, { item }) => ({
    ...state,
    item,
  }),
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
