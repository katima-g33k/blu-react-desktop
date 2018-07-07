import { connect } from 'react-redux';

import SettingsView from '../components/settings/SettingsView';
import { update } from '../actions/settingsActions';

const mapStateToProps = ({ settingsStore, userStore }) => ({
  apiKey: settingsStore.apiKey,
  apiUrl: settingsStore.apiUrl,
  isInitialSetup: !(settingsStore.apiKey && settingsStore.apiUrl && settingsStore.secretKey),
  userIsAdmin: userStore.user.isAdmin,
  secretKey: settingsStore.secretKey,
});

const mapDispatchToProps = dispatch => ({
  onSave: settings => dispatch(update(settings)),
});

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SettingsView);
