import {
  DELETE_COMMENT_SUCCESS,
  FETCH_MEMBER_FAIL,
  FETCH_MEMBER_PENDING,
  FETCH_MEMBER_SUCCESS,
  INSERT_COMMENT_SUCCESS,
  OPEN_MEMBER,
  PAY_MEMBER_SUCCESS,
  PRINT_END,
  PRINT_START,
  RENEW_MEMBER_SUCCESS,
  UPDATE_COMMENT_SUCCESS,
} from '../actions/actionTypes';
import Member from '../lib/models/Member';

const initialState = {
  amount: 0,
  isLoading: false,
  member: new Member(),
  no: 0,
  isPrinting: false,
};

export default function memberReducer(state = initialState, action = {}) {
  switch (action.type) {
    case DELETE_COMMENT_SUCCESS:
      return {
        ...state,
        member: new Member({
          ...state.member,
          account: {
            ...state.member.account,
            comment: state.member.account.comment.filter(comment => comment.id !== action.comment.id),
          },
        }),
      };
    case FETCH_MEMBER_FAIL:
      return {
        ...state,
        isLoading: false,
      };
    case FETCH_MEMBER_PENDING:
      return {
        ...state,
        isLoading: true,
        member: new Member(),
      };
    case FETCH_MEMBER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        member: new Member(action.member),
      };
    case INSERT_COMMENT_SUCCESS:
      return {
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
      };
    case OPEN_MEMBER:
      return {
        ...state,
        no: action.no,
      };
    case PAY_MEMBER_SUCCESS:
      return {
        ...state,
        member: new Member({
          ...state.member,
          account: {
            ...state.member.account,
            copies: action.copies,
          },
        }),
      };
    case PRINT_END:
      return {
        ...state,
        isPrinting: false,
      };
    case PRINT_START:
      return {
        ...state,
        amount: action.amount,
        isPrinting: true,
      };
    case RENEW_MEMBER_SUCCESS:
      return {
        ...state,
        member: new Member({
          ...state.member,
          account: {
            ...state.member.account,
            lastActivity: new Date(),
          },
        }),
      };
    case UPDATE_COMMENT_SUCCESS:
      return {
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
      };
    default:
      return state;
  }
}
