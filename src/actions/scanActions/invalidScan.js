import { canChangeLocation } from '../../lib/helpers/scanner';
import i18n from '../../lib/i18n';
import { open as openModal } from '../modalActions';

export default () => (dispatch) => {
  if (canChangeLocation()) {
    dispatch(openModal({
      cancelable: false,
      message: i18n('general.scanner.invalid.message'),
      title: i18n('general.scanner.invalid.title'),
    }));
  }
};
