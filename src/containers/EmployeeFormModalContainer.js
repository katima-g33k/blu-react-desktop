import { connect } from 'react-redux';

import EmployeeFormModal from '../components/general/modals/EmployeeFormModal';
import {
  insert,
  setCurrent,
  update,
} from '../actions/employeeActions';

const mapStateToProps = ({ appStore, employeeStore }) => ({
  api: appStore.apiClient,
  employee: employeeStore.employee,
});

const mapDispatchToProps = dispatch => ({
  onInsert: (employee, api) => dispatch(insert(employee, api)),
  onUpdate: (id, employee, api) => dispatch(update(id, employee, api)),
  resetCurrent: () => dispatch(setCurrent(null)),
});

const mergeProps = (stateProps, dispatchProps) => ({
  employee: stateProps.employee,
  onCancel: dispatchProps.resetCurrent,
  onSave: (employee) => {
    if (stateProps.employee && stateProps.employee.id) {
      dispatchProps.onUpdate(stateProps.employee.id, employee, stateProps.api);
    } else {
      dispatchProps.onInsert(employee, stateProps.api);
    }

    dispatchProps.resetCurrent();
  },
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(EmployeeFormModal);
