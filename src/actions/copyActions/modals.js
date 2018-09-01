/* eslint import/prefer-default-export: 0 */
import { close as closeModal } from '../modalActions';
import i18n from '../../lib/i18n';
import { insert } from './index';
import { OPEN_MODAL } from '../actionTypes';
import { reset as resetItem } from '../itemActions';
import { resetLastItemScanned } from '../appActions';

export const openCopyPriceModal = (api, member, item) => (dispatch) => {
  dispatch({
    actions: [
      {
        label: i18n('actions.save'),
        onClick: async ({ inputValue }) => {
          await dispatch(closeModal());
          dispatch(resetItem());
          dispatch(resetLastItemScanned());
          dispatch(insert(api, member, item, inputValue));
        },
      },
    ],
    cancelable: true,
    message: i18n('AddCopies.modals.copyPrice.message'),
    modalType: 'input',
    inputType: 'number',
    title: item.name,
    type: OPEN_MODAL,
  });
};

export const openReservedItemModal = name => (dispatch) => {
  dispatch({
    actions: [
      {
        label: i18n('actions.ok'),
        onClick: () => dispatch(closeModal()),
      },
    ],
    cancelable: false,
    message: i18n('AddCopies.modals.reservedItem.message'),
    title: i18n('AddCopies.modals.reservedItem.title', { name }),
    type: OPEN_MODAL,
  });
};
