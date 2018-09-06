import {
  Item,
  Member,
} from '../../lib/models';
import {
  SEARCH_FAIL,
  SEARCH_PENDING,
  SEARCH_SUCCESS,
} from '../actionTypes';

const SEARCH_TYPE = {
  item: 'item',
  member: 'member',
  parent: 'member',
};

const INSTANCE = {
  item: Item,
  member: Member,
  parent: Member,
};

const pending = () => ({
  type: SEARCH_PENDING,
});

const success = (data, Instance) => ({
  Instance,
  data,
  type: SEARCH_SUCCESS,
});

const fail = error => ({
  message: error.message,
  title: `Erreur ${error.code}`,
  type: SEARCH_FAIL,
});

export default (api, value, type, archives) => async (dispatch) => {
  dispatch(pending());

  const searchType = SEARCH_TYPE[type];
  const Instance = INSTANCE[type];

  try {
    const searchResults = await api[searchType].search(value, archives, type === 'parent');
    dispatch(success(searchResults, Instance));
  } catch (error) {
    dispatch(fail(error));
  }
};
