import {
  CANCEL_COPY_RESERVATION_SUCCESS,
  CANCEL_SELL_SUCCESS,
  DELETE_COPY_SUCCESS,
  RESERVE_COPY_SUCCESS,
  SELL_COPY_SUCCESS,
  SET_COPIES,
  UPDATE_COPY_SUCCESS,
  UPDATE_COPY_TABLE_FILTER,
} from '../actions/actionTypes';

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

const filterCopiesList = (copies, deletedCopy) => copies.filter(copy => copy.id !== deletedCopy.id);

const updateCopiesList = (copies, updatedCopy) => copies.map((copy) => {
  if (copy.id === updatedCopy.id) {
    return updatedCopy;
  }

  return copy;
});

const updateFilteredCopiesList = (copies, filters) => {
  const { added, paid, reserved, search, sold } = filters;

  return copies.filter((copy) => {
    if ((!sold && copy.isSold) || (!reserved && copy.isReserved) ||
      (!paid && copy.isPaid) || (!added && copy.isAdded)) {
      return false;
    }

    if (search) {
      const regex = new RegExp(search, 'i');

      if (copy.item) {
        return regex.test(copy.item.name) || regex.test(copy.item.editor);
      }

      return regex.test(copy.member.name);
    }

    return true;
  });
};

export default function copyTableReducer(state = initialState, action = {}) {
  switch (action.type) {
    case CANCEL_COPY_RESERVATION_SUCCESS:
    case CANCEL_SELL_SUCCESS:
    case RESERVE_COPY_SUCCESS:
    case SELL_COPY_SUCCESS:
    case UPDATE_COPY_SUCCESS:
      return {
        ...state,
        copies: updateCopiesList(state.copies, action.copy),
        filteredCopies: updateCopiesList(state.filteredCopies, action.copy),
      };
    case DELETE_COPY_SUCCESS:
      return {
        ...state,
        copies: filterCopiesList(state.copies, action.copy),
        filteredCopies: filterCopiesList(state.filteredCopies, action.copy),
      };
    case SET_COPIES:
      return {
        ...state,
        copies: action.copies,
        filteredCopies: action.copies,
      };
    case UPDATE_COPY_TABLE_FILTER:
      return {
        ...state,
        filteredCopies: updateFilteredCopiesList(state.copies, { ...state.filters, [action.filter]: action.value }),
        filters: {
          ...state.filters,
          [action.filter]: action.value,
        },
      };
    default:
      return state;
  }
}
