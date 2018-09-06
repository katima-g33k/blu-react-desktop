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
  fetch: (id, api) => dispatch(fetch(api, id)),
  onInsert: (api, item, callback) => dispatch(insert(api, item, callback)),
  onUpdate: (id, item, api) => dispatch(update(id, item, api)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ean13: ownProps.ean13, // || ownProps.params ? ownProps.params.ean13 : '',
  exists: async (ean13) => {
    const itemExists = await exists(ean13, stateProps.api);

    if (itemExists) {
      dispatchProps.onExists(ownProps.params.id, itemExists, stateProps.userIsAdmin, stateProps.api);
    }

    return itemExists;
  },
  item: stateProps.item,
  id: ownProps.params ? +ownProps.params.id : 0,
  onCancel: () => browserHistory.push(ownProps.params.id ? `/item/view/${ownProps.params.id}` : '/'),
  fetch: () => dispatchProps.fetch(ownProps.params.id, stateProps.api),
  onSave: (formData) => {
    const formattedData = formatItemFormData(formData);

    if (ownProps.params && ownProps.params.id) {
      dispatchProps.onUpdate(ownProps.params.id, formattedData, stateProps.api);
    } else {
      dispatchProps.onInsert(stateProps.api, formattedData, ownProps.onSaveCallback);
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ItemForm);
