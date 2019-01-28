import { connect } from 'react-redux';

import {
  cancelReservation,
  cancelSell,
  remove,
  reserve,
  sell,
  update,
  updateFilter,
} from '../actions/copyActions';
import CopyTable from '../components/copy/table/CopyTable';

const mapStateToProps = ({ appStore, copyStore, memberStore }) => ({
  api: appStore.apiClient,
  data: copyStore.filteredCopies,
  filters: copyStore.filters,
  memberNo: memberStore.member.no,
});

const mapDispatchToProps = dispatch => ({
  cancelReservation: (api, copy) => dispatch(cancelReservation(api, copy)),
  onRemove: (api, copy) => dispatch(remove(api, copy)),
  refundCopy: (api, copy) => dispatch(cancelSell(api, copy)),
  reserveCopy: (api, copy) => dispatch(reserve(api, copy)),
  sellCopy: (api, copy, memberNo, halfPrice) => dispatch(sell(api, copy, memberNo, halfPrice)),
  onUpdate: (api, copy) => dispatch(update(api, copy)),
  updateFilter: (filter, value) => dispatch(updateFilter(filter, value)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  cancelReservation: copy => dispatchProps.cancelReservation(stateProps.api, copy),
  columns: ownProps.columns,
  data: stateProps.data,
  deleteCopy: copy => dispatchProps.onRemove(stateProps.api, copy),
  filters: stateProps.filters,
  formatRow: ownProps.formatRow,
  refundCopy: copy => dispatchProps.refundCopy(stateProps.api, copy),
  reserveCopy: copy => dispatchProps.reserveCopy(stateProps.api, copy),
  sellCopy: copy => dispatchProps.sellCopy(stateProps.api, copy, stateProps.memberNo || copy.member.no),
  sellCopyHalfPrice: copy => dispatchProps.sellCopy(stateProps.api, copy, stateProps.memberNo || copy.member.no, true),
  updateCopy: copy => dispatchProps.onUpdate(stateProps.api, copy),
  updateFilter: (event) => {
    const filter = event.target.id;
    const value = filter === 'search' ? event.target.value : event.target.checked;

    dispatchProps.updateFilter(filter, value);
  },
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CopyTable);
