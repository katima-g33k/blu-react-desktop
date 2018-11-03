import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

export default class ModalButton extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    extraData: PropTypes.shape(),
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    style: PropTypes.string,
  };

  static defaultProps = {
    extraData: {},
    onClick() {},
    style: 'primary',
  };

  handleOnClick = () => {
    this.props.onClick(this.props.extraData);
    this.props.closeModal();
  };

  render() {
    return (
      <Button
        bsStyle={this.props.style}
        key={this.props.label}
        onClick={this.handleOnClick}
      >
        {this.props.label}
      </Button>
    );
  }
}
