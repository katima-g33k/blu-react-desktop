import React, { Component } from 'react';
import { Col, Panel } from 'react-bootstrap';

import I18n from '../lib/i18n/i18n';
import HTTP from '../lib/HTTP';
import AutoForm from './AutoForm';
import settings from '../settings.json';
import Member from '../lib/models/Member';

const schema = {
  titleClass: 'h3',
  options: {
    horizontal: true,
  },
  sections: [
    {
      fields: [
        {
          key: 'isParent',
          type: 'checkbox',
          label: 'Parent-Étudiant',
        },
        {
          key: 'firstName',
          type: 'text',
          label: 'Prénom',
          placeholder: 'Prénom',
        },
        {
          key: 'lastName',
          type: 'text',
          label: 'Nom',
          placeholder: 'Nom',
        },
        {
          inline: [
            {
              key: 'no',
              type: 'number',
              label: 'Numéro de membre',
              placeholder: '200000000',
            },
            {
              label: 'Pas de numéro',
              key: 'noNo',
              type: 'checkbox',
            },
          ],
        },
      ],
    },
    {
      title: 'Information de contact',
      titleClass: 'h4',
      fields: [
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
          key: 'city',
          type: 'text',
          label: 'Ville',
          placeholder: 'Ville',
          value(value) {
            return value ? value.name : '';
          },
          onChange(event, data) {
            const member = data;
            member.city.name = event.target.value;
            return member;
          },
        },
        {
          key: 'state',
          type: 'select',
          label: 'Province',
          default: 'QC',
          value(value, data = {}) {
            return data.city ? data.city.state.code : 'QC';
          },
          onChange(event, data) {
            const member = data;
            member.city.state.code = event.target.value;
          },
        },
        {
          key: 'email',
          type: 'email',
          label: 'Courriel',
          placeholder: 'courriel@exemple.com',
        },
        {
          inline: [
            {
              key: 'phone1',
              type: 'phone',
              label: 'Téléphone 1',
              placeholder: 'XXX-XXX-XXXX',
              value(value, member) {
                return member.phone ? member.phone[0].number : '';
              },
              onChange(event, data) {
                const member = data;
                member.phone[0].number = event.target.value;
                return member;
              },
            },
            {
              key: 'note1',
              type: 'text',
              label: 'Note',
              value(value, member) {
                return member.phone ? member.phone[0].note : '';
              },
              onChange(event, data) {
                const member = data;
                member.phone[0].note = event.target.value;
                return member;
              },
            },
          ],
        },
        {
          inline: [
            {
              key: 'phone2',
              type: 'phone',
              label: 'Téléphone 2',
              placeholder: 'XXX-XXX-XXXX',
              value(value, member) {
                return member.phone && member.phone[1] ? member.phone[1].number : '';
              },
              onChange(event, data) {
                const member = data;
                if (member.phone[1]) {
                  member.phone[1].number = event.target.value;
                } else {
                  member.phone.push({
                    number: event.target.value,
                    note: '',
                  });
                }
                return member;
              },
            },
            {
              key: 'note2',
              type: 'text',
              label: 'Note',
              value(value, member) {
                return member.phone && member.phone[1] ? member.phone[1].note : '';
              },
              onChange(event, data) {
                const member = data;
                if (member.phone[1]) {
                  member.phone[1].note = event.target.value;
                } else {
                  member.phone.push({
                    number: '',
                    note: event.target.value,
                  });
                }
                return member;
              },
            },
          ],
        },
      ],
    },
  ],
};

export default class MemberForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      states: [],
      member: {},
    };

    this.schema = schema;

    this.cancel = this.cancel.bind(this);
    this.save = this.save.bind(this);
  }

  componentWillMount() {
    HTTP.post(`${settings.apiUrl}/state/select`, {}, (err, states) => {
      if (states) {
        this.setState({ states });
      }
    });

    if (this.props.params.no) {
      const no = this.props.params.no;
      HTTP.post(`${settings.apiUrl}/member/select`, { no }, (err, res) => {
        if (res) {
          this.setState({ member: new Member(res) });
        }
      });
    }
  }

  cancel(event) {
    event.preventDefault();
    this.props.router.push(this.state.member.no ? `/member/${this.state.member.no}` : 'search');
  }

  save(event, member) {
    event.preventDefault();
    const data = {
      no: member.no,
      member,
    };

    HTTP.post(`${settings.apiUrl}/member/update`, data, (err) => {
      if (err) {
        // TODO: Display error message
        return;
      }

      this.props.router.push({
        pathname: `/member/${member.no}`,
      });
    });
  }

  render() {
    const member = this.state.member;
    delete member.account;

    schema.title = !this.props.params.no ? 'Ajouter un membre' : 'Modifier un membre';
    const stateSelect = schema.sections[1].fields.find(field => field.key === 'state');
    stateSelect.options = this.state.states.map(state => ({ value: state, label: state }));

    return (
      <Panel header={I18n.t('MemberForm.title')}>
        <Col md={8}>
          <AutoForm
            schema={schema}
            data={member}
            onCancel={this.cancel}
            onSave={this.save}
          />
        </Col>
      </Panel>
    );
  }
}

MemberForm.propTypes = {
  params: React.PropTypes.shape(),
  router: React.PropTypes.shape(),
};
