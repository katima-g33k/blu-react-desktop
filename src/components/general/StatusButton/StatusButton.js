import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon } from 'react-bootstrap';

import './statusButton.css';
import I18n from '../../../lib/i18n';

const bsStyles = {
  OUTDATED: 'warning',
  REMOVED: 'danger',
  VALID: 'success',
};

export default class StatusButton extends Component {
  static propTypes = {
    disableLeft: PropTypes.bool,
    disableRight: PropTypes.bool,
    onClickLeft: PropTypes.func.isRequired,
    onClickRight: PropTypes.func.isRequired,
    status: PropTypes.string,
  }

  static defaultProps = {
    bsStyle: bsStyles.SUCCESS,
    disableLeft: false,
    disableRight: false,
    status: 'VALID',
  }

  render() {
    return (
      <div id={this.constructor.name}>
        <Button
          id="left"
          disabled={this.props.disableLeft}
          onClick={this.props.onClickLeft}
        >
          <Glyphicon glyph="minus" />
        </Button>
        <Button
          id="center"
          bsStyle={bsStyles[this.props.status]}
        >
          {I18n(`general.item.status.${this.props.status}`)}
        </Button>
        <Button
          id="right"
          disabled={this.props.disableRight}
          onClick={this.props.onClickRight}
        >
          <Glyphicon glyph="plus" />
        </Button>
      </div>
    );
  }
}
