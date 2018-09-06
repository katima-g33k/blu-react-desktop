import {
  FETCH_MEMBER_FAIL,
  FETCH_MEMBER_PENDING,
  FETCH_MEMBER_SUCCESS,
} from '../actionTypes';
import Member from '../../lib/models/Member';

const pending = () => ({
  type: FETCH_MEMBER_PENDING,
});

const success = member => ({
  member,
  type: FETCH_MEMBER_SUCCESS,
});

const fail = error => ({
  error,
  type: FETCH_MEMBER_FAIL,
});

export default (api, no) => async (dispatch) => {
  dispatch(pending());

  try {
    const member = new Member({
      ...(await api.member.getName(no)),
      no,
    });

    dispatch(success(member));
  } catch (error) {
    dispatch(fail(error));
  }
};
