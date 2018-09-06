import {
  FETCH_ITEM_LIST_FAIL,
  FETCH_ITEM_LIST_PENDING,
  FETCH_ITEM_LIST_SUCCESS,
} from '../actionTypes';
import Item from '../../lib/models/Item';

const pending = () => ({
  type: FETCH_ITEM_LIST_PENDING,
});

const success = items => ({
  items,
  type: FETCH_ITEM_LIST_SUCCESS,
});

const fail = error => ({
  error,
  type: FETCH_ITEM_LIST_FAIL,
});

export default api => async (dispatch) => {
  dispatch(pending());

  try {
    const res = await api.item.list();
    const items = res.map(row => new Item(row));
    dispatch(success(items));
  } catch (error) {
    dispatch(fail(error));
  }
};
