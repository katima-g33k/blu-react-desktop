import { connect } from 'react-redux';

import { fetch } from '../actions/itemActions';
import ItemView from '../components/item/view/ItemView';

const mapStateToProps = ({ appStore, itemStore }) => ({
  api: appStore.apiClient,
  isLoading: itemStore.isLoading,
  item: itemStore.item,
});

const mapDispatchToProps = dispatch => ({
  fetch: (id, api) => dispatch(fetch(api, id, true)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  fetch: () => dispatchProps.fetch(stateProps.id || ownProps.params.id, stateProps.api),
  isLoading: stateProps.isLoading,
  item: stateProps.item,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ItemView);
