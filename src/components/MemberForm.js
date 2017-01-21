import React, { Component } from 'react';
import { Col, Panel } from 'react-bootstrap';
import I18n from '../lib/i18n/i18n';
import HTTP from '../lib/HTTP';
import AutoForm from './AutoForm';
import settings from '../settings.json';

const schema = {
  titleClass: 'h3',
  options: {
    horizontal: true,
  },
  sections: [
    {
      fields: [
        {
          key: 'is_parent',
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
          key: 'city.name',
          type: 'text',
          label: 'Ville',
          placeholder: 'Ville',
          onChange(event, data) {
            const member = data;
            member.city.name = event.target.value;
            return member;
          },
        },
        {
          key: 'city.state.code',
          type: 'select',
          label: 'Province',
          default: 'QC',
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
  actions: [
    {
      label: 'Annuler',
      options: {
        bsStyle: 'danger',
      },
      onClick(event, data) {
        event.preventDefault();
        console.log(data);
      },
    },
    {
      label: 'Sauvegarder',
      options: {
        bsStyle: 'success',
      },
      onClick(event, data) {
        event.preventDefault();
        console.log(data);
      },
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
  }

  componentWillMount() {
    HTTP.post(`${settings.apiUrl}/state/select`, {}, (err, states) => {
      if (states) {
        this.setState({ states });
      }
    });

    if (this.props.params.no) {
      const no = this.props.params.no;
      HTTP.post(`${settings.apiUrl}/blu-api/member/select`, { no }, (err, member) => {
        if (member) {
          this.setState({ member });
        }
      });
    }
  }

  render() {
    schema.title = !this.props.params.no ? 'Ajouter un membre' : 'Modifier un membre';
    schema.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.key === 'city.state.code') {
          field.options = this.state.states.map((state) => ({ value: state, label: state }));
        }
      });
    });

    return (
      <Panel header={I18n.t('MemberForm.title')}>
        <Col md={8}>
          <AutoForm
            schema={schema}
            data={this.state.member}
          />
        </Col>
      </Panel>
    );
  }
}

MemberForm.propTypes = {
  params: React.PropTypes.shape(),
};
