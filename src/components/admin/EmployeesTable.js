import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonGroup,
  Col,
  Glyphicon,
  Label,
  Panel,
  Row,
} from 'react-bootstrap';

import Employee from '../../lib/models/Employee';
import EmployeeFormModal from '../../containers/EmployeeFormModalContainer';
import i18n from '../../lib/i18n';
import TableLayout from '../general/TableLayout';

export default class EmployeesTable extends Component {
  static propTypes = {
    employees: PropTypes.arrayOf(PropTypes.instanceOf(Employee)),
    fetch: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    setCurrent: PropTypes.func.isRequired,
  }

  static defaultProps = {
    employees: [],
  }

  state = {
    currentEmployee: null,
    showModal: null,
  }

  componentDidMount() {
    this.props.fetch();
  }

  getTableActions = () => [
    {
      bsStyle: 'success',
      icon: 'plus',
      label: 'Nouveau',
      name: 'insert-employee',
      onClick: () => this.props.setCurrent(new Employee()),
    },
  ];

  columns = [
    {
      dataField: 'id',
      isKey: true,
      hidden: true,
    },
    {
      dataField: 'username',
      label: i18n('Admin.employees.table.columns.username'),
    },
    {
      dataField: 'isAdmin',
      label: i18n('Admin.employees.table.columns.isAdmin.title'),
      dataFormat: isAdmin => (
        <Label bsStyle={isAdmin ? 'success' : 'primary'}>
          {i18n(`Admin.employees.table.columns.isActive.${isAdmin ? 'admin' : 'user'}`)}
        </Label>
      ),
    },
    {
      dataField: 'isActive',
      label: i18n('Admin.employees.table.columns.isActive.title'),
      dataFormat: isActive => (
        <Label bsStyle={isActive ? 'success' : 'default'}>
          {i18n(`Admin.employees.table.columns.isActive.${isActive ? 'active' : 'inactive'}`)}
        </Label>
      ),
    },
    {
      dataField: 'actions',
      width: '95px',
      dataFormat: (field, employee) => (
        <ButtonGroup>
          <Button
            bsStyle="primary"
            onClick={() => this.props.setCurrent(employee)}
          >
            <Glyphicon glyph="pencil" />
          </Button>
          <Button
            bsStyle="danger"
            onClick={() => this.props.onRemove(employee)}
          >
            <Glyphicon glyph="trash" />
          </Button>
        </ButtonGroup>
      ),
    },
  ];

  render() {
    return (
      <Panel header={i18n('Admin.employees.title')}>
        <Row>
          <Col sm={12} md={6}>
            <TableLayout
              actions={this.getTableActions()}
              columns={this.columns}
              data={this.props.employees}
              placeholder={i18n('Admin.employees.table.placeholder')}
              title={i18n('Admin.employees.table.title')}
            />
          </Col>
        </Row>
        <EmployeeFormModal />
      </Panel>
    );
  }
}
