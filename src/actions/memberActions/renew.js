import {
  RENEW_MEMBER_FAIL,
  RENEW_MEMBER_PENDING,
  RENEW_MEMBER_SUCCESS,
} from '../actionTypes';

const fail = error => ({
  message: error.message,
  titleKey: 'modal.error',
  titleOptions: { code: error.code || 500 },
  type: RENEW_MEMBER_FAIL,
});

const pending = () => ({
  type: RENEW_MEMBER_PENDING,
});

const success = () => ({
  type: RENEW_MEMBER_SUCCESS,
});

export default (apiClient, no) => async (dispatch) => {
  dispatch(pending());

  try {
    await apiClient.member.renew(no);
    dispatch(success());
  } catch (error) {
    dispatch(fail(error));
  }
};
