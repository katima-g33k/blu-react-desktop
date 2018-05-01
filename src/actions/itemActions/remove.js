import { browserHistory } from 'react-router';

import { closeModal } from '../modalActions';
import {
  DELETE_ITEM_FAIL,
  DELETE_ITEM_PENDING,
  DELETE_ITEM_SUCCESS,
  OPEN_MODAL,
} from '../actionTypes';
import I18n from '../../lib/i18n';

const pending = () => ({
  type: DELETE_ITEM_PENDING,
});

const success = id => ({
  id,
  type: DELETE_ITEM_SUCCESS,
});

const fail = error => ({
  error,
  type: DELETE_ITEM_FAIL,
});

const successModal = dispatch => ({
  actions: [{
    label: I18n('actions.ok'),
    onClick: () => {
      browserHistory.push('/search');
      dispatch(closeModal());
    },
  }],
  messageKey: 'ItemView.modal.deleted.message',
  titleKey: 'ItemView.modal.deleted.title',
  type: OPEN_MODAL,
});

export default (api, id) => (dispatch) => {
  dispatch({
    actions: [{
      label: I18n('actions.delete'),
      style: 'danger',
      onClick: async () => {
        dispatch(pending());

        try {
          await api.item.delete(id);
          dispatch(success(id));
          dispatch(successModal(dispatch));
        } catch (error) {
          dispatch(fail(error));
        }
      },
    }],
    cancelable: true,
    messageKey: 'ItemView.modal.deleteConfirmation.message',
    titleKey: 'ItemView.modal.deleteConfirmation.title',
    type: OPEN_MODAL,
  });
};
