import React, { Component } from 'react';
import HTTP from '../../../lib/HTTP';
import settings from '../../../settings.json';
import ItemForm from './ItemForm';
import schema from './schema';

export default class ItemFormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {},
      categories: [],
    };

    this.schema = schema;
  }

  componentWillMount() {
    HTTP.post(`${settings.apiUrl}/category/select`, {}, (err, res) => {
      if (err) {
        // TODO: display error
      }

      this.setState({ categories: res });
    });

    if (this.props.params.id) {
      const data = {
        id: this.props.params.id,
      };
      HTTP.post(`${settings.apiUrl}/item/select`, data, (err, res) => {
        if (err) {
          // TODO: display error
        }

        this.setState({ item: res });
      });
    }
  }

  render() {
    const subjectField = this.schema.sections[0].fields.find(field => field.key === 'subject');
    subjectField.optgroups = this.state.categories.map((category) => {
      return {
        label: category.name,
        options: category.subject.map(subject => ({
          value: subject.id,
          label: subject.name,
        })),
      };
    });

    return (
      <ItemForm
        data={this.state.item}
        schema={this.schema}
      />
    );
  }
}

ItemFormContainer.propTypes = {
  params: React.PropTypes.shape(),
};
