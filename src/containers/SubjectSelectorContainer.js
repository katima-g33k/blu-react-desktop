import { connect } from 'react-redux';

import { fetch } from '../actions/subjectActions';
import SubjectSelector from '../components/general/SubjectSelector';

const mapStateToProps = ({ appStore, subjectStore }) => ({
  api: appStore.apiClient,
  subjectsByCategory: subjectStore.subjectsByCategory,
});

const mapDispatchToProps = dispatch => ({
  fetch: api => dispatch(fetch(api)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  onChange: ownProps.onChange,
  fetch: () => dispatchProps.fetch(stateProps.api),
  subjectsByCategory: stateProps.subjectsByCategory,
  value: ownProps.value,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SubjectSelector);
