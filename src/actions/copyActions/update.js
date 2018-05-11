import API from '../../lib/api';
import {
  OPEN_MODAL,
  UPDATE_COPY_FAIL,
  UPDATE_COPY_PENDING,
  UPDATE_COPY_SUCCESS,
} from '../actionTypes';
import { closeModal } from '../modalActions';
import Copy from '../../lib/models/Copy';
import I18n from '../../lib/i18n';
import Modal from '../../components/general/modals/Modal';

const apiUrl = localStorage.getItem('apiUrl');
const apiKey = localStorage.getItem('apiKey');
const apiClient = new API(apiUrl, apiKey);

const updatePending = () => ({
  type: UPDATE_COPY_PENDING,
});

const updateFail = error => ({
  error,
  type: UPDATE_COPY_FAIL,
});

const updateSuccess = copy => ({
  copy,
  type: UPDATE_COPY_SUCCESS,
});

const update = async (copy, price, dispatch) => {
  dispatch(updatePending());

  try {
    await apiClient.member.copy.update(copy.id, price);
    dispatch(updateSuccess(new Copy({ ...copy, price })));
    dispatch(closeModal());
  } catch (error) {
    dispatch(updateFail(error));
  }
};

export default copy => (dispatch) => {
  dispatch({
    actions: [{
      label: I18n('CopyTable.modals.update.action'),
      onClick: ({ inputValue }) => update(copy, +inputValue, dispatch),
    }],
    cancelable: true,
    inputType: Modal.INPUT_TYPES.NUMBER,
    inputValue: copy.price,
    message: I18n('CopyTable.modals.update.message'),
    modalType: 'input',
    title: I18n('CopyTable.modals.update.title'),
    type: OPEN_MODAL,
  });
};
