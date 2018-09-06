import { canChangeLocation } from '../../lib/scannerHelpers';
import i18n from '../../lib/i18n';
import { OPEN_MODAL } from '../actionTypes';

export default () => (dispatch) => {
  if (canChangeLocation()) {
    dispatch({
      cancelable: false,
      message: i18n('general.scanner.invalid.message'),
      title: i18n('general.scanner.invalid.title'),
      type: OPEN_MODAL,
    });
  }
};
