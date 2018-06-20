import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import ItemForm from '../components/item/form/ItemForm';

const mapStateToProps = ({ appStore, itemStore }) => ({
  api: appStore.apiClient,
  item: itemStore.item,
  userIsAdmin: JSON.parse(sessionStorage.getItem('user')).isAdmin,
});

const mapDispatchToProps = () => ({
  onExists: (id, isUpdate, userIsAdmin, api) => {
    // dispatch(openExistsModal(id, isUpdate, userIsAdmin, api))
  },
  onLoad: (id, api) => {
    // dispatch(fetch(api, id))
  },
  onInsert: (item, api) => {
    // dispatch(insert(item, api))
  },
  onUpdate: (id, item, api) => {
    // dispatch(update(id, item, api))
  },
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  exists: () => {},
  item: stateProps.item,
  id: +ownProps.params.id,
  onCancel: () => browserHistory.push(ownProps.params.id ? `/item/view/${ownProps.params.id}` : '/'),
  onLoad: () => dispatchProps.onLoad(ownProps.params.id, stateProps.api),
  onSave: (formData) => {
    console.log(formData);
  },
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ItemForm);
