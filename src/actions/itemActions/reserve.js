import {
  RESERVE_ITEM_FAIL,
  RESERVE_ITEM_PENDING,
  RESERVE_ITEM_SUCCESS,
} from '../actionTypes';
import {
  close as closeModal,
  open as openModal,
  openSearch as openSearchModal,
} from '../modalActions';
import { setResultOnClick } from '../searchActions';
import i18n from '../../lib/i18n';
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

const onResultClick = (api, itemId) => (dispatch) => {
  async function onClick(parent) {
    dispatch(pending());

    try {
      const response = await api.reservation.insert(parent.no, itemId);
      const reservation = new Reservation({
        id: response.id,
        date: new Date(),
        item: { id: itemId },
        parent,
      });

      dispatch(success(reservation));
      dispatch(closeModal());
    } catch (error) {
      dispatch(fail(error));
    }
  }

  dispatch(setResultOnClick(onClick));
};

const search = (api, itemId) => async (dispatch) => {
  await dispatch(onResultClick(api, itemId));
  dispatch(openSearchModal());
};

const openConfirmationModal = (api, id) => (dispatch) => {
  dispatch(openModal({
    actions: [{
      label: i18n('ItemView.actions.reserve'),
      onClick: () => dispatch(search(api, id)),
    }],
    cancelable: true,
    message: i18n('ItemView.modal.reserveWarning.message'),
    title: i18n('ItemView.modal.reserveWarning.title'),
  }));
};

export default (api, id, isInStock) => (dispatch) => {
  const action = !isInStock ? search : openConfirmationModal;
  dispatch(action(api, id));
};
