import {
  FETCH_RESERVATIONS_FAIL,
  FETCH_RESERVATIONS_PENDING,
  FETCH_RESERVATIONS_SUCCESS,
} from '../actionTypes';
import Reservation from '../../lib/models/Reservation';

const pending = () => ({
  type: FETCH_RESERVATIONS_PENDING,
});

const success = reservations => ({
  reservations,
  type: FETCH_RESERVATIONS_SUCCESS,
});

const fail = error => ({
  error,
  type: FETCH_RESERVATIONS_FAIL,
});

export default api => async (dispatch) => {
  dispatch(pending());

  try {
    const res = await api.reservation.list();
    const reservations = res.map(reservation => new Reservation(reservation));
    dispatch(success(reservations));
  } catch (error) {
    dispatch(fail(error));
  }
};
