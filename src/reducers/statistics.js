import createReducer from './reducerFactory';
import {
  FETCH_AMOUNT_DUE_SUCCESS,
  FETCH_STATISTICS_BY_INTERVAL_SUCCESS,
} from '../actions/actionTypes';

const initialState = {
  amountDue: 0,
  dataByInterval: {
    added: {
      amount: 0,
      quantity: 0,
    },
    paid: {
      amount: 0,
      quantity: 0,
    },
    sold: {
      amount: 0,
      quantity: 0,
    },
    soldParent: {
      amount: 0,
      quantity: 0,
      savings: 0,
    },
  },
};

const handlers = {
  [FETCH_AMOUNT_DUE_SUCCESS]: (state, action) => ({
    ...state,
    amountDue: action.amountDue,
  }),
  [FETCH_STATISTICS_BY_INTERVAL_SUCCESS]: (state, action) => ({
    ...state,
    dataByInterval: action.dataByInterval,
  }),
};

export default createReducer(initialState, handlers);
