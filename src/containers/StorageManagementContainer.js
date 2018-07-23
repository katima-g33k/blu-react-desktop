import { connect } from 'react-redux';

import { fetch, openClearModal } from '../actions/storageActions';
import StorageManagement from '../components/admin/StorageManagement';

const mapStateToProps = ({ appStore, storageStore }) => ({
  api: appStore.apiClient,
  storage: storageStore.storage,
});

const mapDispatchToProps = dispatch => ({
  fetch: api => dispatch(fetch(api)),
  onClear: api => dispatch(openClearModal(api)),
});

const mergeProps = (stateProps, dispatchProps) => ({
  fetch: () => dispatchProps.fetch(stateProps.api),
  onClear: () => dispatchProps.onClear(stateProps.api),
  storage: stateProps.storage,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(StorageManagement);
