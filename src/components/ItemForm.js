import React, { Component } from 'react';
import { Col, Panel } from 'react-bootstrap';
import I18n from '../lib/i18n/i18n';
import AutoForm from '../components/AutoForm';
import HTTP from '../lib/HTTP';
import settings from '../settings.json';

const schema = {
  title: 'Modifier un ouvrage',
  titleClass: 'h3',
  options: {
    horizontal: true,
  },
  sections: [
    {
      fields: [
        {
          label: 'Titre',
          key: 'name',
          type: 'text',
        },
        {
          label: 'Éditeur',
          key: 'editeur',
          type: 'text',
        },
        {
          label: 'Édition',
          key: 'edition',
          type: 'text',
        },
        {
          label: 'Année',
          key: 'publication',
          type: 'text',
        },
        {
          label: 'Sujet',
          key: 'subject',
          type: 'select',
        },
        {
          inline: [
            {
              label: 'EAN13',
              key: 'ean13',
              type: 'text',
            },
            {
              label: 'Pas de numéro',
              key: 'no-ean13',
              type: 'checkbox',
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
        return data;
      },
    },
    {
      label: 'Sauvegarder',
      options: {
        bsStyle: 'success',
      },
      onClick(event, data) {
        event.preventDefault();
        return data;
      },
    },
  ],
};

export default class ItemForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {},
      categories: [],
    };
  }

  componentWillMount() {
    HTTP.post(`${settings.apiURL}/category/select`, {}, (err, categories) => {
      if (categories) {
        this.setState({ categories });
      }
    });
  }

  render() {
    schema.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.key === 'subject') {
          field.optgroups = this.state.categories.map((category) => {
            const options = category.subject.map(subject => ({
              value: subject.id,
              label: subject.name,
            }));

            return {
              label: category.name,
              options,
            };
          });
        }
      });
    });

    return (
      <Panel header={I18n.t('ItemForm.title')}>
        <Col md={8}>
          <AutoForm
            schema={schema}
            data={this.state.item}
          />
        </Col>
      </Panel>);
  }
}
