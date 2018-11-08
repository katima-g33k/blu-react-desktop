import createReducer from './reducerFactory';
import {
  CANCEL_COPY_RESERVATION_SUCCESS,
  CANCEL_SELL_SUCCESS,
  DELETE_COPY_SUCCESS,
  DELETE_RESERVATION_SUCCESS,
  INSERT_COPY_SUCCESS,
  RESERVE_COPY_SUCCESS,
  RESET_COPIES,
  SELL_COPY_SUCCESS,
  SET_COPIES,
  TRANSFER_MEMBER_ACCOUNT_SUCCESS,
  UPDATE_COPY_SUCCESS,
  UPDATE_COPY_TABLE_FILTER,
} from '../actions/actionTypes';

const filterCopiesList = (copies, deletedCopy) => copies.filter(copy => copy.id !== deletedCopy.id);

const updateCopiesList = (copies, updatedCopy) => copies.map((copy) => {
  if (copy.id === updatedCopy.id) {
    return updatedCopy;
  }

  return copy;
});

const updateFilteredCopiesList = (copies, filters) => copies.filter((copy) => {
  if ((!filters.sold && copy.isSold) || (!filters.reserved && copy.isReserved)
    || (!filters.paid && copy.isPaid) || (!filters.added && copy.isAdded)) {
    return false;
  }

  if (filters.search) {
    const regex = new RegExp(filters.search, 'i');

    if (copy.item) {
      return regex.test(copy.item.name) || regex.test(copy.item.editor);
    }

    return regex.test(copy.member.name);
  }

  return true;
});

const initialState = {
  copies: [],
  filteredCopies: [],
  filters: {
    search: '',
    added: true,
    sold: true,
    paid: true,
    reserved: true,
  },
};

const handlers = {
  [CANCEL_COPY_RESERVATION_SUCCESS]: (state, action) => ({
    ...state,
    copies: updateCopiesList(state.copies, action.copy),
    filteredCopies: updateCopiesList(state.filteredCopies, action.copy),
  }),
  [CANCEL_SELL_SUCCESS]: (state, action) => ({
    ...state,
    copies: updateCopiesList(state.copies, action.copy),
    filteredCopies: updateCopiesList(state.filteredCopies, action.copy),
  }),
  [DELETE_COPY_SUCCESS]: (state, action) => ({
    ...state,
    copies: filterCopiesList(state.copies, action.copy),
    filteredCopies: filterCopiesList(state.filteredCopies, action.copy),
  }),
  [DELETE_RESERVATION_SUCCESS]: (state, action) => {
    if (action.reservation.copy) {
      const copy = action.reservation.copy.clone();
      copy.cancelReservation();

      return {
        ...state,
        copies: updateCopiesList(state.copies, copy),
        filteredCopies: updateCopiesList(state.filteredCopies, copy),
      };
    }

    return state;
  },
  [INSERT_COPY_SUCCESS]: (state, action) => ({
    ...state,
    copies: [...state.copies, action.copy],
  }),
  [RESERVE_COPY_SUCCESS]: (state, action) => ({
    ...state,
    copies: updateCopiesList(state.copies, action.copy),
    filteredCopies: updateCopiesList(state.filteredCopies, action.copy),
  }),
  [RESET_COPIES]: () => initialState,
  [SELL_COPY_SUCCESS]: (state, action) => ({
    ...state,
    copies: updateCopiesList(state.copies, action.copy),
    filteredCopies: updateCopiesList(state.filteredCopies, action.copy),
  }),
  [SET_COPIES]: (state, action) => ({
    ...initialState,
    copies: action.copies,
    filteredCopies: action.copies,
  }),
  [TRANSFER_MEMBER_ACCOUNT_SUCCESS]: (state, action) => ({
    ...initialState,
    copies: action.copies,
    filteredCopies: action.copies,
  }),
  [UPDATE_COPY_SUCCESS]: (state, action) => ({
    ...state,
    copies: updateCopiesList(state.copies, action.copy),
    filteredCopies: updateCopiesList(state.filteredCopies, action.copy),
  }),
  [UPDATE_COPY_TABLE_FILTER]: (state, action) => ({
    ...state,
    filteredCopies: updateFilteredCopiesList(state.copies, { ...state.filters, [action.filter]: action.value }),
    filters: {
      ...state.filters,
      [action.filter]: action.value,
    },
  }),
};

export default createReducer(initialState, handlers);
