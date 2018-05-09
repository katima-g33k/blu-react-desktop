import { connect } from 'react-redux';

import { remove } from '../actions/reservationActions';
import ReservationList from '../components/item/view/ReservationList';

const mapStateToProps = ({ appStore }) => ({
  api: appStore.apiClient,
});

const mapDispatchToProps = dispatch => ({
  onDelete: (api, reservation) => dispatch(remove(api, reservation)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  onDelete: reservation => dispatchProps.onDelete(stateProps.api, reservation),
  reservations: ownProps.reservations,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReservationList);
