import {
  DELETE_COPY_FAIL,
  DELETE_COPY_PENDING,
  DELETE_COPY_SUCCESS,
  OPEN_MODAL,
} from '../actionTypes';
import i18n from '../../lib/i18n';

const pending = () => ({
  type: DELETE_COPY_PENDING,
});

const success = copy => ({
  copy,
  type: DELETE_COPY_SUCCESS,
});

const fail = error => ({
  error,
  type: DELETE_COPY_FAIL,
});

const remove = (api, copy) => async (dispatch) => {
  dispatch(pending());

  try {
    await api.member.copy.delete(copy.id);
    dispatch(success(copy));
  } catch (error) {
    dispatch(fail(error));
  }
};

export default (api, copy) => (dispatch) => {
  dispatch({
    actions: [
      {
        label: i18n('CopyTable.modals.delete.action'),
        onClick: () => dispatch(remove(api, copy)),
        style: 'danger',
      },
    ],
    cancelable: true,
    message: i18n('CopyTable.modals.delete.message'),
    title: i18n('CopyTable.modals.delete.title'),
    type: OPEN_MODAL,
  });
};
