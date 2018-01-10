import {
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
  error,
  type: SEARCH_FAIL,
});

const searchPending = () => ({
  type: SEARCH_PENDING,
});

const searchSuccess = data => ({
  data,
  type: SEARCH_SUCCESS,
});

export const search = (value, type, archives) => async (dispatch) => {
  dispatch(searchPending());

  const searchType = type === 'item' ? 'item' : 'member';
  const Instance = searchType === 'item' ? Item : Member;

  try {
    const res = await apiClient[searchType].search(value, archives, type === 'parent');
    const data = res.map(row => new Instance(row));

    dispatch(searchSuccess(data));
  } catch (error) {
    dispatch(searchFail(error));
  }
};

// event.preventDefault();
// this.logger.trace('search()');
//
// this.setState({ isLoading: true, search: this.state.search.trim() });
// const { archives, search, type } = this.state;
// const searchType = type === 'item' ? 'item' : 'member';

// try {
//   const res = await this.props.api[searchType].search(search, archives, type === 'parent');
//   const Instance = searchType === 'item' ? Item : Member;
//
//   this.setState({
//     data: res.map(row => new Instance(row)),
//     isLoading: false,
//   });
// } catch (error) {
//   this.setState({ error, isLoading: false });
// }
