import React, { Component } from 'react';
import { Col, Panel } from 'react-bootstrap';
import I18n from '../lib/i18n/i18n';
import HTTP from '../lib/HTTP';
import AutoForm from './AutoForm';

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
      temp: contactInputs,
    };
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

  render() {
    const options = {
      horizontal: true,
    };
    return (
      <Panel header={I18n.t('MemberForm.title')}>
        <Col md={8}>
          <AutoForm
            schema={generalInputs}
            data={this.state.member}
            title={!this.props.params.no ? 'Ajouter un membre' : 'Modifier un membre'}
            options={options}
          />
        </Col>
      </Panel>
    );
  }
}

MemberForm.propTypes = {
  params: React.PropTypes.shape(),
};
