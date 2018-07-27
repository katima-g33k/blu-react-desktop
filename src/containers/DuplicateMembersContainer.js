import { connect } from 'react-redux';

import DuplicateMembers from '../components/admin/DuplicateMembers';
import { fetchDuplicates } from '../actions/memberActions';

const mapStateToProps = ({ appStore, memberStore }) => ({
  api: appStore.apiClient,
  duplicates: memberStore.duplicates,
});

const mapDispatchToProps = dispatch => ({
  fetch: api => dispatch(fetchDuplicates(api)),
});

const mergeProps = (stateProps, dispatchProps) => ({
  duplicates: stateProps.duplicates,
  fetch: () => dispatchProps.fetch(stateProps.api),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(DuplicateMembers);
