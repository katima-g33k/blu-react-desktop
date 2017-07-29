import React, { Component } from 'react';
import { Button, ButtonGroup, Col, Glyphicon, Label, Panel, Row } from 'react-bootstrap';

import API from '../../lib/API';
import { ConfirmModal, FormModal, InformationModal } from '../general/modals';
import Employee from '../../lib/models/Employee';
import I18n from '../../lib/i18n/i18n';
import TableLayout from '../general/TableLayout';

const columns = [
  {
    dataField: 'id',
    isKey: true,
    hidden: true,
  },
  {
    dataField: 'username',
    label: 'Nom d\'utilisateur',
  },
  {
    dataField: 'isAdmin',
    label: 'Permissions',
    dataFormat: isAdmin => (
      <Label bsStyle={isAdmin ? 'success' : 'primary'}>
        {isAdmin ? 'Administrateur' : 'Utilisateur'}
      </Label>
    ),
  },
  {
    dataField: 'isActive',
    label: 'Est activé',
    dataFormat: isActive => (
      <Label bsStyle={isActive ? 'success' : 'default'}>
        {isActive ? 'Actif' : 'Inactif'}
      </Label>
    ),
  },
];

const schema = {
  titleClass: 'h3',
  options: {
    horizontal: true,
  },
  sections: [
    {
      fields: [
        {
          key: 'username',
          type: 'texte',
          label: 'Pseudonym',
          required: true,
          inputWidth: {
            md: 8,
            sm: 10,
          },
        },
        {
          key: 'isAdmin',
          type: 'checkbox',
          label: 'Est administrateur',
        },
        {
          key: 'isActive',
          type: 'checkbox',
          label: 'Est activé',
        },
        {
          key: 'setPassword',
          type: 'checkbox',
          label: 'Changer le mot de passe',
        },
        {
          key: 'password',
          type: 'password',
          label: 'Mot de passe',
          required: true,
          inputWidth: {
            md: 8,
            sm: 10,
          },
          validationFn: ({ setPassword, password, confirmPassword }) => {
            return !setPassword || password === confirmPassword;
          },
        },
        {
          key: 'confirmPassword',
          type: 'password',
          label: 'Confirmer',
          required: true,
          inputWidth: {
            md: 8,
            sm: 10,
          },
          validationFn: ({ setPassword, password, confirmPassword }) => {
            return !setPassword || password === confirmPassword;
          },
        },
      ],
    },
  ],
};

export default class EmployeesTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentEmployee: null,
      employees: [],
      showModal: null,
    };

    this.delete = this.delete.bind(this);
    this.insert = this.insert.bind(this);
    this.update = this.update.bind(this);
    this.save = this.save.bind(this);
    this.getRowActions = this.getRowActions.bind(this);
    this.getTableActions = this.getTableActions.bind(this);
    this.renderModal = this.renderModal.bind(this);

    this.columns = columns;
    this.columns.push(this.getRowActions());

    this.schema = schema;
    const setPassword = this.schema.sections[0].fields.find(field => field.key === 'setPassword');
    const password = this.schema.sections[0].fields.find(field => field.key === 'password');
    const confirmPassword = this.schema.sections[0].fields.find(field => field.key === 'confirmPassword');

    setPassword.onChange = (event) => {
      password.disabled = !event.target.checked;
      confirmPassword.disabled = !event.target.checked;
    };
  }

  componentWillMount() {
    API.employee.list((error, res) => {
      if (error) {
        this.setState({ error });
        return;
      }

      this.setState({ employees: res.map(employee => new Employee(employee)) });
    });
  }

  delete() {
    const { id } = this.state.currentEmployee;

    API.employee.delete(id, (error) => {
      if (error) {
        this.setState({ error, showModal: null, currentEmployee: null });
        return;
      }

      const employees = this.state.employees.filter(employee => employee.id !== id);
      this.setState({ employees, showModal: null, currentEmployee: null });
    });
  }

  insert(employee) {
    API.employee.insert(employee, (error, res) => {
      if (error) {
        this.setState({ error, currentEmployee: null, showModal: null });
        return;
      }

      const { employees } = this.state;

      employee.id = res;
      employees.push(employee);

      this.setState({ employees, currentEmployee: null, showModal: null });
    });
  }

  save(employee) {
    return employee.id ? this.update(employee) : this.insert(employee);
  }

  update(currentEmployee) {
    API.employee.update(currentEmployee.id, currentEmployee, (error) => {
      if (error) {
        this.setState({ error, currentEmployee: null, showModal: null });
        return;
      }

      const { employees } = this.state;
      const index = employees.findIndex(employee => employee.id === currentEmployee.id);

      employees[index] = currentEmployee;
      this.setState({ employees, currentEmployee: null, showModal: null });
    });
  }

  getRowActions() {
    return {
      dataField: 'actions',
      label: 'Actions',
      dataFormat: (field, employee) => {
        return (
          <ButtonGroup>
            <Button
              bsStyle='primary'
              onClick={() => this.setState({
                currentEmployee: { ...employee },
                showModal: 'update',
              })}
            >
              <Glyphicon glyph="pencil" />
            </Button>
            <Button
              bsStyle='danger'
              onClick={() => this.setState({ currentEmployee: employee, showModal: 'delete' })}
            >
              <Glyphicon glyph="trash" />
            </Button>
          </ButtonGroup>
        );
      },
    };
  }

  getTableActions() {
    return [
      {
        bsStyle: 'success',
        icon: 'plus',
        label: 'Nouveau',
        name: 'insert-employee',
        onClick: () => this.setState({
          currentEmployee: new Employee({ isActive: true }),
          showModal: 'update',
        }),
      },
    ];
  }

  renderModal() {
    const { error, showModal, currentEmployee } = this.state;

    if (error) {
      return (
        <InformationModal
          message={error.message}
          onClick={() => this.setState({ error: null })}
          title={`Erreur ${error.code}`}
        />
      );
    }

    switch (showModal) {
      case 'delete':
        return (
          <ConfirmModal
            message={`Êtes-vous certains de vouloir supprimer ${currentEmployee.username} ?`}
            onCancel={() => this.setState({ currentEmployee: null, showModal: null })}
            onConfirm={this.delete}
            title={'Suppression d\'un.e employé.e'}
          />
        );
      case 'update':
        return (
          <FormModal
            data={currentEmployee}
            onCancel={() => this.setState({ currentEmployee: null, showModal: null })}
            onSave={this.save}
            schema={schema}
            title={`${currentEmployee.id ? 'Modifier' : 'Ajouter'} un.e employé.e` }
          />
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <Panel header={I18n.t('Admin.employees.title')}>
        <Row>
          <Col sm={12} md={6}>
            <TableLayout
              actions={this.getTableActions()}
              columns={this.columns}
              data={this.state.employees}
              placeholder={'Aucun employé dans le système'}
              title={'Liste des employé.e.s'}
            />
          </Col>
        </Row>
        {this.renderModal()}
      </Panel>
    );
  }
}
