import { connect } from 'react-redux';

import { historyPush } from '../actions/routeActions';
import AddCopiesActionPanel from '../components/copy/addCopies/AddCopiesActionPanel';

const mapStateToProps = ({ memberStore }) => ({
  no: memberStore.member.no,
});

const mapDispatchToProps = dispatch => ({
  onDone: no => dispatch(historyPush(`/member/view/${no}`)),
});

const mergeProps = (stateProps, dispatchProps) => ({
  onDone: () => dispatchProps.onDone(stateProps.no),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(AddCopiesActionPanel);
