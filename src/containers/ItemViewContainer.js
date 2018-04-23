import { connect } from 'react-redux';

import { fetch } from '../actions/itemActions';
import ItemView from '../components/item/view/ItemView';

const mapStateToProps = ({ itemStore }) => ({ ...itemStore });

const mapDispatchToProps = dispatch => ({
  fetch: id => dispatch(fetch(id)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  fetch: () => dispatchProps.fetch(stateProps.id || ownProps.params.id),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ItemView);
