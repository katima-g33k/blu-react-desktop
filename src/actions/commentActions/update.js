import {
  OPEN_MODAL,
  UPDATE_COMMENT_FAIL,
  UPDATE_COMMENT_PENDING,
  UPDATE_COMMENT_SUCCESS,
} from '../actionTypes';
import { Comment } from '../../lib/models';
import { generateFailAction } from '../failedActionFactory';
import I18n from '../../lib/i18n';
import Modal from '../../components/general/modals/Modal';

const updateCommentFail = error => generateFailAction(error, UPDATE_COMMENT_FAIL);

const updateCommentPending = () => ({
  type: UPDATE_COMMENT_PENDING,
});

const updateCommentSuccess = comment => ({
  comment,
  type: UPDATE_COMMENT_SUCCESS,
});

const updateComment = (api, id, comment) => async (dispatch) => {
  dispatch(updateCommentPending());

  try {
    await api.member.comment.update(id, comment);
    dispatch(updateCommentSuccess(new Comment({ id, comment })));
  } catch (error) {
    dispatch(updateCommentFail(error));
  }
};

export default (api, id, comment) => (dispatch) => {
  dispatch({
    actions: [{
      label: I18n('MemberView.modal.comment.update.action'),
      onClick: ({ inputValue }) => dispatch(updateComment(api, id, inputValue)),
    }],
    cancelable: true,
    inputType: Modal.INPUT_TYPES.TEXTAREA,
    inputValue: comment,
    message: I18n('MemberView.modal.comment.update.message'),
    modalType: 'input',
    title: I18n('MemberView.modal.comment.update.title'),
    type: OPEN_MODAL,
  });
};
