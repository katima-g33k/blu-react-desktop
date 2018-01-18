import { connect } from 'react-redux';

import { openCommentModal } from '../actions/commentActions';
import MemberComments from '../components/member/view/MemberComments';

const mapStateToProps = ({ memberStore: { member } }) => ({
  comments: member.account.comment,
  no: member.no,
});

const mapDispatchToProps = dispatch => ({
  openCommentModal: () => dispatch(openCommentModal()),
  openDeleteConfirmation: () => dispatch({}),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MemberComments);
