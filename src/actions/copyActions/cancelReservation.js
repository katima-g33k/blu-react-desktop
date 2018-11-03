import {
  CANCEL_COPY_RESERVATION_FAIL,
  CANCEL_COPY_RESERVATION_PENDING,
  CANCEL_COPY_RESERVATION_SUCCESS,
} from '../actionTypes';
import { Copy, Transaction } from '../../lib/models';
import i18n from '../../lib/i18n';
import { open as openModal } from '../modalActions';

const pending = () => ({
  type: CANCEL_COPY_RESERVATION_PENDING,
});

const success = copy => ({
  copy,
  type: CANCEL_COPY_RESERVATION_SUCCESS,
});

const fail = error => ({
  error,
  type: CANCEL_COPY_RESERVATION_FAIL,
});

const cancelReservation = (api, copy) => async (dispatch) => {
  dispatch(pending());

  try {
    await api.member.copy.transaction.delete(copy.id, Transaction.TYPES.RESERVE);

    const updatedCopy = new Copy(copy);
    updatedCopy.cancelReservation();

    dispatch(success(updatedCopy));
  } catch (error) {
    dispatch(fail(error));
  }
};

export default (api, copy) => (dispatch) => {
  dispatch(openModal({
    actions: [
      {
        label: i18n('CopyTable.modals.cancelReservation.action'),
        onClick: () => dispatch(cancelReservation(api, copy)),
        style: 'primary',
      },
    ],
    cancelable: true,
    message: i18n('CopyTable.modals.cancelReservation.message'),
    title: i18n('CopyTable.modals.cancelReservation.title'),
  }));
};
