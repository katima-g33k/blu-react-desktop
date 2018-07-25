import {
  CLEAR_RESERVATIONS_FAIL,
  CLEAR_RESERVATIONS_PENDING,
  CLEAR_RESERVATIONS_SUCCESS,
} from '../actionTypes';

const pending = () => ({
  type: CLEAR_RESERVATIONS_PENDING,
});

const success = () => ({
  type: CLEAR_RESERVATIONS_SUCCESS,
});

const fail = error => ({
  error,
  type: CLEAR_RESERVATIONS_FAIL,
});

export default api => async (dispatch) => {
  dispatch(pending());

  try {
    await api.reservation.clear();
    dispatch(success());
  } catch (error) {
    dispatch(fail(error));
  }
};
