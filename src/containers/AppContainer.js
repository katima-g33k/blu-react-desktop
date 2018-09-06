import { connect } from 'react-redux';

import App from '../App';

const mapStateToProps = ({ userStore, settingsStore }) => ({
  isConnected: !!userStore.user.id,
  isInitialSetup: !(settingsStore.apiKey && settingsStore.apiUrl && settingsStore.secretKey),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(App);
