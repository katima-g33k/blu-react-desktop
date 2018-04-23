import {
  FETCH_MEMBER_FAIL,
  FETCH_MEMBER_PENDING,
  FETCH_MEMBER_SUCCESS,
  OPEN_MODAL,
  PRINT_END,
  PRINT_START,
  PAY_MEMBER_FAIL,
  PAY_MEMBER_PENDING,
  PAY_MEMBER_SUCCESS,
  RENEW_MEMBER_FAIL,
  RENEW_MEMBER_PENDING,
  RENEW_MEMBER_SUCCESS,
} from './actionTypes';
import API from '../lib/api';
import I18n from '../lib/i18n';
import Copy from '../lib/models/Copy';
import Member from '../lib/models/Member';
import { setCopies } from './copyActions';

const apiUrl = localStorage.getItem('apiUrl');
const apiKey = localStorage.getItem('apiKey');
const apiClient = new API(apiUrl, apiKey);

const fetchMemberFail = error => ({
  message: error.message,
  title: I18n('modal.error', { code: error.code || 500 }),
  type: FETCH_MEMBER_FAIL,
});

const fetchMemberPending = () => ({
  type: FETCH_MEMBER_PENDING,
});

const fetchMemberSuccess = member => ({
  member,
  type: FETCH_MEMBER_SUCCESS,
});

export const fetchMember = no => async (dispatch) => {
  dispatch(fetchMemberPending());

  try {
    const member = new Member(await apiClient.member.get(no));
    dispatch(fetchMemberSuccess(member));
    dispatch(setCopies(member.account.copies));
  } catch (error) {
    dispatch(fetchMemberFail(error));
  }
};

const renewMemberFail = error => ({
  message: error.message,
  title: I18n('modal.error', { code: error.code || 500 }),
  type: RENEW_MEMBER_FAIL,
});

const renewMemberPending = () => ({
  type: RENEW_MEMBER_PENDING,
});

const renewMemberSuccess = () => ({
  type: RENEW_MEMBER_SUCCESS,
});

export const endPrinting = () => ({
  type: PRINT_END,
});

export const startPrinting = (amount = 0) => ({
  amount,
  type: PRINT_START,
});

const payMemberFail = error => ({
  message: error.message,
  title: I18n('modal.error', { code: error.code || 500 }),
  type: PAY_MEMBER_FAIL,
});

const payMemberPending = () => ({
  type: PAY_MEMBER_PENDING,
});

const payMemberSuccess = copies => ({
  copies,
  type: PAY_MEMBER_SUCCESS,
});

const openModal = (title, message) => ({
  message,
  title,
  type: OPEN_MODAL,
});

export const payMember = (member, printReceipt = false) => async (dispatch) => {
  dispatch(payMemberPending());

  try {
    await apiClient.member.pay(member.no);
    const { amount, copies } = member.account.copies.reduce((acc, copyData) => {
      const data = acc;
      const copy = new Copy(copyData);

      if (copy.isSold) {
        data.amount += copy.price;
        copy.pay();
      }

      data.copies.push(copy);
      return data;
    }, { amount: 0, copies: [] });

    dispatch(payMemberSuccess(copies));

    if (printReceipt) {
      dispatch(startPrinting(amount));
    }

    dispatch(openModal(
      I18n('MemberView.modal.paySuccessful.title'),
      I18n('MemberView.modal.paySuccessful.message', { amount }),
    ));
  } catch (error) {
    dispatch(payMemberFail(error));
  }
};

export const renewMember = no => async (dispatch) => {
  dispatch(renewMemberPending());

  try {
    await apiClient.member.renew(no);
    dispatch(renewMemberSuccess());
  } catch (error) {
    dispatch(renewMemberFail(error));
  }
};

export const openPayModal = member => (dispatch) => {
  dispatch({
    actions: [
      {
        label: I18n('MemberView.actions.printReceipt'),
        onClick: () => dispatch(payMember(member, true)),
      },
      {
        label: I18n('MemberView.actions.pay'),
        onClick: () => dispatch(payMember(member)),
      },
    ],
    cancelable: true,
    message: I18n('MemberView.modal.payConfirmation.message'),
    title: I18n('MemberView.modal.payConfirmation.title'),
    type: OPEN_MODAL,
  });
};

// TODO: Complete open delete modal
export const openDeleteModal = no => (dispatch) => {
  dispatch({
    actions: [{
      label: I18n('MemberView.modal.delete.action'),
      onClick: () => {},
      style: 'danger',
    }],
    cancelable: true,
    message: I18n('MemberView.modal.delete.message'),
    title: I18n('MemberView.modal.delete.title'),
    type: OPEN_MODAL,
  });
};

// TODO: Complete open reactivation modal
export const openReactivateModal = member => (dispatch) => {
  dispatch({
    actions: [
      {
        label: I18n('MemberView.modal.reactivate.actions.transfer'),
        onClick: () => {},
        style: 'danger',
      },
      {
        label: I18n('MemberView.modal.reactivate.actions.reactivate'),
        onClick: () => {},
      },
    ],
    cancelable: true,
    message: I18n('MemberView.modal.reactivate.message'),
    title: I18n('MemberView.modal.reactivate.title'),
    type: OPEN_MODAL,
  });
};

// TODO: Complete open transfer modal
export const openTransferModal = member => (dispatch) => {
  dispatch({
    actions: [{
      label: I18n('MemberView.modal.transfer.action'),
      onClick: () => {},
    }],
    cancelable: true,
    message: I18n('MemberView.modal.transfer.message'),
    title: I18n('MemberView.modal.transfer.title'),
    type: OPEN_MODAL,
  });
};
