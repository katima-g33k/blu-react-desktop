import { HISTORY_PUSH } from '../actionTypes';
import { resetStores } from '../appActions';

export default path => async (dispatch) => {
  await dispatch(resetStores());

  dispatch({
    path,
    type: HISTORY_PUSH,
  });
};
