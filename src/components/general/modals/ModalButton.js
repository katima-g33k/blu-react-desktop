import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

export default class ModalButton extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    extraData: PropTypes.shape(),
    id: PropTypes.string,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    style: PropTypes.string,
    type: PropTypes.string,
  };

  static defaultProps = {
    extraData: {},
    id: undefined,
    onClick() {},
    style: 'primary',
    type: 'button',
  };

  handleOnClick = (event) => {
    event.preventDefault();

    this.props.onClick(this.props.extraData);
    this.props.closeModal();
  };

  render() {
    return (
      <Button
        bsStyle={this.props.style}
        id={this.props.id}
        key={this.props.label}
        onClick={this.handleOnClick}
        type={this.props.type}
      >
        {this.props.label}
      </Button>
    );
  }
}
