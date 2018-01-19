import API from '../../lib/api/index';
import Comment from '../../lib/models/Comment';
import {
  INSERT_COMMENT_FAIL,
  INSERT_COMMENT_PENDING,
  INSERT_COMMENT_SUCCESS,
} from '../actionTypes';
import { generateFailAction } from '../failedActionFactory';

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

export const insertComment = (no, comment) => async (dispatch) => {
  dispatch(insertCommentPending());

  try {
    const { id } = await apiClient.member.comment.insert(no, comment);
    dispatch(insertCommentSuccess(new Comment({ id, comment })));
  } catch (error) {
    dispatch(insertCommentFail(error));
  }
};
