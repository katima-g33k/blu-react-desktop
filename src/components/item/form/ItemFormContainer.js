import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { browserHistory } from 'react-router';

import API from '../../../lib/API';
import Author from '../../../lib/models/Author';
import formatData from './formatData';
import { ConfirmModal, InformationModal } from '../../general/modals';
import Item from '../../../lib/models/Item';
import ItemForm from './ItemForm';
import Logger from '../../../lib/Logger';
import schema from './schema';

export default class ItemFormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      ean13: props.ean13 || props.location && props.location.query.ean13 || '',
      error: null,
      id: props.params && props.params.id,
      isAdmin: JSON.parse(sessionStorage.getItem('user')).isAdmin,
      item: new Item({ isBook: true, author: [new Author()] }),
      redirectTo: null,
      showModal: null,
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
    const { ean13, id } = this.state;

    API.category.select((error, categories) => {
      if (error) {
        this.setState({ error });
        return;
      }

      this.setState({ categories });
    });

    if (id) {
      API.item.select(id, {}, (error, item) => {
        if (error) {
          this.setState({ error });
          return;
        }

        this.setState({ item: new Item(item), ean13: item.ean13 });
      });
    } else if (ean13) {
      this.setState({ item: new Item({ ean13, isBook: true, author: [new Author()] }) });
    }
  }

  handleGoToItem = () => this.goToItem(this.state.redirectTo)

  goToItem = (id) => browserHistory.push(`/item/view/${id}`)

  exists = () => {
    const { ean13, item } = this.state;

    if (item.noEan13 || ean13 === item.ean13) {
      return false;
    }

    return new Promise((resolve, reject) => {
      API.item.exists(item.ean13, (error, res) => {
        if (error) {
          return reject(error);
        }

        return resolve(res.id);
      });
    });
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

  handleMerge = () => {
    const duplicate = this.state.id;
    const id = this.state.redirectTo;

    API.item.merge(id, duplicate, (error) => {
      if (error) {
        this.setState({ error });
        return;
      }

      this.setState({ showModal: 'merged' });
    });
  }

  insert = (item) => {
    this.logger.trace('insert()');
    API.item.insert(item, (error, { id }) => {
      if (error) {
        this.setState({ error });
        return;
      }

      if (this.props.onSave) {
        item.id = id;
        this.props.onSave(item);
      } else {
        this.goToItem(id);
      }
    });
  }

  onCancel = () => {
    this.logger.trace('onCancel()');
    const { id } = this.state;
    this.props.router.push(id ? `/item/view/${id}` : '/search');
  }

  onSave = async () => {
    this.logger.trace('onSave()');
    const { id } = this.state;
    const existingItem = await this.exists();

    if (existingItem) {
      return this.setState({ isUpdate: !!id, showModal: 'exists', redirectTo: existingItem });
    }

    const item = formatData(this.state.item);
    return id ? this.update(id, item) : this.insert(item);
  }

  update = async (id, item) => {
    this.logger.trace('update()');

    API.item.update(id, item, (error) => {
      if (error) {
        this.setState({ error });
        return;
      }

      if (this.props.onSave) {
        this.props.onSave(item);
      } else {
        this.goToItem(id);
      }
    });
  }

  closeModal = () => this.setState({ error: null, isUpdate: null, showModal: null })

  getModal = () => {
    this.logger.trace('getModal()');
    const { error, isAdmin, isUpdate, showModal } = this.state;

    if (error) {
      return (
        <InformationModal
          message={error.message}
          onClick={this.closeModal}
          title={`Erreur ${error.code}`}
        />
      );
    }

    switch (showModal) {
      case 'exists':
        if (!isUpdate) {
          return (
            <ConfirmModal
              message={'Un ouvrage avec les informations saisies existe déjà. Voulez-vous aller à sa fiche ?'}
              onCancel={this.closeModal}
              onConfirm={this.handleGoToItem}
              title={'Erreur - Ouvrage existant'}
            />
          );
        }

        if (isAdmin) {
          // eslint-disable-next-line max-len
          const message = 'Les informations que vous avez inscrites correspondent à un ouvrage déjà existant. Voulez-vous fusionner cette fiche avec la fiche correspondante ?';

          return (
            <ConfirmModal
              customActions={[
                {
                  label: 'Annuler',
                  onClick: this.closeModal,
                },
                {
                  bsStyle: 'danger',
                  label: 'Fusionner',
                  onClick: this.handleMerge,
                },
              ]}
              message={message}
              title={'Erreur - Ouvrage existant'}
            />
          );
        }

        return (
          <InformationModal
            message={'Les informations que vous avez inscrites correspondent à un ouvrage déjà existant.'}
            onClick={this.closeModal}
            title={'Ouvrage déjà existant'}
          />
        );
      case 'merged':
        return (
          <InformationModal
            message={'Les ouvrages ont été fusionnés, vous serez redirigé la fiche de l\'ouvrage.'}
            onClick={this.handleGoToItem}
            title={'Ouvrages fusionnés'}
          />
        );
      default:
        return null;
    }
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
