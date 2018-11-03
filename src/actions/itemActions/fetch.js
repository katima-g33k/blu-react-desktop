import {
  FETCH_ITEM_FAIL,
  FETCH_ITEM_PENDING,
  FETCH_ITEM_SUCCESS,
} from '../actionTypes';
import I18n from '../../lib/i18n/index';
import { Item } from '../../lib/models';
import { set } from '../copyActions/index';

const fail = error => ({
  message: error.message,
  title: I18n('modal.error', { code: error.code || 500 }),
  type: FETCH_ITEM_FAIL,
});

const pending = () => ({
  type: FETCH_ITEM_PENDING,
});

const success = item => ({
  item,
  type: FETCH_ITEM_SUCCESS,
});

export default (api, id, shouldSetCopies) => async (dispatch) => {
  dispatch(pending());

  try {
    const item = new Item(await api.item.get(id));
    dispatch(success(item));

    if (shouldSetCopies) {
      dispatch(set(item.copies));
    }
  } catch (error) {
    dispatch(fail(error));
  }
};
