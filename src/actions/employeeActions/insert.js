import {
  INSERT_EMPLOYEE_FAIL,
  INSERT_EMPLOYEE_PENDING,
  INSERT_EMPLOYEE_SUCCESS,
} from '../actionTypes';

const pending = () => ({
  type: INSERT_EMPLOYEE_PENDING,
});

const success = employee => ({
  employee,
  type: INSERT_EMPLOYEE_SUCCESS,
});

const fail = error => ({
  error,
  type: INSERT_EMPLOYEE_FAIL,
});

export default (employee, api) => async (dispatch) => {
  dispatch(pending());

  try {
    const { id } = await api.employee.insert(employee);
    const insertedEmployee = employee.clone();
    insertedEmployee.id = id;

    dispatch(success(insertedEmployee));
  } catch (error) {
    console.log(error);
    dispatch(fail(error));
  }
};
