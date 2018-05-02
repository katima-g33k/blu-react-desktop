import { connect } from 'react-redux';

import { closeModal, updateInputValue } from '../actions/modalActions';
import Modal from '../components/general/modals/Modal';

const mapStateToProps = ({ modalStore }) => ({
  ...modalStore,
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
  onInput: value => dispatch(updateInputValue(value)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onInput: (event) => {
    event.preventDefault();
    dispatchProps.onInput(event.target.value);
  },
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Modal);
