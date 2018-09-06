import { connect } from 'react-redux';

import { login } from '../actions/userActions';
import Login from '../components/login/Login';

const mapStateToProps = ({ appStore }) => ({
  api: appStore.apiClient,
});

const mapDispatchToProps = dispatch => ({
  onLogin: (username, password, api) => dispatch(login(username, password, api)),
});

const mergeProps = (stateProps, dispatchProps) => ({
  onLogin: (username, password) => dispatchProps.onLogin(username, password, stateProps.api),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Login);
