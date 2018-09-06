import moment from 'moment';

import {
  FETCH_AMOUNT_DUE_FAIL,
  FETCH_AMOUNT_DUE_PENDING,
  FETCH_AMOUNT_DUE_SUCCESS,
} from '../actionTypes';

const pending = () => ({
  type: FETCH_AMOUNT_DUE_PENDING,
});

const success = amountDue => ({
  amountDue,
  type: FETCH_AMOUNT_DUE_SUCCESS,
});


const fail = error => ({
  error,
  type: FETCH_AMOUNT_DUE_FAIL,
});

export default (date, api) => async (dispatch) => {
  dispatch(pending());

  try {
    const { amount } = await api.statistics.amountDue(moment(date).format('YYYY-MM-DD'));
    dispatch(success(amount));
  } catch (error) {
    dispatch(fail(error));
  }
};
