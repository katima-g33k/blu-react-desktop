import { connect } from 'react-redux';

import { updateInputValue } from '../actions/modalActions';
import Modal from '../components/general/modals/Modal';

const mapStateToProps = ({ modalStore }) => ({
  actions: modalStore.actions,
  cancelable: modalStore.cancelable,
  display: modalStore.display,
  inputType: modalStore.inputType,
  inputValue: modalStore.inputValue,
  message: modalStore.message,
  title: modalStore.title,
  type: modalStore.type,
});

const mapDispatchToProps = dispatch => ({
  onInput: value => dispatch(updateInputValue(value)),
});

const mergeProps = (stateProps, dispatchProps) => ({
  actions: stateProps.actions,
  cancelable: stateProps.cancelable,
  display: stateProps.display,
  inputType: stateProps.inputType,
  inputValue: stateProps.inputValue,
  message: stateProps.message,
  onInput: (event) => {
    event.preventDefault();
    dispatchProps.onInput(event.target.value);
  },
  title: stateProps.title,
  type: stateProps.type,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Modal);
