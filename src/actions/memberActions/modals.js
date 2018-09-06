import { browserHistory } from 'react-router';

import { close } from '../modalActions';
import I18n from '../../lib/i18n';
import merge from './merge';
import { OPEN_MODAL } from '../actionTypes';
import pay from './pay';

export const openPayModal = member => (dispatch) => {
  dispatch({
    actions: [
      {
        label: I18n('MemberView.actions.printReceipt'),
        onClick: () => dispatch(pay(member, true)),
      },
      {
        label: I18n('MemberView.actions.pay'),
        onClick: () => dispatch(pay(member)),
      },
    ],
    cancelable: true,
    messageKey: 'MemberView.modal.payConfirmation.message',
    titleKey: 'MemberView.modal.payConfirmation.title',
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
    messageKey: 'MemberView.modal.delete.message',
    titleKey: 'MemberView.modal.delete.title',
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
    messageKey: 'MemberView.modal.reactivate.message',
    titleKey: 'MemberView.modal.reactivate.title',
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
        label: I18n('MemberForm.modals.exists.goToMember.action'),
        onClick: () => {
          dispatch(close());
          browserHistory.push(`/member/view/${formNo}`);
        },
        style: 'primary',
      }],
      message: I18n('MemberForm.modals.exists.goToMember.message'),
      title: I18n('MemberForm.modals.exists.title'),
      type: OPEN_MODAL,
    });
    return;
  }

  if (userIsAdmin) {
    // Only admins can merge
    dispatch({
      cancelable: true,
      actions: [{
        label: I18n('MemberForm.modals.exists.merge.action'),
        onClick: () => dispatch(merge(routeNo, formNo, apiClient)),
        style: 'danger',
      }],
      message: I18n('MemberForm.modals.exists.merge.message'),
      title: I18n('MemberForm.modals.exists.title'),
      type: OPEN_MODAL,
    });
    return;
  }

  dispatch({
    actions: [{
      label: I18n('actions.ok'),
      onClick: () => dispatch(close()),
    }],
    message: I18n('MemberForm.modals.exists.message'),
    title: I18n('MemberForm.modals.exists.title'),
    type: OPEN_MODAL,
  });
};
