import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import MemberActionPanel from '../components/member/view/MemberActionPanel';
import {
  openReactivateModal,
  openTransferModal,
  openDeleteModal,
  openPayModal,
  renew,
  startPrinting,
} from '../actions/memberActions';

const mapStateToProps = ({ appStore, memberStore, userStore }) => ({
  api: appStore.apiClient,
  canDelete: !!memberStore.member.account.copies.length,
  isActive: memberStore.member.account.isActive,
  member: memberStore.member,
  userIsAdmin: userStore.user.isAdmin,
});

const mapDispatchToProps = dispatch => ({
  addCopies: no => browserHistory.push(`/member/copies/${no}`),
  delete: (api, no) => dispatch(openDeleteModal(api, no)),
  modify: no => browserHistory.push(`/member/edit/${no}`),
  pay: (api, member) => dispatch(openPayModal(api, member)),
  printReceipt: () => dispatch(startPrinting()),
  reactivate: (api, member) => dispatch(openReactivateModal(api, member)),
  renew: (api, no) => dispatch(renew(api, no)),
  transfer: (api, member) => dispatch(openTransferModal(api, member)),
});

const mergeProps = (stateProps, dispatchProps) => ({
  addCopies: () => dispatchProps.addCopies(stateProps.member.no),
  canDelete: stateProps.canDelete,
  delete: () => dispatchProps.delete(stateProps.api, stateProps.member.no),
  isActive: stateProps.isActive,
  modify: () => dispatchProps.modify(stateProps.member.no),
  pay: () => dispatchProps.pay(stateProps.api, stateProps.member),
  printReceipt: dispatchProps.printReceipt,
  reactivate: () => dispatchProps.reactivate(stateProps.api, stateProps.member),
  renew: () => dispatchProps.renew(stateProps.api, stateProps.member.no),
  transfer: () => dispatchProps.transfer(stateProps.api, stateProps.member),
  userIsAdmin: stateProps.userIsAdmin,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MemberActionPanel);
