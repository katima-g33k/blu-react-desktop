import { connect } from 'react-redux';

import { fetch, endPrinting } from '../actions/memberActions';
import MemberView from '../components/member/view/MemberView';

const mapStateToProps = ({ appStore, memberStore }) => ({
  amount: memberStore.amount,
  apiClient: appStore.apiClient,
  isLoading: memberStore.isLoading,
  isPrinting: memberStore.isPrinting,
  member: memberStore.member,
  no: memberStore.no,
});

const mapDispatchToProps = dispatch => ({
  fetch: (apiClient, no) => dispatch(fetch(apiClient, no)),
  onAfterPrint: () => dispatch(endPrinting()),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  fetch: () => dispatchProps.fetch(stateProps.apiClient, stateProps.no || ownProps.params.no),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MemberView);
