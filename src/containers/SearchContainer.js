import { connect } from 'react-redux';

import Search from '../components/search/Search';
import {
  cancel,
  search,
  updateArchives,
  updateValue,
  updateType,
} from '../actions/searchActions';

const mapStateToProps = ({ appStore, searchStore }) => ({
  api: appStore.apiCliemt,
  archives: searchStore.archives,
  isLoading: searchStore.isLoading,
  type: searchStore.type,
  value: searchStore.value,
});

const mapDispatchToProps = dispatch => ({
  cancelSearch: () => dispatch(cancel()),
  handleArchive: () => dispatch(updateArchives()),
  handleInput: event => dispatch(updateValue(event.target.value)),
  handleSearch: (value, type, archives, api) => dispatch(search(value, type, archives, api)),
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
    const type = ownProps.type || stateProps.type;
    dispatchProps.handleSearch(stateProps.value, type, stateProps.archives, stateProps.api);
  },
});


const container = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Search);
container.TYPES = Search.TYPES;

export default container;
