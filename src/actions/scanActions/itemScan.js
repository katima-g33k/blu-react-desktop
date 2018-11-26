import { canChangeLocation } from '../../lib/helpers/scanner';
import { historyPush } from '../routeActions';
import { setLastItemScanned } from '../appActions';
import { SCAN_FAIL } from '../actionTypes';

export default (ean13, api) => async (dispatch) => {
  try {
    const { id } = await api.item.exists(ean13);

    console.log(id, ean13);

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
