import {
  Copy,
  Transaction,
} from '../../lib/models';
import {
  INSERT_COPY_FAIL,
  INSERT_COPY_PENDING,
  INSERT_COPY_SUCCESS,
} from '../actionTypes';
import { openReservedItemModal } from './modals';

const pending = () => ({
  type: INSERT_COPY_PENDING,
});

const success = copy => ({
  copy,
  type: INSERT_COPY_SUCCESS,
});

const fail = error => ({
  error,
  type: INSERT_COPY_FAIL,
});

export default (api, member, item, price) => async (dispatch) => {
  dispatch(pending());

  try {
    const { id, reservation } = await api.member.copy.insert(member.no, item.id, price);
    const copy = new Copy({
      id,
      item,
      price,
      transaction: [{
        code: Transaction.TYPES.ADD,
        date: new Date(),
      }],
    });

    if (reservation) {
      copy.reserve(reservation.member);
      dispatch(openReservedItemModal(reservation.parent.name));
    }

    dispatch(success(copy));
  } catch (error) {
    dispatch(fail());
  }
};
