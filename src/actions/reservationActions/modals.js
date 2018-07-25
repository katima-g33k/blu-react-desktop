/* eslint import/prefer-default-export: 0 */
import clear from './clear';
import { close as closeModal } from '../modalActions';
import i18n from '../../lib/i18n';
import { OPEN_MODAL } from '../actionTypes';

export const openClearModal = api => (dispatch) => {
  dispatch({
    actions: [
      {
        label: i18n('Admin.reservation.actions.clear'),
        onClick: () => {
          dispatch(clear(api));
          dispatch(closeModal());
        },
        style: 'danger',
      },
    ],
    cancelable: true,
    message: i18n('Admin.reservation.modals.clear.message'),
    title: i18n('Admin.reservation.modals.clear.title'),
    type: OPEN_MODAL,
  });
};
