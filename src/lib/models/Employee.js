export default class Employee {
  constructor(employee = {}) {
    this.id = employee.id;
    this.username = employee.username;
    this.isAdmin = employee.isAdmin;
    this.isActive = employee.isActive;

    this.setPassword = false;
    this.confirmPassword = false;
  }
}
