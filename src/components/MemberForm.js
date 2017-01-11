import React, { Component } from 'react';
import {
  Button,
  ButtonToolbar,
  Checkbox,
  Col,
  Form,
  FormControl,
  FormGroup,
  ControlLabel,
  Panel,
} from 'react-bootstrap';
import I18n from '../lib/i18n/i18n';
import HTTP from '../lib/HTTP';

const generalInputs = [
  {
    key: 'isParent',
    type: 'checkbox',
    label: 'Parent-Étudiant',
  },
  {
    key: 'first_name',
    type: 'text',
    label: 'Prénom',
    placeholder: 'Prénom',
  },
  {
    key: 'last_name',
    type: 'text',
    label: 'Nom',
    placeholder: 'Nom',
  },
  {
    key: 'no',
    type: 'text',
    label: 'Numéro de membre',
    placeholder: '200000000',
  },
];

const contactInputs = [
  {
    key: 'address',
    type: 'text',
    label: 'Adresse',
    placeholder: 'Adresse',
  },
  {
    key: 'zip',
    type: 'text',
    label: 'Code Postale',
    placeholder: 'A0A 0A0',
  },
  {
    key: 'city.name',
    type: 'text',
    label: 'Ville',
    placeholder: 'Ville',
  },
  {
    key: 'city.state.code',
    type: 'select',
    label: 'Province',
    options: [],
    default: 'QC',
  },
  {
    key: 'email',
    type: 'email',
    label: 'Courriel',
    placeholder: 'courriel@exemple.com',
  },
  {
    key: 'phone1',
    type: 'phone',
    label: 'Téléphone 1',
    placeholder: 'XXX-XXX-XXXX',
  },
  {
    key: 'note1',
    type: 'text',
    label: 'Note',
  },
  {
    key: 'phone2',
    type: 'phone',
    label: 'Téléphone 2',
    placeholder: 'XXX-XXX-XXXX',
  },
  {
    key: 'note2',
    type: 'text',
    label: 'Note',
  },
];

export default class MemberForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      states: [],
      member: {},
    };
    this.renderFormGroup = this.renderFormGroup.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    HTTP.post('http://localhost/blu-api/state/select', {}, (err, states) => {
      if (states) {
        this.setState({ states });
      }
    });

    if (this.props.params.no) {
      const no = this.props.params.no;
      HTTP.post('http://localhost/blu-api/member/select', { no }, (err, member) => {
        if (member) {
          this.setState({ member });
        }
      });
    }
  }

  onChange(event) {
    const member = this.state.member;
    member[event.target.id] = event.target.value;
    this.setState({ member });
  }

  renderOptions() {
    return this.state.states.map((option) => {
      return (
        <option key={option} value={option}>
          {option}
        </option>
      );
    });
  }

  renderFormGroup(inputs) {
    return inputs.map((input) => {
      const keys = input.key.split('.');
      let value = this.state.member;
      keys.forEach((key) => {
        value = value ? value[key] : value;
      });

      if (input.type === 'checkbox') {
        return (
          <FormGroup key={input.key} controlId={input.key}>
            <Col smOffset={2} mdOffset={3} sm={10} md={9}>
              {this.state.member[input.key] ? (
                <Checkbox checked onChange={this.onChange}>{input.label}</Checkbox>
              ) : (
                <Checkbox onChange={this.onChange}>{input.label}</Checkbox>
              )}
            </Col>
          </FormGroup>
        );
      }

      return (
        <FormGroup key={input.key} controlId={input.key}>
          <Col componentClass={ControlLabel} sm={2} md={3}>
            {input.label}
          </Col>
          <Col sm={10} md={9}>
            {input.type === 'select' ? (
              <FormControl
                componentClass={input.type}
                value={input.default}
                onChange={this.onChange}
              >
                {this.renderOptions()}
              </FormControl>
            ) : (
              <FormControl
                type={input.type}
                placeholder={input.placeholder || ''}
                onChange={this.onChange}
                value={value}
              />
            )}
          </Col>
        </FormGroup>
      );
    });
  }

  render() {
    return !this.props.params.no || this.state.member ? (
      <Panel header={I18n.t('MemberForm.title')}>
        <Col md={8}>
          <Form horizontal>
            <h3>Modifier un membre</h3>
            {this.renderFormGroup(generalInputs)}
            <h4>Adresse postale</h4>
            {this.renderFormGroup(contactInputs)}
            <FormGroup>
              <Col smOffset={2} mdOffset={3} sm={10} md={9}>
                <ButtonToolbar>
                  <Button bsStyle="danger">
                    Annuler
                  </Button>
                  <Button type="submit" bsStyle="success">
                    Enregistrer
                  </Button>
                </ButtonToolbar>
              </Col>
            </FormGroup>
          </Form>
        </Col>
      </Panel>
    ) : null;
  }
}

MemberForm.propTypes = {
  params: React.PropTypes.shape(),
};
