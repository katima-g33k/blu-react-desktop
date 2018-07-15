import {
  UPDATE_EMPLOYEE_FAIL,
  UPDATE_EMPLOYEE_PENDING,
  UPDATE_EMPLOYEE_SUCCESS,
} from '../actionTypes';

const pending = () => ({
  type: UPDATE_EMPLOYEE_PENDING,
});

const success = employee => ({
  employee,
  type: UPDATE_EMPLOYEE_SUCCESS,
});

const fail = error => ({
  error,
  type: UPDATE_EMPLOYEE_FAIL,
});

export default (id, employee, api) => async (dispatch) => {
  dispatch(pending());

  try {
    await api.employee.update(id, employee);
    dispatch(success(employee));
  } catch (error) {
    dispatch(fail(error));
  }
};
