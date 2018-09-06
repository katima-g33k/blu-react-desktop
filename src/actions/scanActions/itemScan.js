import { canChangeLocation } from '../../lib/scannerHelpers';
import { setLastItemScanned } from '../appActions';
import {
  SCAN_FAIL,
  HISTORY_PUSH,
} from '../actionTypes';

export default (ean13, api) => async (dispatch) => {
  try {
    const { id } = await api.item.exists(ean13);

    dispatch(setLastItemScanned({ id, ean13 }));

    if (canChangeLocation()) {
      dispatch({
        path: `/item/${id ? `view/${id}` : `add?ean13=${ean13}`}`,
        type: HISTORY_PUSH,
      });
    }
  } catch (error) {
    dispatch({
      error,
      type: SCAN_FAIL,
    });
  }
};
