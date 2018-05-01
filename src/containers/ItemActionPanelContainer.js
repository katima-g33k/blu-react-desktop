import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import ItemActionPanel from '../components/item/view/ItemActionPanel';
import {
  updateStorage,
} from '../actions/itemActions';

const mapStateToProps = ({ itemStore: { item }, appStore }) => ({
  apiClient: appStore.apiClient,
  canDelete: !!item.copies.length,
  id: item.id,
  storage: item.storage,
  userIsAdmin: JSON.parse(sessionStorage.getItem('user')).isAdmin,
});

const mapDispatchToProps = dispatch => ({
  handleDelete: (apiClient, id) => {},
  handleReserve: (apiClient, id) => {},
  handleUpdateStorage: (apiClient, id, storage) => dispatch(updateStorage(apiClient, id, storage)),
});

const mergeProps = (stateProps, dispatchProps) => ({
  canDelete: stateProps.canDelete,
  handleDelete: () => dispatchProps.handleDelete(stateProps.apiClient, stateProps.id),
  handleReserve: () => dispatchProps.handleReserve(stateProps.apiClient, stateProps.id),
  handleUpdateStorage: () => dispatchProps.handleUpdateStorage(stateProps.apiClient, stateProps.id, stateProps.storage),
  modify: () => browserHistory.push(`/item/edit/${stateProps.id}`),
  userIsAdmin: stateProps.userIsAdmin,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ItemActionPanel);
