import moment from 'moment';

import {
  FETCH_STATISTICS_BY_INTERVAL_FAIL,
  FETCH_STATISTICS_BY_INTERVAL_PENDING,
  FETCH_STATISTICS_BY_INTERVAL_SUCCESS,
} from '../actionTypes';

const pending = () => ({
  type: FETCH_STATISTICS_BY_INTERVAL_PENDING,
});

const success = dataByInterval => ({
  dataByInterval,
  type: FETCH_STATISTICS_BY_INTERVAL_SUCCESS,
});
const fail = error => ({
  error,
  type: FETCH_STATISTICS_BY_INTERVAL_FAIL,
});

export default (startDate, endDate, api) => async (dispatch) => {
  dispatch(pending());

  try {
    const dataByInterval = await api.statistics.byInterval(
      moment(startDate).format('YYYY-MM-DD'),
      moment(endDate).format('YYYY-MM-DD'),
    );
    dispatch(success(dataByInterval));
  } catch (error) {
    dispatch(fail(error));
  }
};
