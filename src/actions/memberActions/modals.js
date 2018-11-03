import { OPEN_MODAL } from '../actionTypes';
import i18n from '../../lib/i18n';
import { historyPush } from '../routeActions';
import merge from './merge';
import pay from './pay';
import remove from './remove';

export const openPayModal = (api, member) => (dispatch) => {
  dispatch({
    actions: [
      {
        label: i18n('MemberView.actions.printReceipt'),
        onClick: () => dispatch(pay(api, member, true)),
      },
      {
        label: i18n('MemberView.actions.pay'),
        onClick: () => dispatch(pay(api, member)),
      },
    ],
    cancelable: true,
    messageKey: 'MemberView.modal.payConfirmation.message',
    titleKey: 'MemberView.modal.payConfirmation.title',
    type: OPEN_MODAL,
  });
};

export const openDeleteModal = (api, no) => (dispatch) => {
  dispatch({
    actions: [{
      label: i18n('MemberView.modal.delete.action'),
      onClick: () => dispatch(remove(api, no)),
      style: 'danger',
    }],
    cancelable: true,
    messageKey: 'MemberView.modal.delete.message',
    titleKey: 'MemberView.modal.delete.title',
    type: OPEN_MODAL,
  });
};

// TODO: Complete open reactivation modal
// eslint-disable-next-line
export const openReactivateModal = member => (dispatch) => {
  dispatch({
    actions: [
      {
        label: i18n('MemberView.modal.reactivate.actions.transfer'),
        onClick: () => {},
        style: 'danger',
      },
      {
        label: i18n('MemberView.modal.reactivate.actions.reactivate'),
        onClick: () => {},
      },
    ],
    cancelable: true,
    messageKey: 'MemberView.modal.reactivate.message',
    titleKey: 'MemberView.modal.reactivate.title',
    type: OPEN_MODAL,
  });
};

// TODO: Complete open transfer modal
// eslint-disable-next-line
export const openTransferModal = member => (dispatch) => {
  dispatch({
    actions: [{
      label: i18n('MemberView.modal.transfer.action'),
      onClick: () => {},
    }],
    cancelable: true,
    messageKey: 'MemberView.modal.transfer.message',
    titleKey: 'MemberView.modal.transfer.title',
    type: OPEN_MODAL,
  });
};

export const openExistsModal = (routeNo, formNo, userIsAdmin, apiClient) => (dispatch) => {
  if (!routeNo) {
    // If inserting a new member
    dispatch({
      cancelable: true,
      actions: [{
        label: i18n('MemberForm.modals.exists.goToMember.action'),
        onClick: () => dispatch(historyPush(`/member/view/${formNo}`)),
        style: 'primary',
      }],
      message: i18n('MemberForm.modals.exists.goToMember.message'),
      title: i18n('MemberForm.modals.exists.title'),
      type: OPEN_MODAL,
    });
    return;
  }

  if (userIsAdmin) {
    // Only admins can merge
    dispatch({
      cancelable: true,
      actions: [{
        label: i18n('MemberForm.modals.exists.merge.action'),
        onClick: () => dispatch(merge(routeNo, formNo, apiClient)),
        style: 'danger',
      }],
      message: i18n('MemberForm.modals.exists.merge.message'),
      title: i18n('MemberForm.modals.exists.title'),
      type: OPEN_MODAL,
    });
    return;
  }

  dispatch({
    actions: [{
      label: i18n('actions.ok'),
      onClick() {},
    }],
    message: i18n('MemberForm.modals.exists.message'),
    title: i18n('MemberForm.modals.exists.title'),
    type: OPEN_MODAL,
  });
};
