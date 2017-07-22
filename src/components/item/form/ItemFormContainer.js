import React, { Component, PropTypes } from 'react';

import API from '../../../lib/API';
import Author from '../../../lib/models/Author';
import { InformationModal } from '../../general/modals';
import Item from '../../../lib/models/Item';
import ItemForm from './ItemForm';
import schema from './schema';

export default class ItemFormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      item: new Item({ isBook: true, author: [new Author()] }),
      categories: [],
    };

    this.getModal = this.getModal.bind(this);
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
    const { ean13, location, params } = this.props;

    API.category.select((error, res) => {
      if (error) {
        this.setState({ error });
        return;
      }

      this.setState({ categories: res });
    });

    if (params && params.id) {
      API.item.select(params.id, {}, (error, res) => {
        if (error) {
          this.setState({ error });
          return;
        }

        this.setState({ item: new Item(res) });
      });
    } else if (ean13 || (location && location.query.ean13)) {
      const code = ean13 || location.query.ean13;
      this.setState({ item: new Item({ ean13: code, isBook: true, author: [new Author()] }) });
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
      const ean13Checkbox = inlineEan13.inline.find(field => field.key === 'noEan13');

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
    API.item.insert(item, (error, { id }) => {
      if (error) {
        this.setState({ error });
        return;
      }

      if (this.props.onSave) {
        // TODO: update item with res
        item.id = id;
        this.props.onSave(item);
      } else {
        this.props.router.push(`/item/view/${id}`);
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

    if (item.noEan13) {
      delete item.ean13;
    }

    delete item.id;
    delete item.noEan13;
    return id ? this.update(item) : this.insert(item);
  }

  update(item) {
    const { id } = this.props.params;

    API.item.update(id, item, (error) => {
      if (error) {
        this.setState({ error });
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

  getModal() {
    const { error } = this.state;

    return error && (
      <InformationModal
        message={error.message}
        onClick={() => this.setState({ error: null })}
        title={`Erreur ${error.code}`}
      />
    );
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
        modal={this.getModal()}
        schema={this.schema[item.isBook ? 'book' : 'item']}
      />
    );
  }
}

ItemFormContainer.propTypes = {
  ean13: PropTypes.string,
  location: PropTypes.shape(),
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  params: PropTypes.shape(),
  router: PropTypes.shape(),
};
