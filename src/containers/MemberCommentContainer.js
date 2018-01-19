import { connect } from 'react-redux';

import {
  deleteComment,
  insertComment,
  openCommentModal,
  updateComment,
} from '../actions/commentActions';
import MemberComments from '../components/member/view/MemberComments';

const mapStateToProps = ({ commentStore: { comment }, memberStore: { member } }) => ({
  activeComment: comment,
  comments: member.account.comment,
  no: member.no,
});

const mapDispatchToProps = dispatch => ({
  openCommentModal: () => dispatch(openCommentModal()),
  openDeleteConfirmation: () => dispatch({}),
  delete: comment => dispatch(deleteComment(comment)),
  insert: (no, comment) => dispatch(insertComment(no, comment)),
  update: (id, comment) => dispatch(updateComment(id, comment)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MemberComments);
