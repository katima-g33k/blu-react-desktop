import API from '../../lib/api';
import Copy from '../../lib/models/Copy';
import {
  SELL_COPY_FAIL,
  SELL_COPY_PENDING,
  SELL_COPY_SUCCESS,
} from '../actionTypes';
import Transaction from '../../lib/models/Transaction';

const apiUrl = localStorage.getItem('apiUrl');
const apiKey = localStorage.getItem('apiKey');
const apiClient = new API(apiUrl, apiKey);

const sellCopyFail = error => ({
  error,
  type: SELL_COPY_FAIL,
});

const sellCopyPending = () => ({
  type: SELL_COPY_PENDING,
});

const sellCopySuccess = copy => ({
  copy,
  type: SELL_COPY_SUCCESS,
});

export default (copy, memberNo, halfPrice) => async (dispatch) => {
  dispatch(sellCopyPending());

  const soldCopy = new Copy(copy);
  const transactionType = halfPrice ? Transaction.TYPES.SELL_PARENT : Transaction.TYPES.SELL;

  try {
    await apiClient.member.copy.transaction.insert(memberNo, copy.id, transactionType);

    if (halfPrice) {
      soldCopy.sellParent();
    } else {
      soldCopy.sell();
    }

    dispatch(sellCopySuccess(soldCopy));
  } catch (error) {
    dispatch(sellCopyFail(error));
  }
};
