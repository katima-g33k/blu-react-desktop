import { browserHistory } from 'react-router';
import { connect } from 'react-redux';

import Routes from '../routes/Routes';

const mapStateToProps = ({ appStore, historyStore }) => ({
  api: appStore.apiClient,
  currentPath: historyStore.currentPath,
});

const mapDispatchToProps = () => ({
  onRouteChange: path => browserHistory.push(path),
});

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
