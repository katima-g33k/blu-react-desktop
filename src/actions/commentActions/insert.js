import API from '../../lib/api/index';
import Comment from '../../lib/models/Comment';
import {
  INSERT_COMMENT_FAIL,
  INSERT_COMMENT_PENDING,
  INSERT_COMMENT_SUCCESS, OPEN_COMMENT, OPEN_MODAL,
} from '../actionTypes'
import { generateFailAction } from '../failedActionFactory';
import { updateComment } from './update'
import I18n from '../../lib/i18n'

const apiUrl = localStorage.getItem('apiUrl');
const apiKey = localStorage.getItem('apiKey');
const apiClient = new API(apiUrl, apiKey);

const insertCommentFail = error => generateFailAction(error, INSERT_COMMENT_FAIL);

const insertCommentPending = () => ({
  type: INSERT_COMMENT_PENDING,
});

const insertCommentSuccess = comment => ({
  comment,
  type: INSERT_COMMENT_SUCCESS,
});

const insertComment = async (no, comment, dispatch) => {
  dispatch(insertCommentPending());

  try {
    const { id } = await apiClient.member.comment.insert(no, comment);
    dispatch(insertCommentSuccess(new Comment({ id, comment })));
  } catch (error) {
    dispatch(insertCommentFail(error));
  }
};

export const openInsertCommentModal = no => (dispatch) => {
  dispatch({
    actions: [{
      label: I18n('MemberView.modal.comment.insert.action'),
      onClick: ({ inputValue }) => insertComment(no, inputValue, dispatch),
    }],
    cancelable: true,
    message: I18n('MemberView.modal.comment.insert.message'),
    modalType: 'input',
    title: I18n('MemberView.modal.comment.insert.title'),
    type: OPEN_MODAL,
  });
};
