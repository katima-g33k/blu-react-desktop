import API from '../../lib/api';
import { Copy, Transaction } from '../../lib/models';
import {
  CANCEL_COPY_RESERVATION_FAIL,
  CANCEL_COPY_RESERVATION_PENDING,
  CANCEL_COPY_RESERVATION_SUCCESS,
  OPEN_MODAL,
} from '../actionTypes';
import { close } from '../modalActions';
import I18n from '../../lib/i18n';

const apiUrl = localStorage.getItem('apiUrl');
const apiKey = localStorage.getItem('apiKey');
const apiClient = new API(apiUrl, apiKey);

const cancelReservationFail = error => ({
  error,
  type: CANCEL_COPY_RESERVATION_FAIL,
});

const cancelReservationPending = () => ({
  type: CANCEL_COPY_RESERVATION_PENDING,
});

const cancelReservationSuccess = copy => ({
  copy,
  type: CANCEL_COPY_RESERVATION_SUCCESS,
});

const cancelReservation = copy => async (dispatch) => {
  dispatch(cancelReservationPending());

  try {
    await apiClient.member.copy.transaction.delete(copy.id, Transaction.TYPES.RESERVE);

    const updatedCopy = new Copy(copy);
    updatedCopy.cancelReservation();

    dispatch(cancelReservationSuccess(updatedCopy));
    dispatch(close());
  } catch (error) {
    dispatch(cancelReservationFail(error));
  }
};

export default copy => (dispatch) => {
  dispatch({
    actions: [
      {
        label: I18n('CopyTable.modals.cancelReservation.action'),
        onClick: () => dispatch(cancelReservation(copy)),
        style: 'primary',
      },
    ],
    cancelable: true,
    message: I18n('CopyTable.modals.cancelReservation.message'),
    title: I18n('CopyTable.modals.cancelReservation.title'),
    type: OPEN_MODAL,
  });
};
