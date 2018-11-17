import { connect } from 'react-redux';

import AddCopies from '../components/copy/addCopies/AddCopies';
import { fetch as fetchItem } from '../actions/itemActions';
import { fetchName } from '../actions/memberActions';
import {
  openPriceModal,
  reset,
} from '../actions/copyActions';
import { resetLastItemScanned } from '../actions/appActions';

const mapStateToProps = stores => ({
  api: stores.appStore.apiClient,
  item: stores.itemStore.item,
  member: stores.memberStore.member,
  scannedItem: stores.appStore.lastItemScanned,
});

const mapDispatchToProps = dispatch => ({
  fetchItem: (api, id) => dispatch(fetchItem(api, id)),
  fetchName: (api, no) => dispatch(fetchName(api, no)),
  onAddCopy: (api, member, item) => dispatch(openPriceModal(api, member, item)),
  resetCopies: () => dispatch(reset()),
  resetLastItemScanned: () => dispatch(resetLastItemScanned()),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  fetchItem: id => dispatchProps.fetchItem(stateProps.api, id),
  handleOnAddCopy: item => dispatchProps.onAddCopy(stateProps.api, stateProps.member, item),
  item: stateProps.item,
  memberName: stateProps.member.name,
  onLoad: () => {
    dispatchProps.fetchName(stateProps.api, ownProps.params.no);
    dispatchProps.resetLastItemScanned();
    dispatchProps.resetCopies();
  },
  scannedItem: stateProps.scannedItem,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(AddCopies);
