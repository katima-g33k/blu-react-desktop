import { browserHistory } from 'react-router';

import { Item } from '../../lib/models';
import {
  UPDATE_ITEM_FAIL,
  UPDATE_ITEM_PENDING,
  UPDATE_ITEM_SUCCESS,
} from '../actionTypes';

const pending = () => ({
  type: UPDATE_ITEM_PENDING,
});

const success = item => ({
  item,
  type: UPDATE_ITEM_SUCCESS,
});

const fail = error => ({
  error,
  message: error.message,
  titleKey: 'modal.error',
  titleOptions: { code: error.code || 500 },
  type: UPDATE_ITEM_FAIL,
});

export default (id, item, api) => async (dispatch) => {
  dispatch(pending());

  try {
    await api.item.update(id, item);

    dispatch(success(new Item(item)));
    browserHistory.push(`/item/view/${id}`);
  } catch (error) {
    dispatch(fail(error));
  }
};
