import {
  DELETE_COMMENT_SUCCESS,
  DELETE_MEMBER_SUCCESS,
  FETCH_MEMBER_FAIL,
  FETCH_MEMBER_PENDING,
  FETCH_MEMBER_SUCCESS,
  FETCH_MEMBER_DUPLICATES_SUCCESS,
  INSERT_COMMENT_SUCCESS,
  OPEN_MEMBER,
  PAY_MEMBER_SUCCESS,
  PRINT_END,
  PRINT_START,
  RENEW_MEMBER_SUCCESS,
  UPDATE_COMMENT_SUCCESS,
} from '../actions/actionTypes';
import createReducer from './reducerFactory';
import Member from '../lib/models/Member';

const initialState = {
  amount: 0,
  duplicates: [],
  isLoading: false,
  member: new Member(),
  no: 0,
  isPrinting: false,
};

const handlers = {
  [DELETE_COMMENT_SUCCESS]: (state, action) => ({
    ...state,
    member: new Member({
      ...state.member,
      account: {
        ...state.member.account,
        comment: state.member.account.comment.filter(comment => comment.id !== action.comment.id),
      },
    }),
  }),
  [DELETE_MEMBER_SUCCESS]: () => initialState,
  [FETCH_MEMBER_FAIL]: state => ({
    ...state,
    isLoading: false,
  }),
  [FETCH_MEMBER_PENDING]: state => ({
    ...state,
    isLoading: true,
    member: new Member(),
  }),
  [FETCH_MEMBER_SUCCESS]: (state, action) => ({
    ...state,
    isLoading: false,
    member: new Member(action.member),
  }),
  [FETCH_MEMBER_DUPLICATES_SUCCESS]: (state, action) => ({
    ...state,
    duplicates: action.duplicates,
  }),
  [INSERT_COMMENT_SUCCESS]: (state, action) => ({
    ...state,
    member: new Member({
      ...state.member,
      account: {
        ...state.member.account,
        comment: [
          ...state.member.account.comment,
          action.comment,
        ],
      },
    }),
  }),
  [OPEN_MEMBER]: (state, action) => ({
    ...state,
    no: action.no,
  }),
  [PAY_MEMBER_SUCCESS]: (state, action) => ({
    ...state,
    member: new Member({
      ...state.member,
      account: {
        ...state.member.account,
        copies: action.copies,
      },
    }),
  }),
  [PRINT_END]: state => ({
    ...state,
    isPrinting: false,
  }),
  [PRINT_START]: (state, action) => ({
    ...state,
    amount: action.amount,
    isPrinting: true,
  }),
  [RENEW_MEMBER_SUCCESS]: state => ({
    ...state,
    member: new Member({
      ...state.member,
      account: {
        ...state.member.account,
        lastActivity: new Date(),
      },
    }),
  }),
  [UPDATE_COMMENT_SUCCESS]: (state, action) => ({
    ...state,
    member: new Member({
      ...state.member,
      account: {
        ...state.member.account,
        comment: state.member.account.comment.map((comment) => {
          if (comment.id === action.comment.id) {
            return action.comment;
          }

          return comment;
        }),
      },
    }),
  }),
};

export default createReducer(initialState, handlers);
