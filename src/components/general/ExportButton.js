import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FileSaver from 'file-saver';

import Button from './Button';
import { createCSV } from '../../lib/csv';
import i18n from '../../lib/i18n';

export default class ExportButton extends Component {
  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    filename: PropTypes.string,
  };

  static defaultProps = {
    filename: `${i18n('table.defaultFileName')}}.csv`,
  };

  get filename() {
    if (/\.csv$/.test(this.props.filename)) {
      return this.props.filename;
    }

    return `${this.props.filename}.csv`;
  }

  saveFile = () => FileSaver.saveAs(createCSV(this.props.columns, this.props.data), this.filename);

  render() {
    return (
      <Button
        bsStyle="primary"
        glyph="new-window"
        label={i18n('table.export')}
        onClick={this.saveFile}
      />
    );
  }
}
