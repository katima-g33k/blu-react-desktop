import { OPEN_MODAL } from '../actionTypes';
import i18n from '../../lib/i18n';
import Modal from '../../components/general/modals/Modal';

export default () => (dispatch) => {
  dispatch({
    cancelable: true,
    modalType: Modal.TYPES.SEARCH,
    onClick: null,
    title: i18n('modal.searchParent.title'),
    type: OPEN_MODAL,
  });
};
