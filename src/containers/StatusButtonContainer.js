import { connect } from 'react-redux';

import { Item } from '../lib/models';
import StatusButton from '../components/general/StatusButton';
import { updateStatus } from '../actions/itemActions';

const mapStateToProps = ({ itemStore: { item }, appStore }) => ({
  apiClient: appStore.apiClient,
  id: item.id,
  isRemoved: item.isRemoved,
  isValid: item.isValid,
  status: item.getStatus(),
  userIsAdmin: JSON.parse(sessionStorage.getItem('user')).isAdmin,
});

const mapDispatchToProps = dispatch => ({
  updateStatus: (apiClient, id, status) => dispatch(updateStatus(apiClient, id, status)),
});

const mergeProps = (stateProps, dispatchProps) => ({
  disableLeft: stateProps.isRemoved,
  disableRight: stateProps.isValid || (!stateProps.userIsAdmin && stateProps.isRemoved),
  onClickLeft: () => {
    const status = stateProps.isValid ? Item.STATUS.OUTDATED : Item.STATUS.REMOVED;
    dispatchProps.updateStatus(stateProps.apiClient, stateProps.id, status);
  },
  onClickRight: () => {
    const status = stateProps.isRemoved ? Item.STATUS.OUTDATED : Item.STATUS.VALID;
    dispatchProps.updateStatus(stateProps.apiClient, stateProps.id, status);
  },
  status: stateProps.status,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(StatusButton);
