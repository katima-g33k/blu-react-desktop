import { OPEN_MODAL } from '../actionTypes';
import { canChangeLocation } from '../../lib/scannerHelpers';

export default () => (dispatch) => {
  if (canChangeLocation()) {
    // TODO: I18n
    dispatch({
      cancelable: false,
      message: 'Le code que vous venez de scanner n\'est pas supporté par le système de la BLU',
      title: 'Code invalide',
      type: OPEN_MODAL,
    });
  }
};
