import createReducer from './reducerFactory';
import {
  FETCH_EMPLOYEES_SUCCESS,
  INSERT_EMPLOYEE_SUCCESS,
  REMOVE_EMPLOYEE_SUCCESS,
  SET_CURRENT_EMPLOYEE,
  UPDATE_EMPLOYEE_SUCCESS,
} from '../actions/actionTypes';

const initialState = {
  employee: null,
  employees: [],
};

const handlers = {
  [FETCH_EMPLOYEES_SUCCESS]: (state, { employees }) => ({
    ...state,
    employees,
  }),
  [INSERT_EMPLOYEE_SUCCESS]: (state, { employee }) => ({
    ...state,
    employees: [...state.employees, employee],
  }),
  [REMOVE_EMPLOYEE_SUCCESS]: (state, action) => ({
    ...state,
    employees: state.employees.filter(employee => employee.id !== action.employee.id),
  }),
  [SET_CURRENT_EMPLOYEE]: (state, { employee }) => ({
    ...state,
    employee,
  }),
  [UPDATE_EMPLOYEE_SUCCESS]: (state, action) => ({
    ...state,
    employees: state.employees.map((employee) => {
      if (employee.id === action.employee.id) {
        return action.employee;
      }

      return employee;
    }),
  }),
};

export default createReducer(initialState, handlers);
