import { connect } from 'react-redux';

import EmployeesTable from '../components/admin/EmployeesTable';
import {
  fetch,
  openRemoveModal,
  setCurrent,
} from '../actions/employeeActions';

const mapStateToProps = ({ appStore, employeeStore }) => ({
  api: appStore.apiClient,
  employees: employeeStore.employees,
});

const mapDispatchToProps = dispatch => ({
  fetch: api => dispatch(fetch(api)),
  onRemove: (employee, api) => dispatch(openRemoveModal(employee, api)),
  setCurrent: employee => dispatch(setCurrent(employee)),
});

const mergeProps = (stateProps, dispatchProps) => ({
  employees: stateProps.employees,
  fetch: () => dispatchProps.fetch(stateProps.api),
  onRemove: employee => dispatchProps.onRemove(employee, stateProps.api),
  setCurrent: dispatchProps.setCurrent,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(EmployeesTable);
