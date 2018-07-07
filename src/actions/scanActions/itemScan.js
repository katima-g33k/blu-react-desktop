import { canChangeLocation } from '../../lib/scannerHelpers';
import {
  HISTORY_PUSH,
  SCAN_FAIL,
} from '../actionTypes';

export default (ean13, api) => async (dispatch) => {
  if (!canChangeLocation()) {
    return;
  }

  try {
    const { id } = await api.item.exists(ean13);

    dispatch({
      path: `/item/${id ? `view/${id}` : `add?ean13=${ean13}`}`,
      type: HISTORY_PUSH,
    });
  } catch (error) {
    dispatch({
      error,
      type: SCAN_FAIL,
    });
  }
};
