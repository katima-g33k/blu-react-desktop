import { connect } from 'react-redux';

import { historyPush } from '../actions/routeActions';
import {
  remove,
  reserve,
  updateStorage,
} from '../actions/itemActions';
import ItemActionPanel from '../components/item/view/ItemActionPanel';


const mapStateToProps = ({ itemStore: { item }, appStore, userStore }) => ({
  api: appStore.apiClient,
  canDelete: !!item.copies.length,
  id: item.id,
  isInStock: item.isInStock,
  storage: item.storage,
  userIsAdmin: userStore.user.isAdmin,
});

const mapDispatchToProps = dispatch => ({
  handleDelete: (api, id) => dispatch(remove(api, id)),
  handleReserve: (api, id, isInStock) => dispatch(reserve(api, id, isInStock)),
  handleUpdateStorage: (api, id, storage) => dispatch(updateStorage(api, id, storage)),
  onModify: id => dispatch(historyPush(`/item/edit/${id}`)),
});

const mergeProps = (stateProps, dispatchProps) => ({
  canDelete: stateProps.canDelete,
  handleDelete: () => dispatchProps.handleDelete(stateProps.api, stateProps.id),
  handleReserve: () => dispatchProps.handleReserve(stateProps.api, stateProps.id, stateProps.isInStock),
  handleUpdateStorage: () => dispatchProps.handleUpdateStorage(stateProps.api, stateProps.id, stateProps.storage),
  modify: () => dispatchProps.onModify(stateProps.id),
  userIsAdmin: stateProps.userIsAdmin,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ItemActionPanel);
