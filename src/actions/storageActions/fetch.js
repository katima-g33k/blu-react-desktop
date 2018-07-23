import {
  FETCH_STORAGE_FAIL,
  FETCH_STORAGE_PENDING,
  FETCH_STORAGE_SUCCESS,
} from '../actionTypes';
import Storage from '../../lib/models/Storage';

const pending = () => ({
  type: FETCH_STORAGE_PENDING,
});

const success = storage => ({
  storage,
  type: FETCH_STORAGE_SUCCESS,
});

const fail = error => ({
  error,
  type: FETCH_STORAGE_FAIL,
});

export default api => async (dispatch) => {
  dispatch(pending());

  try {
    const res = await api.item.storage.list();
    const storage = Object.keys(res).map(key => new Storage({
      no: key,
      item: res[key].sort((a, b) => (a.name < b.name ? -1 : 1)),
    }));

    dispatch(success(storage));
  } catch (error) {
    dispatch(fail(error));
  }
};
