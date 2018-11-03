import {
  RESERVE_COPY_FAIL,
  RESERVE_COPY_PENDING,
  RESERVE_COPY_SUCCESS,
} from '../actionTypes';
import i18n from '../../lib/i18n';
import Modal from '../../components/general/modals/Modal';
import { open as openModal } from '../modalActions';
import { setResultOnClick } from '../searchActions';
import { Transaction } from '../../lib/models';

const pending = () => ({
  type: RESERVE_COPY_PENDING,
});

const success = (copy, member) => ({
  copy,
  member,
  type: RESERVE_COPY_SUCCESS,
});

const fail = error => ({
  error,
  type: RESERVE_COPY_FAIL,
});

export default (api, copy) => async (dispatch) => {
  await dispatch(setResultOnClick(async (parent) => {
    dispatch(pending());

    try {
      await api.member.copy.transaction.insert(parent.no, copy.id, Transaction.TYPES.RESERVE);

      const reservedCopy = copy.clone();
      reservedCopy.reserve(parent);

      dispatch(success(reservedCopy, parent));
    } catch (error) {
      dispatch(fail(error));
    }
  }));


  dispatch(openModal({
    cancelable: true,
    modalType: Modal.TYPES.SEARCH,
    onClick: null,
    title: i18n('modal.searchParent.title'),
  }));
};
