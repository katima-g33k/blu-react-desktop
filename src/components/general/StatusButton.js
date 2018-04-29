import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon } from 'react-bootstrap';

import './statusButton.css';
import I18n from '../../lib/i18n';

const styles = {
  left: {
    borderRight: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    width: '20%',
  },
  center: {
    borderLeft: 0,
    borderRight: 0,
    cursor: 'default',
    borderRadius: 0,
    width: '60%',
  },
  right: {
    borderLeft: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    width: '20%',
  },
};

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
          // style={styles.left}
        >
          <Glyphicon glyph="minus" />
        </Button>
        <Button
          bsStyle={bsStyles[this.props.status]}
          id="center"
          // style={styles.center}
        >
          {I18n(`Item.status.${this.props.status}`)}
        </Button>
        <Button
          id="right"
          disabled={this.props.disableRight}
          onClick={this.props.onClickRight}
          // style={styles.right}
        >
          <Glyphicon glyph="plus" />
        </Button>
      </div>
    );
  }
}
