import API from '../../lib/api';
import Copy from '../../lib/models/Copy';
import {
  CANCEL_SELL_FAIL,
  CANCEL_SELL_PENDING,
  CANCEL_SELL_SUCCESS,
} from '../actionTypes';
import Transaction from '../../lib/models/Transaction';

const apiUrl = localStorage.getItem('apiUrl');
const apiKey = localStorage.getItem('apiKey');
const apiClient = new API(apiUrl, apiKey);

const cancelPending = () => ({
  type: CANCEL_SELL_PENDING,
});

const cancelFail = error => ({
  error,
  type: CANCEL_SELL_FAIL,
});

const cancelSuccess = copy => ({
  copy,
  type: CANCEL_SELL_SUCCESS,
});

export default copy => async (dispatch) => {
  dispatch(cancelPending());

  try {
    await apiClient.member.copy.transaction.delete(copy.id, Transaction.TYPES.SELL);

    const refundedCopy = new Copy(copy);
    refundedCopy.refund();

    dispatch(cancelSuccess(refundedCopy));
  } catch (error) {
    dispatch(cancelFail(error));
  }
};
