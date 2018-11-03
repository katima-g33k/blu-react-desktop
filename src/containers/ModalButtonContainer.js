import { connect } from 'react-redux';

import { close } from '../actions/modalActions';
import ModalButton from '../components/general/modals/ModalButton';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(close()),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  closeModal: dispatchProps.closeModal,
  extraData: ownProps.extraData,
  label: ownProps.label,
  onClick: ownProps.onClick,
  style: ownProps.style,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ModalButton);
