import { connect } from 'react-redux';

import ScannerCalibrator from '../components/general/modals/ScannerCalibrator';
import { update } from '../actions/settingsActions';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  onSave: settings => dispatch(update(settings)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScannerCalibrator);
