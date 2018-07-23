import {
  CLEAR_STORAGE_FAIL,
  CLEAR_STORAGE_PENDING,
  CLEAR_STORAGE_SUCCESS,
} from '../actionTypes';

const pending = () => ({
  type: CLEAR_STORAGE_PENDING,
});

const success = () => ({
  type: CLEAR_STORAGE_SUCCESS,
});

const fail = error => ({
  error,
  type: CLEAR_STORAGE_FAIL,
});

export default api => async (dispatch) => {
  dispatch(pending());

  try {
    await api.item.storage.clear();
    dispatch(success());
  } catch (error) {
    dispatch(fail(error));
  }
};
