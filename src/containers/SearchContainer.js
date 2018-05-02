import { connect } from 'react-redux';

import Search from '../components/search/Search';
import {
  cancelSearch,
  search,
  updateArchives,
  updateSearchValue,
  updateType,
} from '../actions/searchActions';

const mapStateToProps = ({ searchStore }) => ({
  archives: searchStore.archives,
  isLoading: searchStore.isLoading,
  type: searchStore.type,
  value: searchStore.value,
});

const mapDispatchToProps = dispatch => ({
  cancelSearch: () => dispatch(cancelSearch()),
  handleArchive: () => dispatch(updateArchives()),
  handleInput: event => dispatch(updateSearchValue(event.target.value)),
  handleSearch: (value, type, archives) => dispatch(search(value, type, archives)),
  handleType: event => dispatch(updateType(event.target.value)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  cancelSearch: (event) => {
    event.preventDefault();
    dispatchProps.cancelSearch();
  },
  handleSearch: (event) => {
    event.preventDefault();
    dispatchProps.handleSearch(stateProps.value, ownProps.type || stateProps.type, stateProps.archives);
  },
});


const container = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Search);
container.TYPES = Search.TYPES;

export default container;
