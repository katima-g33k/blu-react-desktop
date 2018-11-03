import {
  PAY_MEMBER_FAIL,
  PAY_MEMBER_PENDING,
  PAY_MEMBER_SUCCESS,
} from '../actionTypes';

import { Copy } from '../../lib/models';
import i18n from '../../lib/i18n';
import { open as openModal } from '../modalActions';
import { startPrinting } from './printing';

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

const pending = () => ({
  type: PAY_MEMBER_PENDING,
});

const fail = error => ({
  error,
  type: PAY_MEMBER_FAIL,
});

const success = (amount, copies) => ({
  amount,
  copies,
  type: PAY_MEMBER_SUCCESS,
});

export default (api, member, printReceipt) => async (dispatch) => {
  dispatch(pending());

  try {
    await api.member.pay(member.no);
    const { amount, copies } = getPaidCopyData(member.account.copies);

    dispatch(success(amount, copies));

    if (printReceipt) {
      dispatch(startPrinting(amount));
    }

    dispatch(openModal({
      actions: [{
        label: i18n('actions.ok'),
        onClick() {},
        style: 'primary',
      }],
      message: i18n('MemberView.modal.paySuccessful.message', { amount }),
      title: i18n('MemberView.modal.paySuccessful.title'),
    }));
  } catch (error) {
    dispatch(fail(error));
  }
};
