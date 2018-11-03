import { connect } from 'react-redux';

import AddCopies from '../components/copy/addCopies/AddCopies';
import { fetch as fetchItem } from '../actions/itemActions';
import { fetchName } from '../actions/memberActions';
import {
  openPriceModal,
  remove,
  reset,
  update,
} from '../actions/copyActions';
import { resetLastItemScanned } from '../actions/appActions';

const mapStateToProps = stores => ({
  api: stores.appStore.apiClient,
  copies: stores.copyStore.copies,
  item: stores.itemStore.item,
  member: stores.memberStore.member,
  scannedItem: stores.appStore.lastItemScanned,
});

const mapDispatchToProps = dispatch => ({
  fetchItem: (api, id) => dispatch(fetchItem(api, id)),
  fetchName: (api, no) => dispatch(fetchName(api, no)),
  onAddCopy: (api, member, item) => dispatch(openPriceModal(api, member, item)),
  onRemove: (api, copy) => dispatch(remove(api, copy)),
  onUpdate: (api, copy) => dispatch(update(api, copy)),
  resetCopies: () => dispatch(reset()),
  resetLastItemScanned: () => dispatch(resetLastItemScanned()),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  copies: stateProps.copies,
  fetchItem: id => dispatchProps.fetchItem(stateProps.api, id),
  handleOnAddCopy: item => dispatchProps.onAddCopy(stateProps.api, stateProps.member, item),
  item: stateProps.item,
  member: stateProps.member,
  onLoad: () => {
    dispatchProps.fetchName(stateProps.api, ownProps.params.no);
    dispatchProps.resetLastItemScanned();
    dispatchProps.resetCopies();
  },
  onRemove: copy => dispatchProps.onRemove(stateProps.api, copy),
  onUpdate: copy => dispatchProps.onUpdate(stateProps.api, copy),
  scannedItem: stateProps.scannedItem,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(AddCopies);
