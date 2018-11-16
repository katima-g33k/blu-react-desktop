import {
  INSERT_ITEM_FAIL,
  INSERT_ITEM_PENDING,
  INSERT_ITEM_SUCCESS,
} from '../actionTypes';
import { historyPush } from '../routeActions';
import { Item } from '../../lib/models';

const pending = () => ({
  type: INSERT_ITEM_PENDING,
});

const success = item => ({
  item,
  type: INSERT_ITEM_SUCCESS,
});

const fail = error => ({
  error,
  type: INSERT_ITEM_FAIL,
});

export default (api, item, callback) => async (dispatch) => {
  dispatch(pending());

  try {
    const { id } = await api.item.insert(item);
    const insertedItem = new Item({ ...item, id });

    dispatch(success(insertedItem));

    if (callback) {
      callback(insertedItem);
      return;
    }

    dispatch(historyPush(`/item/view/${id}`));
  } catch (error) {
    fail(error);
  }
};
