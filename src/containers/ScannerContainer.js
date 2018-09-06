import { connect } from 'react-redux';

import {
  onInvalidScan,
  onItemScan,
  onMemberScan,
} from '../actions/scanActions';
import Scanner from '../components/general/Scanner';

const mapStateToProps = ({ appStore, settingsStore }) => ({
  api: appStore.apiClient,
  barcodeFirstChar: settingsStore.barcodeFirstChar,
  barcodeLastChar: settingsStore.barcodeLastChar,
});

const mapDispatchToProps = dispatch => ({
  onInvalidScan: () => dispatch(onInvalidScan()),
  onItemScan: (ean13, api) => dispatch(onItemScan(ean13, api)),
  onMemberScan: (no, api) => dispatch(onMemberScan(no, api)),
});

const mergeProps = (stateProps, dispatchProps) => ({
  barcodeFirstChar: stateProps.barcodeFirstChar,
  barcodeLastChar: stateProps.barcodeLastChar,
  onInvalidScan: dispatchProps.onInvalidScan,
  onItemScan: ean13 => dispatchProps.onItemScan(ean13, stateProps.api),
  onMemberScan: no => dispatchProps.onMemberScan(no, stateProps.api),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Scanner);
