import { Component } from 'react';
import PropTypes from 'prop-types';

import Scanner from '../../lib/Scanner';

export default class ScannerComponent extends Component {
  static propTypes = {
    barcodeFirstChar: PropTypes.string,
    barcodeLastChar: PropTypes.string,
    onInvalidScan: PropTypes.func.isRequired,
    onItemScan: PropTypes.func.isRequired,
    onMemberScan: PropTypes.func.isRequired,
  }

  static defaultProps = {
    barcodeFirstChar: '',
    barcodeLastChar: '',
  }

  constructor(props) {
    super(props);
    this.scanner = new Scanner(props.barcodeFirstChar, props.barcodeLastChar);
  }

  componentWillMount() {
    this.scanner.addListener('onInvalidScan', this.props.onInvalidScan);
    this.scanner.addListener('onItemScan', this.props.onItemScan);
    this.scanner.addListener('onMemberScan', this.props.onMemberScan);
  }

  componentWillReceiveProps(nextProps) {
    this.scanner.updateScanChars(nextProps.barcodeFirstChar, nextProps.barcodeLastChar);
  }

  componentWillUnmount() {
    this.scanner.removeListener('onInvalidScan', this.props.onInvalidScan);
    this.scanner.removeListener('onItemScan', this.props.onItemScan);
    this.scanner.removeListener('onMemberScan', this.props.onMemberScan);
  }

  render() {
    return null;
  }
}
