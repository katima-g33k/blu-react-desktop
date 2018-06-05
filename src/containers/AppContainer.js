import { connect } from 'react-redux';

import App from '../App';
import { fetch as fetchStates } from '../actions/stateActions';

const mapStateToProps = ({ appStore }) => ({
  api: appStore.apiClient,
});

const mapDispatchToProps = dispatch => ({
  onLoad: api => dispatch(fetchStates(api)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  api: stateProps.api,
  onLoad: () => dispatchProps.onLoad(stateProps.api),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(App);
