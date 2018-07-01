import { browserHistory } from 'react-router';

import I18n from '../../lib/i18n';
import {
  MERGE_ITEM_FAIL,
  MERGE_ITEM_PENDING,
  MERGE_ITEM_SUCCESS,
  OPEN_MODAL,
} from '../actionTypes';

const pending = () => ({
  type: MERGE_ITEM_PENDING,
});

const success = (originalId, duplicateId) => ({
  duplicateId,
  originalId,
  type: MERGE_ITEM_SUCCESS,
});

const fail = error => ({
  error,
  type: MERGE_ITEM_FAIL,
});

export default async (originalId, duplicateId, api, dispatch) => {
  dispatch(pending());

  try {
    await api.item.merge(duplicateId, originalId);
    dispatch(success());

    dispatch({
      actions: [{
        label: I18n('actions.ok'),
        onClick: () => browserHistory.push(`/item/view/${originalId}`),
      }],
      message: I18n('ItemForm.modals.exists.merged.message'),
      title: I18n('ItemForm.modals.exists.merged.title'),
      type: OPEN_MODAL,
    });
  } catch (error) {
    dispatch(fail(error));
  }
};
