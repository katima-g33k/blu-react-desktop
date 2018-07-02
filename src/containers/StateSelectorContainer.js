import { connect } from 'react-redux';

import { fetch } from '../actions/stateActions';
import StateSelector from '../components/general/StateSelector';

const mapStateToProps = ({ appStore, stateStore }) => ({
  api: appStore.apiClient,
  states: stateStore.states,
});

const mapDispatchToProps = dispatch => ({
  onLoad: api => dispatch(fetch(api)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  onChange: ownProps.onChange,
  onLoad: () => dispatchProps.onLoad(stateProps.api),
  states: stateProps.states,
  value: ownProps.value,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(StateSelector);
