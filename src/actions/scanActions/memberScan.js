import { canChangeLocation } from '../../lib/scannerHelpers';
import {
  HISTORY_PUSH,
  SCAN_FAIL,
} from '../actionTypes';

export default (scannedNo, api) => async (dispatch) => {
  if (!canChangeLocation()) {
    return;
  }

  try {
    const { no } = await api.member.exists(scannedNo);

    dispatch({
      path: `/member/${no ? `view/${no}` : `add?no=${scannedNo}`}`,
      type: HISTORY_PUSH,
    });
  } catch (error) {
    dispatch({
      error,
      type: SCAN_FAIL,
    });
  }
};
