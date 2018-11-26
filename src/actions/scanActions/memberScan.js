import { canChangeLocation } from '../../lib/helpers/scanner';
import { historyPush } from '../routeActions';
import { SCAN_FAIL } from '../actionTypes';

export default (scannedNo, api) => async (dispatch) => {
  if (!canChangeLocation()) {
    return;
  }

  try {
    const { no } = await api.member.exists({ no: scannedNo });

    dispatch(historyPush(`/member/${no ? `view/${no}` : `add?no=${scannedNo}`}`));
  } catch (error) {
    dispatch({
      error,
      type: SCAN_FAIL,
    });
  }
};
