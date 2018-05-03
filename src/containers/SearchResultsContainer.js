import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { openResult, resetSearch } from '../actions/searchActions';
import SearchResults from '../components/search/SearchResults';

const mapStateToProps = ({ searchStore }) => ({
  data: searchStore.data,
  highlight: searchStore.value,
  isLoading: searchStore.isLoading,
  onRowClick: searchStore.onRowClick,
  type: searchStore.type,
});

const mapDispatchToProps = dispatch => ({
  onAddButton: ({ type }) => browserHistory.push(`${type}/add`),
  onRowClick: (data, type) => dispatch(openResult(type, data.id || data.no)),
  resetSearch: () => dispatch(resetSearch()),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onAddButton: () => {
    if (ownProps.onAddButton) {
      return ownProps.onAddButton(stateProps);
    }

    return dispatchProps.onAddButton(stateProps);
  },
  onRowClick: (data) => {
    (stateProps.onRowClick || dispatchProps.onRowClick)(data, stateProps.type);
    dispatchProps.resetSearch();
  },
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SearchResults);
