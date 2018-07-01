import { browserHistory } from 'react-router';

import { Item } from '../../lib/models';
import {
  INSERT_ITEM_FAIL,
  INSERT_ITEM_PENDING,
  INSERT_ITEM_SUCCESS,
} from '../actionTypes';

const pending = () => ({
  type: INSERT_ITEM_PENDING,
});

const success = item => ({
  item,
  type: INSERT_ITEM_SUCCESS,
});

const fail = error => ({
  error,
  message: error.message,
  titleKey: 'modal.error',
  titleOptions: { code: error.code || 500 },
  type: INSERT_ITEM_FAIL,
});

export default (item, api) => async (dispatch) => {
  dispatch(pending());

  try {
    const { id } = await api.item.insert(item);
    const insertedItem = new Item({ ...item, id });

    dispatch(success(insertedItem));
    browserHistory.push(`/item/view/${id}`);
  } catch (error) {
    fail(error);
  }
};
