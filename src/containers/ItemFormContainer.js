import { connect } from 'react-redux';

import ItemForm from '../components/item/form/ItemForm';
import {
  exists,
  fetch,
  insert,
  openExistsModal,
  update,
} from '../actions/itemActions';
import { formatItemFormData } from '../lib/itemHelper';
import historyPush from '../actions/routeActions/historyPush';

const mapStateToProps = ({ appStore, itemStore, userStore }) => ({
  api: appStore.apiClient,
  item: itemStore.item,
  userIsAdmin: userStore.user.isAdmin,
});

const mapDispatchToProps = dispatch => ({
  onCancel: id => dispatch(historyPush(id ? `/item/view/${id}` : '/')),
  onExists: (api, id, existingItemId, userIsAdmin) => dispatch(openExistsModal(id, existingItemId, userIsAdmin, api)),
  fetch: (api, id) => dispatch(fetch(api, id)),
  onInsert: (api, item, callback) => dispatch(insert(api, item, callback)),
  onUpdate: (api, id, item) => dispatch(update(id, item, api)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const params = ownProps.params || {};
  const id = +(params.id || 0);

  return {
    ean13: ownProps.ean13 || ownProps.location.query.ean13 || '',
    exists: async (ean13) => {
      const itemExists = await exists(ean13, stateProps.api);

      if (itemExists) {
        dispatchProps.onExists(stateProps.api, id, itemExists, stateProps.userIsAdmin);
      }

      return itemExists;
    },
    fetch: () => dispatchProps.fetch(stateProps.api, id),
    id,
    item: stateProps.item,
    onCancel: () => (ownProps.onCancel ? ownProps.onCancel() : dispatchProps.onCancel(id)),
    onSave: (formData) => {
      const formattedData = formatItemFormData(formData);

      if (id) {
        dispatchProps.onUpdate(stateProps.api, id, formattedData);
      } else {
        dispatchProps.onInsert(stateProps.api, formattedData, ownProps.onSaveCallback);
      }
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ItemForm);
