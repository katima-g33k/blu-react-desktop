import API from '../../lib/api/index';
import Comment from '../../lib/models/Comment';
import {
  OPEN_MODAL,
  UPDATE_COMMENT_FAIL,
  UPDATE_COMMENT_PENDING,
  UPDATE_COMMENT_SUCCESS,
} from '../actionTypes'
import { generateFailAction } from '../failedActionFactory';
import I18n from '../../lib/i18n';

const apiUrl = localStorage.getItem('apiUrl');
const apiKey = localStorage.getItem('apiKey');
const apiClient = new API(apiUrl, apiKey);

const updateCommentFail = error => generateFailAction(error, UPDATE_COMMENT_FAIL);

const updateCommentPending = () => ({
  type: UPDATE_COMMENT_PENDING,
});

const updateCommentSuccess = comment => ({
  comment,
  type: UPDATE_COMMENT_SUCCESS,
});

export const updateComment = async (id, comment, dispatch) => {
  dispatch(updateCommentPending());

  try {
    await apiClient.member.comment.update(id, comment);
    dispatch(updateCommentSuccess(new Comment({ id, comment })));
  } catch (error) {
    dispatch(updateCommentFail(error));
  }
};

export const openUpdateCommentModal = (id, comment) => (dispatch) => {
  dispatch({
    actions: [{
      label: I18n('MemberView.modal.comment.update.action'),
      onClick: ({ inputValue }) => updateComment(id, inputValue, dispatch),
    }],
    cancelable: true,
    inputValue: comment,
    message: I18n('MemberView.modal.comment.update.message'),
    modalType: 'input',
    title: I18n('MemberView.modal.comment.update.title'),
    type: OPEN_MODAL,
  });
};
