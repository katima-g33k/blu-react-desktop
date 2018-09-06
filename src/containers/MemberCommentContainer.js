import { connect } from 'react-redux';

import {
  confirmDelete,
  openInsertCommentModal,
  openUpdateCommentModal,
} from '../actions/commentActions';
import MemberComments from '../components/member/view/MemberComments';

const mapStateToProps = ({ memberStore }) => ({
  comments: memberStore.member.account.comment,
  no: memberStore.member.no,
});

const mapDispatchToProps = dispatch => ({
  onInsert: no => dispatch(openInsertCommentModal(no)),
  onUpdate: comment => dispatch(openUpdateCommentModal(comment.id, `${comment}`)),
  onDelete: comment => dispatch(confirmDelete(comment)),
});

const mergeProps = (stateProps, dispatchProps) => ({
  ...dispatchProps,
  comments: stateProps.comments,
  onInsert: () => dispatchProps.onInsert(stateProps.no),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MemberComments);
