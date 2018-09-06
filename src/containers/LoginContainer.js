import { connect } from 'react-redux';

import { login } from '../actions/userActions';
import Login from '../components/login/Login';

const mapStateToProps = ({ appStore, settingsStore }) => ({
  api: appStore.apiClient,
  secretKey: settingsStore.secretKey,
});

const mapDispatchToProps = dispatch => ({
  onLogin: (username, password, secretKey, api) => dispatch(login(username, password, secretKey, api)),
});

const mergeProps = (stateProps, dispatchProps) => ({
  onLogin: (username, password) => dispatchProps.onLogin(username, password, stateProps.secretKey, stateProps.api),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Login);
