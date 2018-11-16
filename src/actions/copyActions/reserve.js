import {
  RESERVE_COPY_FAIL,
  RESERVE_COPY_PENDING,
  RESERVE_COPY_SUCCESS,
} from '../actionTypes';
import {
  close as closeModal,
  openSearch as openSearchModal,
} from '../modalActions';
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

const onResultClick = (api, copy) => (dispatch) => {
  async function onClick(parent) {
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
  }

  dispatch(setResultOnClick(onClick));
};

export default (api, copy) => async (dispatch) => {
  await dispatch(onResultClick(api, copy));
  dispatch(openSearchModal());
};
