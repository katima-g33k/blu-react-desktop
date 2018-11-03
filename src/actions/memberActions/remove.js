import {
  DELETE_MEMBER_FAIL,
  DELETE_MEMBER_PENDING,
  DELETE_MEMBER_SUCCESS,
} from '../actionTypes';

import { historyPush } from '../routeActions';

const pending = () => ({
  type: DELETE_MEMBER_PENDING,
});

const success = () => ({
  type: DELETE_MEMBER_SUCCESS,
});

const fail = error => ({
  error,
  type: DELETE_MEMBER_FAIL,
});

export default (api, no) => async (dispatch) => {
  dispatch(pending());

  try {
    await api.member.delete(no);
    dispatch(success());
    dispatch(historyPush('/'));
  } catch (error) {
    dispatch(fail(error));
  }
};
