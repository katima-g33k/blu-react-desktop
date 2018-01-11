import { browserHistory } from 'react-router';

import {
  CANCEL_SEARCH,
  OPEN_RESULT,
  SEARCH_FAIL,
  SEARCH_PENDING,
  SEARCH_SUCCESS,
  UPDATE_SEARCH_VALUE,
  UPDATE_TYPE,
  UPDATE_ARCHIVES,
} from './actionTypes';
import API from '../lib/api';
import Item from '../lib/models/Item';
import Member from '../lib/models/Member';

const apiUrl = localStorage.getItem('apiUrl');
const apiKey = localStorage.getItem('apiKey');
const apiClient = new API(apiUrl, apiKey);

export const cancelSearch = () => ({
  type: CANCEL_SEARCH,
});

export const openResult = (data) => {
  browserHistory.push(data.no ? `member/view/${data.no}` : `item/view/${data.id}`);

  return {
    result: data,
    type: OPEN_RESULT,
  };
};

export const updateSearchValue = value => ({
  type: UPDATE_SEARCH_VALUE,
  value,
});

export const updateType = searchType => ({
  searchType,
  type: UPDATE_TYPE,
});

export const updateArchives = () => ({ type: UPDATE_ARCHIVES });

const searchFail = error => ({
  message: error.message,
  title: `Erreur ${error.code}`,
  type: SEARCH_FAIL,
});

const searchPending = () => ({
  type: SEARCH_PENDING,
});

const searchSuccess = (data, Instance) => ({
  Instance,
  data,
  type: SEARCH_SUCCESS,
});

export const search = (value, type, archives) => async (dispatch) => {
  dispatch(searchPending());

  const searchType = type === 'item' ? 'item' : 'member';
  const Instance = searchType === 'item' ? Item : Member;

  try {
    const res = await apiClient[searchType].search(value, archives, type === 'parent');
    dispatch(searchSuccess(res, Instance));
  } catch (error) {
    dispatch(searchFail(error));
  }
};
