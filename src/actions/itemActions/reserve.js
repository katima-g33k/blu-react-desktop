import moment from 'moment';

import { setSearchResultOnClick } from '../searchActions';
import { closeModal } from '../modalActions';
import I18n from '../../lib/i18n';
import Modal from '../../components/general/modals/Modal';
import {
  OPEN_MODAL,
  RESERVE_ITEM_FAIL,
  RESERVE_ITEM_PENDING,
  RESERVE_ITEM_SUCCESS,
} from '../actionTypes';
import { Reservation } from '../../lib/models';

const pending = () => ({
  type: RESERVE_ITEM_PENDING,
});

const success = reservation => ({
  reservation,
  type: RESERVE_ITEM_SUCCESS,
});

const fail = error => ({
  error,
  type: RESERVE_ITEM_FAIL,
});

const openSearchModal = (dispatch, api, itemId) => {
  dispatch(setSearchResultOnClick(async (parent) => {
    dispatch(pending());

    try {
      const response = await api.reservation.insert(parent.no, itemId);
      const reservation = new Reservation({
        id: response.id,
        date: moment().format(),
        item: { id: itemId },
        parent,
      });
      dispatch(success(reservation));
      dispatch(closeModal());
    } catch (error) {
      dispatch(fail(error));
    }
  }));
  dispatch({
    cancelable: true,
    onClick: null,
    title: I18n('modal.searchParent.title'),
    modalType: Modal.TYPES.SEARCH,
    type: OPEN_MODAL,
  });
};

export default (api, id, isInStock) => (dispatch) => {
  if (isInStock) {
    dispatch({
      actions: [{
        label: I18n('ItemView.actions.reserve'),
        onClick: () => openSearchModal(dispatch, api, id),
      }],
      cancelable: true,
      messageKey: 'ItemView.modal.reserveWarning.message',
      titleKey: 'ItemView.modal.reserveWarning.title',
      type: OPEN_MODAL,
    });
  } else {
    openSearchModal(dispatch, api, id);
  }
};
