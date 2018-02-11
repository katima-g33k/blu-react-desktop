import {
  UPDATE_COPY_TABLE_FILTER,
} from '../actionTypes';

export default (filter, value) => ({
  filter,
  value,
  type: UPDATE_COPY_TABLE_FILTER,
});
