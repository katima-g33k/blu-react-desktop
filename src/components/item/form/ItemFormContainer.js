import React, { Component } from 'react';

import Author from '../../../lib/models/Author';
import HTTP from '../../../lib/HTTP';
import Item from '../../../lib/models/Item';
import ItemForm from './ItemForm';
import settings from '../../../settings.json';
import schema from './schema';

export default class ItemFormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: new Item({ isBook: true, author: [new Author()] }),
      categories: [],
    };

    this.handleAuthors = this.handleAuthors.bind(this);
    this.handleEan13 = this.handleEan13.bind(this);
    this.handleIsBook = this.handleIsBook.bind(this);
    this.handleSubject = this.handleSubject.bind(this);
    this.insert = this.insert.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSave = this.onSave.bind(this);
    this.update = this.update.bind(this);
    this.schema = schema;

    this.handleAuthors();
    this.handleEan13();
    this.handleIsBook();
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

  handleAuthors() {
    const authorField = this.schema.book.sections[0].fields.find(field => field.key === 'author');
    authorField.onChange = (event, author) => {
      const { item } = this.state;
      const input = event.target;

      item.author.find(a => a === author)[input.getAttribute('data-field')] = input.value;

      this.setState({ item });
    };

    authorField.onAddButton = () => {
      const { item } = this.state;
      item.author.push(new Author());
      this.setState({ item });
    };

    authorField.onRemoveButton = (event, author) => {
      const { item } = this.state;

      if (item.author.length > 1) {
        item.author = item.author.filter(a => a !== author);
      } else {
        item.author = [new Author()];
      }

      this.setState({ item });
    };
  }

  handleEan13() {
    Object.keys(this.schema).forEach((key) => {
      const inlineEan13 = this.schema[key].sections[0].fields.find(field => field.key === 'ean13');
      const ean13TextField = inlineEan13.inline.find(field => field.key === 'ean13');
      const ean13Checkbox = inlineEan13.inline.find(field => field.key === 'no-ean13');

      ean13Checkbox.onChange = (event) => {
        const item = this.state.item;
        item.ean13 = null;
        ean13TextField.disabled = event.target.checked;

        this.setState({ item });
      };
    });
  }

  handleIsBook() {
    const { item } = this.state;

    Object.keys(this.schema).forEach((key) => {
      const checkbox = this.schema[key].sections[0].fields.find(field => field.key === 'isBook');
      checkbox.onChange = (event) => {
        item.isBook = event.target.checked;
        this.setState({ item });
      };
    });
  }

  handleSubject() {
    Object.keys(this.schema).forEach((key) => {
      const subjectField = this.schema[key].sections[0].fields.find(field => field.key === 'subject');
      subjectField.optgroups = this.state.categories.map(category => ({
        label: category.name,
        options: category.subject.map(subject => ({
          value: subject.id,
          label: subject.name,
        })),
      }));
    });
  }

  insert(item) {
    HTTP.post(`${settings.apiUrl}/item/insert`, { item }, (err, res) => {
      if (err) {
        console.log(err);
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
    const { id } = this.props.params;
    const { item } = this.state;

    if (typeof item.subject === 'object') {
      if (data.subject.id) {
        item.subject = item.subject.id;
      } else {
        item.subject = document.getElementById('subject').value;
      }
    }

    if (!item.isBook) {
      delete item.author;
      delete item.edition;
      delete item.editor;
      delete item.publication;
    }

    if (item['no-ean13']) {
      delete item.ean13;
    }

    delete item.id;
    delete item['no-ean13'];
    return id ? this.update(item) : this.insert(item);
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
    const { item } = this.state;
    delete item.copies;
    delete item.reservation;
    delete item.status;
    delete item.storage;

    this.handleSubject();

    return (
      <ItemForm
        data={item}
        onCancel={this.props.onCancel || this.onCancel}
        onSave={this.onSave}
        schema={this.schema[item.isBook ? 'book' : 'item']}
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
