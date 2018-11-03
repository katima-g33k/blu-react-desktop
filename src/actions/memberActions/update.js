import { browserHistory } from 'react-router';

import {
  UPDATE_MEMBER_FAIL,
  UPDATE_MEMBER_PENDING,
  UPDATE_MEMBER_SUCCESS,
} from '../actionTypes';

const fail = error => ({
  message: error.message,
  titleKey: 'modal.error',
  titleOptions: { code: error.code || 500 },
  type: UPDATE_MEMBER_FAIL,
});

const pending = () => ({
  type: UPDATE_MEMBER_PENDING,
});

const success = () => ({
  type: UPDATE_MEMBER_SUCCESS,
});

export default (api, no, member) => async (dispatch) => {
  dispatch(pending());

  try {
    await api.member.update(no, member);

    dispatch(success());
    browserHistory.push(`/member/view/${member.no}`);
  } catch (error) {
    dispatch(fail(error));
  }
};
