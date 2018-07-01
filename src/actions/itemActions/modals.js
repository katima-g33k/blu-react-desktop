/* eslint import/prefer-default-export: 0 */

import { browserHistory } from 'react-router';

import { closeModal } from '../modalActions';
import I18n from '../../lib/i18n';
import { OPEN_MODAL } from '../actionTypes';
import merge from '../memberActions/merge';

export const openExistsModal = (itemId, existingItemId, userIsAdmin, api) => (dispatch) => {
  if (!itemId) {
    // If inserting item
    dispatch({
      cancelable: true,
      actions: [{
        label: I18n('ItemForm.modals.exists.goToItem.action'),
        onClick: () => {
          dispatch(closeModal());
          browserHistory.push(`/item/view/${existingItemId}`);
        },
        style: 'primary',
      }],
      message: I18n('ItemForm.modals.exists.goToItem.message'),
      title: I18n('ItemForm.modals.exists.title'),
      type: OPEN_MODAL,
    });
    return;
  }

  if (userIsAdmin) {
    // Only admins can merge
    dispatch({
      cancelable: true,
      actions: [{
        label: I18n('ItemForm.modals.exists.merge.action'),
        onClick: () => merge(existingItemId, itemId, api, dispatch),
        style: 'danger',
      }],
      message: I18n('ItemForm.modals.exists.merge.message'),
      title: I18n('ItemForm.modals.exists.title'),
      type: OPEN_MODAL,
    });
    return;
  }

  dispatch({
    actions: [{
      label: I18n('actions.ok'),
      onClick: () => dispatch(closeModal()),
    }],
    message: I18n('ItemForm.modals.exists.message'),
    title: I18n('ItemForm.modals.exists.title'),
    type: OPEN_MODAL,
  });
};
