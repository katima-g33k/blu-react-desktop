import { connect } from 'react-redux';

import { closeModal } from '../actions/modalActions';
import Modal from '../components/general/modals/Modal';

const mapStateToProps = ({ modalStore }) => ({
  ...modalStore,
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
  onClick: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
