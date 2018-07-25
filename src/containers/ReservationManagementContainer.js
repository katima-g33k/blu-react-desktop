import { connect } from 'react-redux';

import { fetch, openClearModal } from '../actions/reservationActions';
import ReservationManagement from '../components/admin/ReservationManagement';

const mapStateToProps = ({ appStore, reservationsStore }) => ({
  api: appStore.apiClient,
  reservations: reservationsStore.reservations,
});

const mapDispatchToProps = dispatch => ({
  onClear: api => dispatch(openClearModal(api)),
  fetch: api => dispatch(fetch(api)),
});

const mergeProps = (stateProps, dispatchProps) => ({
  onClear: () => dispatchProps.onClear(stateProps.api),
  fetch: () => dispatchProps.fetch(stateProps.api),
  reservations: stateProps.reservations,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReservationManagement);
