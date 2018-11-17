import { connect } from 'react-redux';

import {
  remove,
  update,
} from '../actions/copyActions';
import AddedCopiesTable from '../components/copy/addCopies/AddedCopiesTable';

const mapStateToProps = ({ appStore, copyStore }) => ({
  api: appStore.apiClient,
  copies: copyStore.copies,
});

const mapDispatchToProps = dispatch => ({
  onRemove: (api, copy) => dispatch(remove(api, copy)),
  onUpdate: (api, copy) => dispatch(update(api, copy)),
});

const mergeProps = (stateProps, dispatchProps) => ({
  copies: stateProps.copies,
  onRemove: copy => dispatchProps.onRemove(stateProps.api, copy),
  onUpdate: copy => dispatchProps.onUpdate(stateProps.api, copy),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(AddedCopiesTable);
