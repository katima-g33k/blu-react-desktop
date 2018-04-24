import I18n from '../../lib/i18n';
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
