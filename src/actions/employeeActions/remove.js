import {
  REMOVE_EMPLOYEE_FAIL,
  REMOVE_EMPLOYEE_PENDING,
  REMOVE_EMPLOYEE_SUCCESS,
} from '../actionTypes';

const pending = () => ({
  type: REMOVE_EMPLOYEE_PENDING,
});

const success = employee => ({
  employee,
  type: REMOVE_EMPLOYEE_SUCCESS,
});

const fail = error => ({
  error,
  type: REMOVE_EMPLOYEE_FAIL,
});

export default (employee, api) => async (dispatch) => {
  dispatch(pending());

  try {
    await api.employee.delete(employee.id);
    dispatch(success(employee));
  } catch (error) {
    dispatch(fail(error));
  }
};
