import React, { Component } from 'react';

import HTTP from '../../../lib/HTTP';
import Item from '../../../lib/models/Item';
import ItemForm from './ItemForm';
import settings from '../../../settings.json';
import schema from './schema';

export default class ItemFormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: new Item(),
      categories: [],
    };

    this.insert = this.insert.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSave = this.onSave.bind(this);
    this.update = this.update.bind(this);
    this.schema = schema;
  }

  componentWillMount() {
    HTTP.post(`${settings.apiUrl}/category/select`, {}, (err, res) => {
      if (err) {
        // TODO: display error
      }

      this.setState({ categories: res });
    });

    if (this.props.params && this.props.params.id) {
      const data = {
        id: this.props.params.id,
      };
      HTTP.post(`${settings.apiUrl}/item/select`, data, (err, res) => {
        if (err) {
          // TODO: display error
        }

        this.setState({ item: new Item(res) });
      });
    }
  }

  insert(item) {
    HTTP.post(`${settings.apiUrl}/item/insert`, { item }, (err, res) => {
      if (err) {
        // TODO: Display message
        return;
      }

      if (this.props.onSave) {
        // TODO: update item with res
        item.id = res.id;
        this.props.onSave(item);
      } else {
        this.props.router.push(`/item/view/${res.id}`);
      }
    });
  }

  onCancel() {
    const id = this.props.params ? this.props.params.id : null;
    this.props.router.push(id ? `/item/view/${id}` : '/search');
  }

  onSave(event, data) {
    const item = data;

    if (typeof data.subject === 'object') {
      if (data.subject.id) {
        item.subject = data.subject.id;
      } else {
        item.subject = document.getElementById('subject').value;
      }
    }

    return this.props.params.id ? this.update(item) : this.insert(item);
  }

  update(item) {
    const id = this.props.params.id;
    const data = {
      id,
      item,
    };

    HTTP.post(`${settings.apiUrl}/item/update`, data, (err) => {
      if (err) {
        // TODO: Display message
        return;
      }

      if (this.props.onSave) {
        // TODO: update item with res
        this.props.onSave(item);
      } else {
        this.props.router.push(`/item/view/${id}`);
      }
    });
  }

  render() {
    const item = this.state.item;
    delete item.copies;
    delete item.reservation;
    delete item.status;
    delete item.storage;

    const subjectField = this.schema.sections[0].fields.find(field => field.key === 'subject');
    subjectField.optgroups = this.state.categories.map(category => ({
      label: category.name,
      options: category.subject.map(subject => ({
        value: subject.id,
        label: subject.name,
      })),
    }));

    return (
      <ItemForm
        data={item}
        onCancel={this.props.onCancel || this.onCancel}
        onSave={this.onSave}
        schema={this.schema}
      />
    );
  }
}

ItemFormContainer.propTypes = {
  onCancel: React.PropTypes.func,
  onSave: React.PropTypes.func,
  params: React.PropTypes.shape(),
  router: React.PropTypes.shape(),
};
