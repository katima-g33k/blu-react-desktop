import { connect } from 'react-redux';

import { historyPush } from '../actions/routeActions';
import Header from '../components/general/Header';

const mapStateToProps = ({ userStore }) => ({
  isLoggedIn: !!userStore.user.id,
  isUserAdmin: userStore.user.isAdmin,
});

const mapDispatchToProps = dispatch => ({
  onShortcutClick: path => dispatch(historyPush(path)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
