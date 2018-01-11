import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { openResult } from '../actions/searchActions';
import SearchResults from '../components/search/SearchResults';

const mapStateToProps = ({ searchStore }) => ({
  data: searchStore.data,
  highlight: searchStore.value,
  isLoading: searchStore.isLoading,
  type: searchStore.type,
});

const mapDispatchToProps = dispatch => ({
  onAddButton: ({ type }) => browserHistory.push(`${type}/add`),
  onRowClick: data => dispatch(openResult(data)),
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
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SearchResults);
