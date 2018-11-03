import {
  SELL_COPY_FAIL,
  SELL_COPY_PENDING,
  SELL_COPY_SUCCESS,
} from '../actionTypes';
import { Copy, Transaction } from '../../lib/models';

const pending = () => ({
  type: SELL_COPY_PENDING,
});

const success = copy => ({
  copy,
  type: SELL_COPY_SUCCESS,
});

const fail = error => ({
  error,
  type: SELL_COPY_FAIL,
});

export default (api, copy, memberNo, halfPrice) => async (dispatch) => {
  dispatch(pending());
  const transactionType = halfPrice ? Transaction.TYPES.SELL_PARENT : Transaction.TYPES.SELL;

  try {
    await api.member.copy.transaction.insert(memberNo, copy.id, transactionType);
    const soldCopy = new Copy(copy);

    if (halfPrice) {
      soldCopy.sellParent();
    } else {
      soldCopy.sell();
    }

    dispatch(success(soldCopy));
  } catch (error) {
    dispatch(fail(error));
  }
};
