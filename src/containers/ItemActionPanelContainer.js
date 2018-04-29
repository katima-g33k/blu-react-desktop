import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import ItemActionPanel from '../components/item/view/ItemActionPanel';
import {

} from '../actions/itemActions';

const mapStateToProps = ({ itemStore: { item }, appStore }) => ({
  apiClient: appStore.apiClient,
  canDelete: !!item.copies.length,
  id: item.id,
  isRemoved: item.isRemoved,
  isValid: item.isValid,
  status: item.getStatus(),
  storage: item.storage,
  userIsAdmin: JSON.parse(sessionStorage.getItem('user')).isAdmin,
});

const mapDispatchToProps = dispatch => ({
  decreaseStatus: (apiClient, id) => {},
  handleDelete: (apiClient, id) => {},
  handleReserve: (apiClient, id) => {},
  handleUpdateStorage: (apiClient, id, storage) => {},
  increaseStatus: (apiClient, id) => {},
});

const mergeProps = (stateProps, dispatchProps) => ({
  canDelete: stateProps.canDelete,
  decreaseStatus: () => dispatchProps.decreaseStatus(stateProps.apiClient, stateProps.id),
  handleDelete: () => dispatchProps.handleDelete(stateProps.apiClient, stateProps.id),
  handleReserve: () => dispatchProps.handleReserve(stateProps.apiClient, stateProps.id),
  handleUpdateStorage: () => dispatchProps.handleUpdateStorage(stateProps.apiClient, stateProps.id, stateProps.storage),
  increaseStatus: () => dispatchProps.increaseStatus(stateProps.apiClient, stateProps.id),
  isRemoved: stateProps.isRemoved,
  isValid: stateProps.isValid,
  item: stateProps.item,
  modify: () => browserHistory.push(`/item/edit/${stateProps.id}`),
  status: stateProps.status,
  userIsAdmin: stateProps.userIsAdmin,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ItemActionPanel);
