import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, FormControl, Modal as RBModal } from 'react-bootstrap';

import I18n from '../../../lib/i18n';

export default class Modal extends Component {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
      style: PropTypes.string,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })),
    cancelable: PropTypes.bool,
    closeModal: PropTypes.func.isRequired,
    display: PropTypes.bool.isRequired,
    inputValue: PropTypes.string,
    onInput: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string,
  }

  static defaultProps = {
    actions: [],
    cancelable: false,
    inputValue: '',
    type: 'info',
  }

  renderBody = () => {
    switch (this.props.type) {
      case 'input':
        return (
          <div>
            <p>{this.props.message}</p>
            <FormControl
              componentClass="textarea"
              id="inputModalField"
              onChange={this.props.onInput}
              value={this.props.inputValue}
            />
          </div>
        );
      default:
        return this.props.message;
    }
  }

  renderButton = action => (
    <Button
      bsStyle={action.style || 'primary'}
      key={action.label}
      onClick={(event) => {
        event.preventDefault();
        action.onClick(this.props);
      }}
    >
      {action.label}
    </Button>
  )

  renderCancelButton = () => {
    if (this.props.cancelable) {
      return this.renderButton({
        style: 'default',
        label: I18n('modal.cancel'),
        onClick: this.props.closeModal,
      });
    }

    return null;
  }

  renderButtons = () => {
    if (this.props.actions.length) {
      return this.props.actions.map(this.renderButton);
    }

    return this.renderButton({
      label: I18n('modal.ok'),
      onClick: this.props.onClick,
    });
  }

  render() {
    return (
      <RBModal show={this.props.display}>
        <RBModal.Header>
          <RBModal.Title>
            {this.props.title}
          </RBModal.Title>
        </RBModal.Header>
        <RBModal.Body>
          {this.renderBody()}
        </RBModal.Body>
        <RBModal.Footer>
          {this.renderCancelButton()}
          {this.renderButtons()}
        </RBModal.Footer>
      </RBModal>
    );
  }
}
