import {
  OPEN_COMMENT,
} from '../actions/actionTypes';

const initialState = {
  comment: new Comment(),
};

export default function commentReducer(state = initialState, action = {}) {
  switch (action.type) {
    case OPEN_COMMENT:
      return {
        comment: action.comment,
      };
    default:
      return state;
  }
}
