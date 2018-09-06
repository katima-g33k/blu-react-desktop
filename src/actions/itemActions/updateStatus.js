import {
  UPDATE_STATUS_FAIL,
  UPDATE_STATUS_PENDING,
  UPDATE_STATUS_SUCCESS,
} from '../actionTypes';

const pending = () => ({
  type: UPDATE_STATUS_PENDING,
});

const success = status => ({
  status,
  type: UPDATE_STATUS_SUCCESS,
});

const fail = error => ({
  error,
  type: UPDATE_STATUS_FAIL,
});

export default (api, id, status) => async (dispatch) => {
  dispatch(pending());

  try {
    await api.item.status.set(id, status);
    dispatch(success(status));
  } catch (error) {
    dispatch(fail(error));
  }
};
