import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import API from '../../../lib/API';
import Author from '../../../lib/models/Author';
import formatData from './formatData';
import { InformationModal } from '../../general/modals';
import Item from '../../../lib/models/Item';
import ItemForm from './ItemForm';
import Logger from '../../../lib/Logger';
import schema from './schema';

export default class ItemFormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      item: new Item({ isBook: true, author: [new Author()] }),
      categories: [],
    };

    this.logger = new Logger(this.constructor.name);
    this.logger.trace('constructor()');

    this.schema = _.cloneDeep(schema);

    this.handleAuthors();
    this.handleEan13();
    this.handleIsBook();
  }

  static propTypes = {
    ean13: PropTypes.string,
    location: PropTypes.shape(),
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    params: PropTypes.shape(),
    router: PropTypes.shape(),
  };

  componentWillMount = () => {
    this.logger.trace('componentWillMount()');
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

  handleAuthors = () => {
    this.logger.trace('handleAuthors()');
    const authorField = this.schema.book.sections[0].fields.find(field => field.key === 'author');
    authorField.onChange = (event, author) => {
      this.logger.trace('author - onChange()');
      const { item } = this.state;
      const input = event.target;

      item.author.find(a => a === author)[input.getAttribute('data-field')] = input.value;

      this.setState({ item });
    };

    authorField.onAddButton = () => {
      this.logger.trace('author - onAdd()');
      const { item } = this.state;
      item.author.push(new Author());
      this.setState({ item });
    };

    authorField.onRemoveButton = (event, author) => {
      this.logger.trace('author - onRemove()');
      const { item } = this.state;

      if (item.author.length > 1) {
        item.author = item.author.filter(a => a !== author);
      } else {
        item.author = [new Author()];
      }

      this.setState({ item });
    };
  }

  handleEan13 = () => {
    this.logger.trace('handleEan13()');
    Object.keys(this.schema).forEach((key) => {
      const inlineEan13 = this.schema[key].sections[0].fields.find(field => field.key === 'ean13');
      const ean13TextField = inlineEan13.inline.find(field => field.key === 'ean13');
      const ean13Checkbox = inlineEan13.inline.find(field => field.key === 'noEan13');

      if (!this.state.item.id && !this.state.item.ean13) {
        ean13TextField.disabled = true;
        ean13Checkbox.checked = true;
      }

      ean13Checkbox.onChange = (event) => {
        this.logger.trace('noEan13 - onChange()');

        const { item } = this.state;
        item.ean13 = null;
        ean13TextField.disabled = event.target.checked;

        this.setState({ item });
      };
    });
  }

  handleIsBook = () => {
    this.logger.trace('handleIsBook()');
    const { item } = this.state;

    Object.keys(this.schema).forEach((key) => {
      const checkbox = this.schema[key].sections[0].fields.find(field => field.key === 'isBook');
      checkbox.onChange = (event) => {
        this.logger.trace('isBook - onChange()');
        item.isBook = event.target.checked;
        this.setState({ item });
      };
    });
  }

  handleSubject = () => {
    this.logger.trace('handleSubject()');
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

  insert = (item) => {
    this.logger.trace('insert()');
    API.item.insert(item, (error, res) => {
      if (error) {
        this.setState({ error });
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

  onCancel = () => {
    this.logger.trace('onCancel()');
    const id = this.props.params ? this.props.params.id : null;
    this.props.router.push(id ? `/item/view/${id}` : '/search');
  }

  onSave = () => {
    this.logger.trace('onSave()');
    const id = this.props.params ? this.props.params.id : null;
    const item = formatData(this.state.item);

    return id ? this.update(item) : this.insert(item);
  }

  update = (item) => {
    this.logger.trace('update()');
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

  getModal = () => {
    this.logger.trace('getModal()');
    const { error } = this.state;

    return error && (
      <InformationModal
        message={error.message}
        onClick={() => this.setState({ error: null })}
        title={`Erreur ${error.code}`}
      />
    );
  }

  render = () => {
    this.logger.trace('render()');
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
