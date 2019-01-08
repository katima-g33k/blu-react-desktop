import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button as BootstrapButton,
  Glyphicon,
} from 'react-bootstrap';

export default class Button extends Component {
  static defaultProps = {
    actionData: {},
    bsStyle: 'default',
    glyph: null,
    hint: null,
    label: '',
    style: {},
  };

  static propTypes = {
    actionData: PropTypes.shape(),
    bsStyle: PropTypes.string,
    glyph: PropTypes.string,
    hint: PropTypes.string,
    label: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    style: PropTypes.shape(),
  };

  onClick = () => this.props.onClick(this.props.actionData);

  render() {
    const { bsStyle, glyph, label } = this.props;

    return (
      <BootstrapButton
        bsStyle={bsStyle}
        onClick={this.onClick}
        title={this.props.hint}
        style={this.props.style}
      >
        {glyph && (<Glyphicon glyph={glyph} />)} {label}
      </BootstrapButton>
    );
  }
}
