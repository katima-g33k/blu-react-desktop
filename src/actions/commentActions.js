import {
  OPEN_COMMENT,
  OPEN_MODAL,
} from './actionTypes';
import API from '../lib/api';
import I18n from '../lib/i18n';

const apiUrl = localStorage.getItem('apiUrl');
const apiKey = localStorage.getItem('apiKey');
const apiClient = new API(apiUrl, apiKey);

export const openCommentModal = comment => (dispatch) => {
  dispatch({ comment, type: OPEN_COMMENT });
  dispatch({
    actions: [{
      label: 'Save',
      onClick: () => {},
    }],
    message: '',
    title: '',
    type: OPEN_MODAL,
  });
};
