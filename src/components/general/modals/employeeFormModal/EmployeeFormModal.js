import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonToolbar,
  Col,
  FormGroup,
  Modal,
  Row,
} from 'react-bootstrap';

import { Checkbox, Input } from '../../formInputs';
import { Employee } from '../../../../lib/models';
import i18n from '../../../../lib/i18n';

const { Body, Header, Title } = Modal;

export default class EmployeeFormModal extends Component {
  static propTypes = {
    employee: PropTypes.instanceOf(Employee),
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  };

  static defaultProps = {
    employee: null,
  }

  state = {
    confirmPassword: '',
    employee: new Employee(this.props.employee),
    setPassword: !this.props.employee || !this.props.employee.id,
    show: !!this.props.employee,
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      confirmPassword: '',
      employee: new Employee(nextProps.employee),
      setPassword: !nextProps.employee || !nextProps.employee.id,
      show: !!nextProps.employee,
    });
  }

  getPasswordValidation = () => {
    if (!this.state.setPassword) {
      return null;
    }

    if (!this.state.employee.password || !this.state.confirmPassword) {
      return null;
    }

    return this.state.employee.password === this.state.confirmPassword ? 'success' : 'error';
  }

  getFormValidation = () => this.getPasswordValidation() !== 'error'

  handleOnChange = (event, value) => {
    let { confirmPassword, setPassword } = this.state;
    const { employee } = this.state;
    const id = event.target.id;

    switch (id) {
      case 'confirmPassword':
        confirmPassword = value;
        break;
      case 'setPassword':
        confirmPassword = '';
        employee.password = '';
        setPassword = value;
        break;
      default:
        employee[id] = value;
    }

    this.setState({ confirmPassword, employee, setPassword });
  }

  handleOnSave = () => {
    this.props.onSave(this.state.employee);
  }

  render() {
    const { confirmPassword, employee, show, setPassword } = this.state;

    return (
      <Modal
        id={this.constructor.name}
        onHide={this.props.onCancel}
        show={show}
      >
        <Header>
          <Title>
            {i18n(`Admin.employees.modals.form.title.${employee.id ? 'edit' : 'add'}`)}
          </Title>
        </Header>
        <Body>
          <Row>
            <Col md={12}>
              <Input
                id="username"
                label={i18n('Admin.employees.modals.form.fields.username')}
                onChange={this.handleOnChange}
                value={employee.username}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Checkbox
                checked={employee.isAdmin}
                id="isAdmin"
                label={i18n('Admin.employees.modals.form.fields.isAdmin')}
                onChange={this.handleOnChange}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Checkbox
                checked={employee.isActive}
                id="isActive"
                label={i18n('Admin.employees.modals.form.fields.isActive')}
                onChange={this.handleOnChange}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Checkbox
                checked={setPassword}
                id="setPassword"
                label={i18n('Admin.employees.modals.form.fields.setPassword')}
                onChange={this.handleOnChange}
              />
            </Col>
          </Row>
          <FormGroup validationState={this.getPasswordValidation()}>
            <Row>
              <Col md={12}>
                <Input
                  id="password"
                  disabled={!setPassword}
                  label={i18n('Admin.employees.modals.form.fields.password')}
                  onChange={this.handleOnChange}
                  type={Input.TYPES.PASSWORD}
                  value={employee.password}
                />
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Input
                  id="confirmPassword"
                  disabled={!setPassword}
                  label={i18n('Admin.employees.modals.form.fields.confirmPassword')}
                  onChange={this.handleOnChange}
                  type={Input.TYPES.PASSWORD}
                  value={confirmPassword}
                />
              </Col>
            </Row>
          </FormGroup>
          <Row>
            <Col md={12}>
              <ButtonToolbar>
                <Button onClick={this.props.onCancel}>
                  {i18n('actions.cancel')}
                </Button>
                <Button
                  bsStyle="primary"
                  disabled={!this.getFormValidation()}
                  onClick={this.handleOnSave}
                >
                  {i18n('actions.save')}
                </Button>
              </ButtonToolbar>
            </Col>
          </Row>
        </Body>
      </Modal>
    );
  }
}
