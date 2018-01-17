import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import MemberActionPanel from '../components/member/view/MemberActionPanel';
import {
  openReactivateModal,
  openTransferModal,
  openDeleteModal,
  openPayModal,
  renewMember,
  startPrinting,
} from '../actions/memberActions';

const mapStateToProps = ({ memberStore: { member } }) => ({
  canDelete: !!member.account.copies.length,
  isActive: member.account.isActive,
  member,
  userIsAdmin: JSON.parse(sessionStorage.getItem('user')).isAdmin,
});

const mapDispatchToProps = dispatch => ({
  addCopies: no => browserHistory.push(`/member/copies/${no}`),
  delete: no => dispatch(openDeleteModal(no)),
  modify: no => browserHistory.push(`/member/edit/${no}`),
  pay: member => dispatch(openPayModal(member)),
  printReceipt: () => dispatch(startPrinting()),
  reactivate: member => dispatch(openReactivateModal(member)),
  renew: no => dispatch(renewMember(no)),
  transfer: member => dispatch(openTransferModal(member)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  addCopies: () => dispatchProps.addCopies(stateProps.member.no),
  delete: () => dispatchProps.delete(stateProps.member.no),
  modify: () => dispatchProps.modify(stateProps.member.no),
  pay: () => dispatchProps.pay(stateProps.member),
  reactivate: () => dispatchProps.reactivate(stateProps.member),
  renew: () => dispatchProps.renew(stateProps.member.no),
  transfer: () => dispatchProps.transfer(stateProps.member),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MemberActionPanel);
