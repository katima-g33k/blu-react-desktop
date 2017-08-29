import React, { Component, PropTypes } from 'react';
import {
  Button as BootstrapButton,
  Glyphicon,
} from 'react-bootstrap';

export default class Button extends Component {
  static defaultProps = {
    actionData: {},
    onClick() {},
  }

  static propTypes = {
    actionData: PropTypes.shape().isRequired,
    bsStyle: PropTypes.string,
    glyph: PropTypes.string,
    label: PropTypes.string,
    onClick: PropTypes.func.isRequired,
  }

  onClick = () => {
    this.props.onClick(this.props.actionData);
  }

  render() {
    const { bsStyle, glyph, label } = this.props;

    return (
      <BootstrapButton
        bsStyle={bsStyle}
        onClick={this.onClick}
      >
        {glyph && (<Glyphicon glyph={glyph} />)}
        {label}
      </BootstrapButton>
    );
  }
}
