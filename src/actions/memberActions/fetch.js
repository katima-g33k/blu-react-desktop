import {
  FETCH_MEMBER_FAIL,
  FETCH_MEMBER_PENDING,
  FETCH_MEMBER_SUCCESS,
} from '../actionTypes';
import { Member } from '../../lib/models';
import { setCopies } from '../copyActions';

const fail = error => ({
  message: error.message,
  titleKey: 'modal.error',
  titleOptions: { code: error.code || 500 },
  type: FETCH_MEMBER_FAIL,
});

const pending = () => ({
  type: FETCH_MEMBER_PENDING,
});

const success = member => ({
  member,
  type: FETCH_MEMBER_SUCCESS,
});

export default (apiClient, no) => async (dispatch) => {
  dispatch(pending());

  try {
    const member = new Member(await apiClient.member.get(no));
    dispatch(success(member));
    dispatch(setCopies(member.account.copies));
  } catch (error) {
    dispatch(fail(error));
  }
};
