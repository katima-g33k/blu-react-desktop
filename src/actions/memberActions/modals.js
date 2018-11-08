import { historyPush } from '../routeActions';
import i18n from '../../lib/i18n';
import merge from './merge';
import { open as openModal } from '../modalActions';
import pay from './pay';
import remove from './remove';
import renew from './renew';
import transfer from './transfer';

export const openPayModal = (api, member) => (dispatch) => {
  dispatch(openModal({
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
    message: i18n('MemberView.modal.payConfirmation.message'),
    title: i18n('MemberView.modal.payConfirmation.title'),
  }));
};

export const openDeleteModal = (api, no) => (dispatch) => {
  dispatch(openModal({
    actions: [{
      label: i18n('MemberView.modal.delete.action'),
      onClick: () => dispatch(remove(api, no)),
      style: 'danger',
    }],
    cancelable: true,
    message: i18n('MemberView.modal.delete.message'),
    title: i18n('MemberView.modal.delete.title'),
  }));
};

export const openReactivateModal = (api, member) => (dispatch) => {
  dispatch(openModal({
    actions: [
      {
        label: i18n('MemberView.modal.reactivate.actions.transfer'),
        onClick: () => dispatch(transfer(api, member, true)),
        style: 'danger',
      },
      {
        label: i18n('MemberView.modal.reactivate.actions.reactivate'),
        onClick: () => dispatch(renew(api, member.no)),
      },
    ],
    cancelable: true,
    message: i18n('MemberView.modal.reactivate.message'),
    title: i18n('MemberView.modal.reactivate.title'),
  }));
};

export const openTransferModal = (api, member) => (dispatch) => {
  dispatch(openModal({
    actions: [{
      label: i18n('MemberView.modal.transfer.action'),
      onClick: () => dispatch(transfer(api, member)),
    }],
    cancelable: true,
    message: i18n('MemberView.modal.transfer.message'),
    title: i18n('MemberView.modal.transfer.title'),
  }));
};

export const openExistsModal = (routeNo, formNo, userIsAdmin, apiClient) => (dispatch) => {
  if (!routeNo) {
    // If inserting a new member
    return dispatch(openModal({
      cancelable: true,
      actions: [{
        label: i18n('MemberForm.modals.exists.goToMember.action'),
        onClick: () => dispatch(historyPush(`/member/view/${formNo}`)),
        style: 'primary',
      }],
      message: i18n('MemberForm.modals.exists.goToMember.message'),
      title: i18n('MemberForm.modals.exists.title'),
    }));
  }

  if (userIsAdmin) {
    // Only admins can merge
    return dispatch(openModal({
      cancelable: true,
      actions: [{
        label: i18n('MemberForm.modals.exists.merge.action'),
        onClick: () => dispatch(merge(routeNo, formNo, apiClient)),
        style: 'danger',
      }],
      message: i18n('MemberForm.modals.exists.merge.message'),
      title: i18n('MemberForm.modals.exists.title'),
    }));
  }

  return dispatch(openModal({
    actions: [{
      label: i18n('actions.ok'),
      onClick() {},
    }],
    message: i18n('MemberForm.modals.exists.message'),
    title: i18n('MemberForm.modals.exists.title'),
  }));
};
