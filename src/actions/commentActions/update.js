import API from '../../lib/api/index';
import Comment from '../../lib/models/Comment';
import {
  UPDATE_COMMENT_FAIL,
  UPDATE_COMMENT_PENDING,
  UPDATE_COMMENT_SUCCESS,
} from '../actionTypes';
import { generateFailAction } from '../failedActionFactory';

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

export const updateComment = (id, comment) => async (dispatch) => {
  dispatch(updateCommentPending());

  try {
    await apiClient.member.comment.update(id, comment);
    dispatch(updateCommentSuccess(new Comment({ id, comment })));
  } catch (error) {
    dispatch(updateCommentFail(error));
  }
};
