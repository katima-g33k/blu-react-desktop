import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  Modal as RBModal,
} from 'react-bootstrap';

import './modal.css';
import i18n from '../../../lib/i18n';
import ModalButton from '../../../containers/ModalButtonContainer';
import Search from '../../../containers/SearchContainer';

const {
  Body,
  Footer,
  Header,
  Title,
} = RBModal;

const INPUT_TYPES = {
  NUMBER: 'number',
  TEXT: 'text',
  TEXTAREA: 'textarea',
};

const TYPES = {
  INFO: 'info',
  INPUT: 'input',
  SEARCH: 'search',
};

export default class Modal extends Component {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      style: PropTypes.string,
    })),
    cancelable: PropTypes.bool,
    display: PropTypes.bool.isRequired,
    inputType: PropTypes.oneOf(Object.values(INPUT_TYPES)),
    inputValue: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    onInput: PropTypes.func.isRequired,
    message: PropTypes.string,
    onClick: PropTypes.func,
    title: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.values(TYPES)),
  };

  static defaultProps = {
    actions: [],
    cancelable: false,
    inputType: INPUT_TYPES.TEXT,
    inputValue: '',
    message: '',
    onClick: undefined,
    type: TYPES.INFO,
  };

  static TYPES = TYPES;

  static INPUT_TYPES = INPUT_TYPES;

  get id() {
    return `${this.props.type}${this.constructor.name}`;
  }

  get body() {
    return {
      [TYPES.INFO]: this.props.message,
      [TYPES.INPUT]: (
        <div>
          <p>{this.props.message}</p>
          <FormControl
            componentClass={this.props.inputType === INPUT_TYPES.TEXTAREA ? 'textarea' : 'input'}
            id="inputModalField"
            onChange={this.props.onInput}
            type={this.props.inputType}
            value={this.props.inputValue}
          />
        </div>
      ),
      [TYPES.SEARCH]: (
        <Search
          disableAddButton
          disableArchive
          disableTypeSelection
          noHeader
          type={Search.TYPES.PARENT}
        />
      ),
    };
  }

  renderButton = action => (
    <ModalButton
      extraData={this.props}
      key={action.label}
      label={action.label}
      onClick={action.onClick}
      style={action.style}
    />
  );

  renderCancelButton = () => this.props.cancelable && this.renderButton({
    label: i18n('modal.cancel'),
    style: 'default',
  });

  renderActionButtons = () => {
    if (this.props.actions.length) {
      return this.props.actions.map(this.renderButton);
    }

    if (this.props.onClick) {
      return this.renderButton({
        label: i18n('modal.ok'),
        onClick: this.props.onClick,
      });
    }

    return null;
  };

  render() {
    return (
      <RBModal id={this.id} show={this.props.display}>
        <Header>
          <Title>
            {this.props.title}
          </Title>
        </Header>
        <Body>
          {this.body[this.props.type]}
        </Body>
        <Footer>
          {this.renderCancelButton()}
          {this.renderActionButtons()}
        </Footer>
      </RBModal>
    );
  }
}
