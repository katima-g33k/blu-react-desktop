import API from '../../lib/api';
import { Copy } from '../../lib/models';
import I18n from '../../lib/i18n';
import { open } from '../modalActions';
import {
  PAY_MEMBER_FAIL,
  PAY_MEMBER_PENDING,
  PAY_MEMBER_SUCCESS,
} from '../actionTypes';
import { startPrinting } from './printing';

const apiUrl = localStorage.getItem('apiUrl');
const apiKey = localStorage.getItem('apiKey');
const apiClient = new API(apiUrl, apiKey);

const getPaidCopyData = copies => copies.reduce((acc, copyData) => {
  const data = acc;
  const copy = new Copy(copyData);

  if (copy.isSold) {
    data.amount += copy.price;
    copy.pay();
  }

  data.copies.push(copy);
  return data;
}, { amount: 0, copies: [] });

const fail = error => ({
  message: error.message,
  title: I18n('modal.error', { code: error.code || 500 }),
  type: PAY_MEMBER_FAIL,
});

const pending = () => ({
  type: PAY_MEMBER_PENDING,
});

const success = copies => ({
  copies,
  type: PAY_MEMBER_SUCCESS,
});

export default (member, printReceipt = false) => async (dispatch) => {
  dispatch(pending());

  try {
    await apiClient.member.pay(member.no);
    const { amount, copies } = getPaidCopyData(member.account.copies);

    dispatch(success(copies));

    if (printReceipt) {
      dispatch(startPrinting(amount));
    }

    dispatch(open(
      I18n('MemberView.modal.paySuccessful.title'),
      I18n('MemberView.modal.paySuccessful.message', { amount }),
    ));
  } catch (error) {
    dispatch(fail(error));
  }
};
