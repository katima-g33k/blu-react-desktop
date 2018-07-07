import { connect } from 'react-redux';

import { logout } from '../actions/userActions';
import LogoutButton from '../components/general/LogoutButton';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  onLogout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LogoutButton);
