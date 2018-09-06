import { connect } from 'react-redux';

import {
  fetchAmountDue,
  fetchByInterval,
} from '../actions/statisticsActions';
import Statistics from '../components/admin/Statistics';

const mapStateToProps = ({ appStore, statisticsStore }) => ({
  amountDue: statisticsStore.amountDue,
  api: appStore.apiClient,
  dataByInterval: statisticsStore.dataByInterval,
});

const mapDispatchToProps = dispatch => ({
  fetchAmountDue: (date, api) => dispatch(fetchAmountDue(date, api)),
  fetchByInterval: (startDate, endDate, api) => dispatch(fetchByInterval(startDate, endDate, api)),
});

const mergeProps = (stateProps, dispatchProps) => ({
  amountDue: stateProps.amountDue,
  dataByInterval: stateProps.dataByInterval,
  fetchAmountDue: date => dispatchProps.fetchAmountDue(date, stateProps.api),
  fetchByInterval: (startDate, endDate) => dispatchProps.fetchByInterval(startDate, endDate, stateProps.api),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Statistics);
