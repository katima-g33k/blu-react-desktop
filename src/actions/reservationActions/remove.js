import { closeModal } from '../modalActions';
import {
  DELETE_RESERVATION_FAIL,
  DELETE_RESERVATION_PENDING,
  DELETE_RESERVATION_SUCCESS,
  OPEN_MODAL,
} from '../actionTypes';
import I18n from '../../lib/i18n';
import { Transaction } from '../../lib/models';

const pending = () => ({
  type: DELETE_RESERVATION_PENDING,
});

const success = reservation => ({
  reservation,
  type: DELETE_RESERVATION_SUCCESS,
});

const fail = error => ({
  error,
  type: DELETE_RESERVATION_FAIL,
});

export default (api, reservation) => async (dispatch) => {
  dispatch({
    actions: [{
      label: I18n('actions.delete'),
      style: 'danger',
      onClick: async () => {
        dispatch(pending());

        try {
          const { copy, item, parent } = reservation;

          if (copy) {
            await api.member.copy.transaction.delete(copy.id, Transaction.TYPES.RESERVE);
          } else {
            await api.reservation.delete(parent.no, item.id);
          }

          dispatch(success(reservation));
          dispatch(closeModal());
        } catch (error) {
          dispatch(fail(error));
        }
      },
    }],
    cancelable: true,
    message: `Souhaitez-vous vraiment supprimer la réservation de ${reservation.parent.name} ?`,
    title: 'Supprimer une réservation',
    type: OPEN_MODAL,
  });
};
