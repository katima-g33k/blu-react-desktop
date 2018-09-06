/* eslint import/prefer-default-export: 0 */
import { close as closeModal } from '../modalActions';
import i18n from '../../lib/i18n';
import { OPEN_MODAL } from '../actionTypes';
import remove from './remove';

export const openRemoveModal = (employee, api) => (dispatch) => {
  dispatch({
    actions: [
      {
        label: i18n('actions.delete'),
        onClick: () => {
          dispatch(remove(employee, api));
          dispatch(closeModal());
        },
        style: 'danger',
      },
    ],
    cancelable: true,
    message: i18n('Admin.employees.modals.remove.message', { username: employee.username }),
    title: i18n('Admin.employees.modals.remove.title'),
    type: OPEN_MODAL,
  });
};
