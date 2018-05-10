import { closeModal } from '../modalActions';
import I18n from '../../lib/i18n';
import {
  OPEN_MODAL,
  RESERVE_COPY_FAIL,
  RESERVE_COPY_PENDING,
  RESERVE_COPY_SUCCESS,
} from '../actionTypes';
import Modal from '../../components/general/modals/Modal';
import { setSearchResultOnClick } from '../searchActions';
import { Transaction } from '../../lib/models';

const fail = error => ({
  error,
  type: RESERVE_COPY_FAIL,
});

const pending = () => ({
  type: RESERVE_COPY_PENDING,
});

const success = (copy, member) => ({
  copy,
  member,
  type: RESERVE_COPY_SUCCESS,
});

export default (api, copy) => (dispatch) => {
  dispatch(setSearchResultOnClick(async (parent) => {
    dispatch(pending());

    try {
      await api.member.copy.transaction.insert(parent.no, copy.id, Transaction.TYPES.RESERVE);

      const reservedCopy = copy.clone();
      reservedCopy.reserve(parent);

      dispatch(success(reservedCopy, parent));
      dispatch(closeModal());
    } catch (error) {
      dispatch(fail(error));
    }
  }));


  dispatch({
    cancelable: true,
    onClick: null,
    title: I18n('modal.searchParent.title'),
    modalType: Modal.TYPES.SEARCH,
    type: OPEN_MODAL,
  });
};
