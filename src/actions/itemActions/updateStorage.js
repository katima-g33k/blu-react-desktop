import I18n from '../../lib/i18n';
import Modal from '../../components/general/modals/Modal';
import {
  OPEN_MODAL,
  UPDATE_STORAGE_FAIL,
  UPDATE_STORAGE_PENDING,
  UPDATE_STORAGE_SUCCESS,
} from '../actionTypes';

const pending = () => ({
  type: UPDATE_STORAGE_PENDING,
});

const success = storage => ({
  storage,
  type: UPDATE_STORAGE_SUCCESS,
});

const fail = error => ({
  error,
  type: UPDATE_STORAGE_FAIL,
});

const updateStorage = (id, value, api) => async (dispatch) => {
  dispatch(pending());

  try {
    const newStorage = value.replace(/\D+/g, ' ').split(/\D/).sort((a, b) => a - b);
    await api.item.storage.set(id, newStorage);
    dispatch(success(newStorage));
  } catch (error) {
    dispatch(fail(error));
  }
};

export default (api, id, storage) => (dispatch) => {
  dispatch({
    actions: [{
      label: I18n('actions.save'),
      onClick: ({ inputValue }) => dispatch(updateStorage(id, inputValue, api)),
    }],
    cancelable: true,
    inputValue: storage.join('; '),
    messageKey: 'ItemView.modal.updateStorage.message',
    modalType: Modal.TYPES.INPUT,
    titleKey: 'ItemView.modal.updateStorage.title',
    type: OPEN_MODAL,
  });
};
