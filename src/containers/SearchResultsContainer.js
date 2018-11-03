import { connect } from 'react-redux';

import { openResult, reset } from '../actions/searchActions';
import { historyPush } from '../actions/routeActions';
import SearchResults from '../components/search/SearchResults';

const mapStateToProps = ({ searchStore }) => ({
  data: searchStore.data,
  highlight: searchStore.value,
  isLoading: searchStore.isLoading,
  onRowClick: searchStore.onRowClick,
  type: searchStore.type,
});

const mapDispatchToProps = dispatch => ({
  onAddButton: type => dispatch(historyPush(`${type}/add`)),
  onRowClick: (data, type) => dispatch(openResult(type, data.id || data.no)),
  resetSearch: () => dispatch(reset()),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const onAddButton = ownProps.onAddButton || dispatchProps.onAddButton;
  const onRowClick = ownProps.onRowClick || stateProps.onRowClick || dispatchProps.onRowClick;
  const type = ownProps.type || stateProps.type;

  return {
    data: stateProps.data,
    disableAddButton: ownProps.disableAddButton,
    highlight: stateProps.highlight,
    isLoading: stateProps.isLoading,
    onAddButton: () => onAddButton(type),
    onRowClick: (data) => {
      onRowClick(data, type);
      dispatchProps.resetSearch();
    },
    type,
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SearchResults);
