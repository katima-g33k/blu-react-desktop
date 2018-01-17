import {
  FETCH_MEMBER_FAIL,
  FETCH_MEMBER_PENDING,
  FETCH_MEMBER_SUCCESS,
  OPEN_MEMBER,
  PAY_MEMBER_SUCCESS,
  RENEW_MEMBER_SUCCESS,
  PRINT_END,
  PRINT_START,
} from '../actions/actionTypes';
import Member from '../lib/models/Member';

const initialState = {
  amount: 0,
  isLoading: false,
  member: new Member(),
  no: 0,
  printing: false,
};

export default function memberReducer(state = initialState, action = {}) {
  switch (action.type) {
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
        printing: false,
      };
    case PRINT_START:
      return {
        ...state,
        amount: action.amount,
        printing: true,
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
    default:
      return state;
  }
}
