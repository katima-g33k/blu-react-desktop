import { connect } from 'react-redux';

import App from '../App';

const mapStateToProps = ({ appStore }) => ({
  api: appStore.apiClient,
});

const mapDispatchToProps = () => ({});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  api: stateProps.api,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(App);
