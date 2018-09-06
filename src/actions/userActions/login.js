import { close } from '../modalActions';
import { encrypt } from '../../lib/cipher';
import I18n from '../../lib/i18n';
import {
  LOGIN_FAIL,
  LOGIN_PENDING,
  LOGIN_SUCCESS,
  OPEN_MODAL,
} from '../actionTypes';

const pending = () => ({
  type: LOGIN_PENDING,
});

const success = user => ({
  user,
  type: LOGIN_SUCCESS,
});

const fail = error => ({
  error,
  type: LOGIN_FAIL,
});

export default (username, password, secret, api) => async (dispatch) => {
  dispatch(pending());

  try {
    const user = await api.employee.login(username, encrypt(password, secret));
    dispatch(success(user));
  } catch (error) {
    dispatch(fail(error));
    dispatch({
      title: I18n('Login.error.title'),
      message: I18n('Login.error.message'),
      actions: [
        {
          label: I18n('actions.ok'),
          onClick: () => dispatch(close()),
        },
      ],
      type: OPEN_MODAL,
    });
  }
};
