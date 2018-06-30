import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import ItemForm from '../components/item/form/ItemForm';
import {
  exists,
  fetch,
  insert,
  update,
} from '../actions/itemActions';
import { formatItemFormData } from '../lib/itemHelper';

const mapStateToProps = ({ appStore, itemStore }) => ({
  api: appStore.apiClient,
  item: itemStore.item,
  userIsAdmin: JSON.parse(sessionStorage.getItem('user')).isAdmin,
});

const mapDispatchToProps = dispatch => ({
  onExists: (id, isUpdate, userIsAdmin, api) => {
    // dispatch(openExistsModal(id, isUpdate, userIsAdmin, api))
  },
  onLoad: (id, api) => dispatch(fetch(id, api)),
  onInsert: (item, api) => dispatch(insert(item, api)),
  onUpdate: (id, item, api) => dispatch(update(id, item, api)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  exists: async (ean13) => {
    const itemExists = await exists(ean13);

    if (itemExists) {
      dispatchProps.onExists();
    }

    return itemExists;
  },
  item: stateProps.item,
  id: +ownProps.params.id,
  onCancel: () => browserHistory.push(ownProps.params.id ? `/item/view/${ownProps.params.id}` : '/'),
  onLoad: () => dispatchProps.onLoad(ownProps.params.id, stateProps.api),
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
