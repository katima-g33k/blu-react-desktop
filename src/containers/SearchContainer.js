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
  api: appStore.apiClient,
  archives: searchStore.archives,
  isLoading: searchStore.isLoading,
  type: searchStore.type,
  value: searchStore.value,
});

const mapDispatchToProps = dispatch => ({
  cancelSearch: () => dispatch(cancel()),
  handleArchive: () => dispatch(updateArchives()),
  handleInput: event => dispatch(updateValue(event.target.value)),
  handleSearch: (api, value, type, archives) => dispatch(search(api, value, type, archives)),
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
    dispatchProps.handleSearch(stateProps.api, stateProps.value, type, stateProps.archives);
  },
});


const container = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Search);
container.TYPES = Search.TYPES;

export default container;
