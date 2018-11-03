import { connect } from 'react-redux';

import {
  confirmDelete,
  openInsertCommentModal,
  openUpdateCommentModal,
} from '../actions/commentActions';
import MemberComments from '../components/member/view/MemberComments';

const mapStateToProps = ({ appStore, memberStore }) => ({
  api: appStore.apiClient,
  comments: memberStore.member.account.comment,
  no: memberStore.member.no,
});

const mapDispatchToProps = dispatch => ({
  onDelete: (api, comment) => dispatch(confirmDelete(api, comment)),
  onInsert: (api, no) => dispatch(openInsertCommentModal(api, no)),
  onUpdate: (api, comment) => dispatch(openUpdateCommentModal(api, comment.id, `${comment}`)),
});

const mergeProps = (stateProps, dispatchProps) => ({
  comments: stateProps.comments,
  onDelete: comment => dispatchProps.onDelete(stateProps.api, comment),
  onInsert: () => dispatchProps.onInsert(stateProps.api, stateProps.no),
  onUpdate: comment => dispatchProps.onUpdate(stateProps.api, comment),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MemberComments);
