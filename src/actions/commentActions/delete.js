import {
  DELETE_COMMENT_FAIL,
  DELETE_COMMENT_PENDING,
  DELETE_COMMENT_SUCCESS, OPEN_MODAL,
} from '../actionTypes';
import { generateFailAction } from '../failedActionFactory';
import I18n from '../../lib/i18n';

const deleteCommentFail = error => generateFailAction(error, DELETE_COMMENT_FAIL);

const deleteCommentPending = () => ({
  type: DELETE_COMMENT_PENDING,
});

const deleteCommentSuccess = comment => ({
  comment,
  type: DELETE_COMMENT_SUCCESS,
});

const deleteComment = (api, comment) => async (dispatch) => {
  dispatch(deleteCommentPending());

  try {
    await api.member.comment.delete(comment.id);
    dispatch(deleteCommentSuccess(comment));
  } catch (error) {
    dispatch(deleteCommentFail(error));
  }
};

export default (api, comment) => (dispatch) => {
  dispatch({
    actions: [
      {
        label: I18n('MemberView.modal.comment.delete.action'),
        onClick: () => dispatch(deleteComment(api, comment)),
        style: 'danger',
      },
    ],
    cancelable: true,
    message: I18n('MemberView.modal.comment.delete.message', { comment }),
    title: I18n('MemberView.modal.comment.delete.title'),
    type: OPEN_MODAL,
  });
};
