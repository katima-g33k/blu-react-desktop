import {
  OPEN_COMMENT,
  OPEN_MODAL,
} from '../actionTypes';

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
