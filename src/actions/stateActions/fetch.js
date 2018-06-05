import {
  FETCH_STATES_FAIL,
  FETCH_STATES_PENDING,
  FETCH_STATES_SUCCESS,
} from '../actionTypes';
import { State } from '../../lib/models';

const fail = error => ({
  message: error.message,
  titleKey: 'modal.error',
  titleOptions: { code: error.code || 500 },
  type: FETCH_STATES_FAIL,
});

const pending = () => ({
  type: FETCH_STATES_PENDING,
});

const success = states => ({
  states,
  type: FETCH_STATES_SUCCESS,
});

export default apiClient => async (dispatch) => {
  dispatch(pending());

  try {
    const states = (await apiClient.state.list()).map(state => new State(state));
    dispatch(success(states));
  } catch (error) {
    dispatch(fail(error));
  }
};
