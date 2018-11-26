import { connect } from 'react-redux';

import { Item } from '../lib/models';
import StatusButton from '../components/general/StatusButton';
import { updateStatus } from '../actions/itemActions';

const mapStateToProps = ({ appStore, itemStore, userStore }) => ({
  api: appStore.apiClient,
  id: itemStore.item.id,
  isRemoved: itemStore.item.isRemoved,
  isValid: itemStore.item.isValid,
  status: itemStore.item.getStatus(),
  userIsAdmin: userStore.user.isAdmin,
});

const mapDispatchToProps = dispatch => ({
  updateStatus: (api, id, status) => dispatch(updateStatus(api, id, status)),
});

const mergeProps = (stateProps, dispatchProps) => ({
  disableLeft: stateProps.isRemoved,
  disableRight: stateProps.isValid || (!stateProps.userIsAdmin && stateProps.isRemoved),
  onClickLeft: () => {
    const status = stateProps.isValid ? Item.STATUS.OUTDATED : Item.STATUS.REMOVED;
    dispatchProps.updateStatus(stateProps.api, stateProps.id, status);
  },
  onClickRight: () => {
    const status = stateProps.isRemoved ? Item.STATUS.OUTDATED : Item.STATUS.VALID;
    dispatchProps.updateStatus(stateProps.api, stateProps.id, status);
  },
  status: stateProps.status,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(StatusButton);
