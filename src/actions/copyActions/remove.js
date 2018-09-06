import { close } from '../modalActions';
import {
  DELETE_COPY_FAIL,
  DELETE_COPY_PENDING,
  DELETE_COPY_SUCCESS,
  OPEN_MODAL,
} from '../actionTypes';
import I18n from '../../lib/i18n';

const pending = () => ({
  type: DELETE_COPY_PENDING,
});

const fail = error => ({
  error,
  type: DELETE_COPY_FAIL,
});

const success = copy => ({
  copy,
  type: DELETE_COPY_SUCCESS,
});

const remove = (api, copy) => async (dispatch) => {
  dispatch(pending());

  try {
    await api.member.copy.delete(copy.id);
    dispatch(success(copy));
    dispatch(close());
  } catch (error) {
    dispatch(fail(error));
  }
};

export default (api, copy) => (dispatch) => {
  dispatch({
    actions: [
      {
        label: I18n('CopyTable.modals.delete.action'),
        onClick: () => dispatch(remove(api, copy)),
        style: 'danger',
      },
    ],
    cancelable: true,
    message: I18n('CopyTable.modals.delete.message'),
    title: I18n('CopyTable.modals.delete.title'),
    type: OPEN_MODAL,
  });
};
