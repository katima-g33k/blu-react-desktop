import {
  OPEN_MODAL,
  UPDATE_COPY_FAIL,
  UPDATE_COPY_PENDING,
  UPDATE_COPY_SUCCESS,
} from '../actionTypes';
import { close } from '../modalActions';
import Copy from '../../lib/models/Copy';
import I18n from '../../lib/i18n';
import Modal from '../../components/general/modals/Modal';

const pending = () => ({
  type: UPDATE_COPY_PENDING,
});

const success = copy => ({
  copy,
  type: UPDATE_COPY_SUCCESS,
});

const fail = error => ({
  error,
  type: UPDATE_COPY_FAIL,
});

const update = (api, copy, price) => async (dispatch) => {
  dispatch(pending());

  try {
    await api.member.copy.update(copy.id, price);
    dispatch(success(new Copy({ ...copy, price })));
    dispatch(close());
  } catch (error) {
    dispatch(fail(error));
  }
};

export default (api, copy) => (dispatch) => {
  dispatch({
    actions: [{
      label: I18n('CopyTable.modals.update.action'),
      onClick: ({ inputValue }) => dispatch(update(api, copy, +inputValue)),
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
