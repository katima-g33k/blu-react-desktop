import { Comment } from '../../lib/models';
import {
  INSERT_COMMENT_FAIL,
  INSERT_COMMENT_PENDING,
  INSERT_COMMENT_SUCCESS,
  OPEN_MODAL,
} from '../actionTypes';
import { generateFailAction } from '../failedActionFactory';
import I18n from '../../lib/i18n';
import Modal from '../../components/general/modals/Modal';

const insertCommentFail = error => generateFailAction(error, INSERT_COMMENT_FAIL);

const insertCommentPending = () => ({
  type: INSERT_COMMENT_PENDING,
});

const insertCommentSuccess = comment => ({
  comment,
  type: INSERT_COMMENT_SUCCESS,
});

const insertComment = (api, no, comment) => async (dispatch) => {
  dispatch(insertCommentPending());

  try {
    const { id } = await api.member.comment.insert(no, comment);
    dispatch(insertCommentSuccess(new Comment({ id, comment })));
  } catch (error) {
    dispatch(insertCommentFail(error));
  }
};

export default (api, no) => (dispatch) => {
  dispatch({
    actions: [{
      label: I18n('MemberView.modal.comment.insert.action'),
      onClick: ({ inputValue }) => dispatch(insertComment(api, no, inputValue)),
    }],
    cancelable: true,
    inputType: Modal.INPUT_TYPES.TEXTAREA,
    message: I18n('MemberView.modal.comment.insert.message'),
    modalType: 'input',
    title: I18n('MemberView.modal.comment.insert.title'),
    type: OPEN_MODAL,
  });
};
