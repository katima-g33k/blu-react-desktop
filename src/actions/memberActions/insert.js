import { browserHistory } from 'react-router';

import {
  INSERT_MEMBER_FAIL,
  INSERT_MEMBER_PENDING,
  INSERT_MEMBER_SUCCESS,
} from '../actionTypes';

const fail = error => ({
  message: error.message,
  titleKey: 'modal.error',
  titleOptions: { code: error.code || 500 },
  type: INSERT_MEMBER_FAIL,
});

const pending = () => ({
  type: INSERT_MEMBER_PENDING,
});

const success = () => ({
  type: INSERT_MEMBER_SUCCESS,
});

export default (member, apiClient) => async (dispatch) => {
  dispatch(pending());

  try {
    await apiClient.member.insert(member);

    dispatch(success());
    browserHistory.push(`/member/view/${member.no}`);
  } catch (error) {
    dispatch(fail(error));
  }
};
