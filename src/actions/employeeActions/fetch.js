import { Employee } from '../../lib/models';
import {
  FETCH_EMPLOYEES_FAIL,
  FETCH_EMPLOYEES_PENDING,
  FETCH_EMPLOYEES_SUCCESS,
} from '../actionTypes';

const pending = () => ({
  type: FETCH_EMPLOYEES_PENDING,
});

const success = employees => ({
  employees,
  type: FETCH_EMPLOYEES_SUCCESS,
});

const fail = error => ({
  error,
  type: FETCH_EMPLOYEES_FAIL,
});

export default api => async (dispatch) => {
  dispatch(pending());

  try {
    const response = await api.employee.list();
    const employees = response.map(row => new Employee(row));
    dispatch(success(employees));
  } catch (error) {
    dispatch(fail(error));
  }
};
