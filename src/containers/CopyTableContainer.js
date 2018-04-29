import { connect } from 'react-redux';

import {
  cancelCopyReservation,
  cancelSell,
  deleteCopy,
  reserveCopy,
  sellCopy,
  updateCopy,
  updateFilter,
} from '../actions/copyActions';
import CopyTable from '../components/copy/table/CopyTable';

const mapStateToProps = ({ copyStore, memberStore }) => ({
  data: copyStore.filteredCopies,
  filters: copyStore.filters,
  memberNo: memberStore.member.no,
});

const mapDispatchToProps = dispatch => ({
  cancelReservation: copy => dispatch(cancelCopyReservation(copy)),
  deleteCopy: copy => dispatch(deleteCopy(copy)),
  refundCopy: copy => dispatch(cancelSell(copy)),
  reserveCopy: copy => dispatch(reserveCopy(copy)),
  sellCopy: (copy, memberNo, halfPrice) => dispatch(sellCopy(copy, memberNo, halfPrice)),
  updateCopy: copy => dispatch(updateCopy(copy)),
  updateFilter: (filter, value) => dispatch(updateFilter(filter, value)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  sellCopy: copy => dispatchProps.sellCopy(copy, stateProps.memberNo),
  sellCopyHalfPrice: copy => dispatchProps.sellCopy(copy, stateProps.memberNo, true),
  updateFilter: (event) => {
    const filter = event.target.id;
    const value = filter === 'search' ? event.target.value : event.target.checked;

    dispatchProps.updateFilter(filter, value);
  },
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CopyTable);