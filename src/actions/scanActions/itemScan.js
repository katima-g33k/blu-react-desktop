import { canChangeLocation } from '../../lib/helpers/scanner';
import { historyPush } from '../routeActions';
import { reset as resetItem } from '../itemActions';
import { setLastItemScanned } from '../appActions';
import { SCAN_FAIL } from '../actionTypes';

export default (ean13, api) => async (dispatch) => {
  try {
    const { id } = await api.item.exists(ean13);

    await dispatch(resetItem());
    dispatch(setLastItemScanned({ id, ean13 }));

    if (canChangeLocation()) {
      dispatch(historyPush(`/item/${id ? `view/${id}` : `add?ean13=${ean13}`}`));
    }
  } catch (error) {
    dispatch({
      error,
      type: SCAN_FAIL,
    });
  }
};
