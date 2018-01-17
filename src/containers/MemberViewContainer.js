import { connect } from 'react-redux';

import { fetchMember, endPrinting } from '../actions/memberActions';
import MemberView from '../components/member/view/MemberView';

const mapStateToProps = ({ memberStore }) => ({ ...memberStore });

const mapDispatchToProps = dispatch => ({
  fetch: no => dispatch(fetchMember(no)),
  onAfterPrint: () => dispatch(endPrinting()),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  fetch: () => dispatchProps.fetch(stateProps.no || ownProps.params.no),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MemberView);
