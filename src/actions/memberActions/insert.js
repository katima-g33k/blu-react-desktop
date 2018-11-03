import {
  INSERT_MEMBER_FAIL,
  INSERT_MEMBER_PENDING,
  INSERT_MEMBER_SUCCESS,
} from '../actionTypes';
import { historyPush } from '../routeActions';
import { Member } from '../../lib/models';

const fail = error => ({
  error,
  type: INSERT_MEMBER_FAIL,
});

const pending = () => ({
  type: INSERT_MEMBER_PENDING,
});

const success = member => ({
  member,
  type: INSERT_MEMBER_SUCCESS,
});

export default (api, member) => async (dispatch) => {
  dispatch(pending());

  try {
    const { no } = await api.member.insert(member);

    dispatch(success(new Member({ ...member, no })));
    dispatch(historyPush(`/member/view/${no}`));
  } catch (error) {
    dispatch(fail(error));
  }
};
