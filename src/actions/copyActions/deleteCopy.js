import API from '../../lib/api';
import { close } from '../modalActions';
import {
  DELETE_COPY_FAIL,
  DELETE_COPY_PENDING,
  DELETE_COPY_SUCCESS,
  OPEN_MODAL,
} from '../actionTypes';
import I18n from '../../lib/i18n';

const apiUrl = localStorage.getItem('apiUrl');
const apiKey = localStorage.getItem('apiKey');
const apiClient = new API(apiUrl, apiKey);

const deletePending = () => ({
  type: DELETE_COPY_PENDING,
});

const deleteFail = error => ({
  error,
  type: DELETE_COPY_FAIL,
});

const deleteSuccess = copy => ({
  copy,
  type: DELETE_COPY_SUCCESS,
});

const deleteCopy = copy => async (dispatch) => {
  dispatch(deletePending());

  try {
    await apiClient.member.copy.delete(copy.id);
    dispatch(deleteSuccess(copy));
    dispatch(close());
  } catch (error) {
    dispatch(deleteFail(error));
  }
};

export default copy => (dispatch) => {
  dispatch({
    actions: [
      {
        label: I18n('CopyTable.modals.delete.action'),
        onClick: () => dispatch(deleteCopy(copy)),
        style: 'danger',
      },
    ],
    cancelable: true,
    message: I18n('CopyTable.modals.delete.message'),
    title: I18n('CopyTable.modals.delete.title'),
    type: OPEN_MODAL,
  });
};
