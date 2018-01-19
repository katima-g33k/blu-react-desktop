import API from '../../lib/api/index';
import {
  DELETE_COMMENT_FAIL,
  DELETE_COMMENT_PENDING,
  DELETE_COMMENT_SUCCESS,
} from '../actionTypes';
import { generateFailAction } from '../failedActionFactory';

const apiUrl = localStorage.getItem('apiUrl');
const apiKey = localStorage.getItem('apiKey');
const apiClient = new API(apiUrl, apiKey);

const deleteCommentFail = error => generateFailAction(error, DELETE_COMMENT_FAIL);

const deleteCommentPending = () => ({
  type: DELETE_COMMENT_PENDING,
});

const deleteCommentSuccess = comment => ({
  comment,
  type: DELETE_COMMENT_SUCCESS,
});

export const deleteComment = comment => async (dispatch) => {
  dispatch(deleteCommentPending());

  try {
    await apiClient.member.comment.delete(comment.id);
    dispatch(deleteCommentSuccess(comment));
  } catch (error) {
    dispatch(deleteCommentFail(error));
  }
};
