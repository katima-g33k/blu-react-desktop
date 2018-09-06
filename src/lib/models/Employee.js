export default class Employee {
  constructor(employeeData) {
    const employee = employeeData || {};

    this.id = employee.id || 0;
    this.username = employee.username || '';
    this.isAdmin = employee.isAdmin || false;
    this.isActive = employee.isActive || true;
    this.password = employee.password || '';
  }

  clone = () => new Employee(this)
}
