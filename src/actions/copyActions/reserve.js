import API from '../../lib/api';
import { Copy, Transaction } from '../../lib/models';
import I18n from '../../lib/i18n';
import {
  OPEN_MODAL,
  RESERVE_COPY_FAIL,
  RESERVE_COPY_PENDING,
  RESERVE_COPY_SUCCESS,
} from '../actionTypes';

const apiUrl = localStorage.getItem('apiUrl');
const apiKey = localStorage.getItem('apiKey');
const apiClient = new API(apiUrl, apiKey);

const reserveCopyFail = error => ({
  error,
  type: RESERVE_COPY_FAIL,
});

const reserveCopyPending = () => ({
  type: RESERVE_COPY_PENDING,
});

const reserveCopySuccess = (copy, member) => ({
  copy,
  member,
  type: RESERVE_COPY_SUCCESS,
});

const reserveCopy = async (copy, member, dispatch) => {
  dispatch(reserveCopyPending());

  try {
    await apiClient.member.copy.transaction.insert(member.no, copy.id, Transaction.TYPES.RESERVE);

    const reservedCopy = new Copy(copy);
    reservedCopy.reserve(member);

    dispatch(reserveCopySuccess(reservedCopy, member));
  } catch (error) {
    dispatch(reserveCopyFail(error));
  }
};

export default copy => (dispatch) => {
  dispatch({
    cancelable: true,
    message: I18n('CopyTable.modals.reserve.message'),
    modalType: 'search',
    onSelect: member => reserveCopy(copy, member, dispatch),
    title: I18n('CopyTable.modals.reserve.title'),
    type: OPEN_MODAL,
  });
};
