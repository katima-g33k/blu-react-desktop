import {
  CANCEL_SELL_FAIL,
  CANCEL_SELL_PENDING,
  CANCEL_SELL_SUCCESS,
} from '../actionTypes';
import { Copy, Transaction } from '../../lib/models';

const pending = () => ({
  type: CANCEL_SELL_PENDING,
});

const success = copy => ({
  copy,
  type: CANCEL_SELL_SUCCESS,
});

const fail = error => ({
  error,
  type: CANCEL_SELL_FAIL,
});

export default (api, copy) => async (dispatch) => {
  dispatch(pending());

  try {
    await api.member.copy.transaction.delete(copy.id, Transaction.TYPES.SELL);

    const refundedCopy = new Copy(copy);
    refundedCopy.refund();

    dispatch(success(refundedCopy));
  } catch (error) {
    dispatch(fail(error));
  }
};
