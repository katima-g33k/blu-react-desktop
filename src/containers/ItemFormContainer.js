import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import ItemForm from '../components/item/form/ItemForm';
import {
  exists,
  fetch,
  insert,
  openExistsModal,
  update,
} from '../actions/itemActions';
import { formatItemFormData } from '../lib/itemHelper';

const mapStateToProps = ({ appStore, itemStore }) => ({
  api: appStore.apiClient,
  item: itemStore.item,
  userIsAdmin: JSON.parse(sessionStorage.getItem('user')).isAdmin,
});

const mapDispatchToProps = dispatch => ({
  onExists: (id, existingItemId, userIsAdmin, api) => {
    dispatch(openExistsModal(id, existingItemId, userIsAdmin, api))
  },
  fetch: (id, api) => dispatch(fetch(id, api)),
  onInsert: (item, api) => dispatch(insert(item, api)),
  onUpdate: (id, item, api) => dispatch(update(id, item, api)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  exists: async (ean13) => {
    const itemExists = await exists(ean13, stateProps.api);

    if (itemExists) {
      dispatchProps.onExists(ownProps.params.id, itemExists, stateProps.userIsAdmin, stateProps.api);
    }

    return itemExists;
  },
  item: stateProps.item,
  id: +ownProps.params.id,
  onCancel: () => browserHistory.push(ownProps.params.id ? `/item/view/${ownProps.params.id}` : '/'),
  fetch: () => dispatchProps.fetch(ownProps.params.id, stateProps.api),
  onSave: (formData) => {
    const formattedData = formatItemFormData(formData);

    if (ownProps.params.id) {
      console.log('update');
      dispatchProps.onUpdate(ownProps.params.id, formattedData, stateProps.api);
    } else {
      console.log('insert');
      dispatchProps.onInsert(formattedData, stateProps.api);
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ItemForm);
