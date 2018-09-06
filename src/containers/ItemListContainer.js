import { connect } from 'react-redux';

import { fetchList } from '../actions/itemActions';
import ItemList from '../components/admin/ItemList';

const mapStateToProps = ({ appStore, itemStore }) => ({
  api: appStore.apiClient,
  isLoading: itemStore.isLoading,
  items: itemStore.items,
});

const mapDispatchToProps = dispatch => ({
  fetch: api => dispatch(fetchList(api)),
});

const mergeProps = (stateProps, dispatchProps) => ({
  fetch: () => dispatchProps.fetch(stateProps.api),
  isLoading: stateProps.isLoading,
  items: stateProps.items,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ItemList);
