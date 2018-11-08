import {
  TRANSFER_MEMBER_ACCOUNT_FAIL,
  TRANSFER_MEMBER_ACCOUNT_PENDING,
  TRANSFER_MEMBER_ACCOUNT_SUCCESS,
} from '../actionTypes';
import renew from './renew';

const pending = () => ({
  type: TRANSFER_MEMBER_ACCOUNT_PENDING,
});

const success = (copies) => ({
  copies,
  type: TRANSFER_MEMBER_ACCOUNT_SUCCESS,
});

const fail = error => ({
  error,
  type: TRANSFER_MEMBER_ACCOUNT_FAIL,
});

export default (api, member, shouldRenew) => async (dispatch) => {
  dispatch(pending());

  try {
    await api.member.transfer(member.no);

    const copies = member.account.copies.filter(copy => copy.isPaid);
    dispatch(success(copies));

    if (shouldRenew) {
      dispatch(renew(api, member.no));
    }
  } catch (error) {
    dispatch(fail(error));
  }
};
