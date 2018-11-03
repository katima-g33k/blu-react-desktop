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
  onCancel: () => dispatch(cancel()),
  onArchiveChange: () => dispatch(updateArchives()),
  onInput: value => dispatch(updateValue(value)),
  onSearch: (api, value, type, archives) => dispatch(search(api, value, type, archives)),
  onTypeChange: value => dispatch(updateType(value)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const type = ownProps.type || stateProps.type;

  return {
    archives: stateProps.archives,
    disableAddButton: ownProps.disableAddButton,
    disableArchive: ownProps.disableArchive,
    disableTypeSelection: ownProps.disableTypeSelection,
    isLoading: stateProps.isLoading,
    noHeader: ownProps.noHeader,
    onAddButton: ownProps.onAddButton,
    onArchiveChange: dispatchProps.onArchiveChange,
    onCancel: dispatchProps.onCancel,
    onInput: dispatchProps.onInput,
    onRowClick: ownProps.onRowClick,
    onSearch: () => dispatchProps.onSearch(stateProps.api, stateProps.value, type, stateProps.archives),
    onTypeChange: dispatchProps.onTypeChange,
    type,
    value: stateProps.value,
  };
};


const SearchContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Search);
SearchContainer.TYPES = Search.TYPES;

export default SearchContainer;
