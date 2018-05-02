import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, FormControl, Modal as RBModal } from 'react-bootstrap';

import './modal.css';
import I18n from '../../../lib/i18n';
import Search from '../../../containers/SearchContainer';

const { Title, Header, Body, Footer } = RBModal;

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
      style: PropTypes.string,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })),
    cancelable: PropTypes.bool,
    closeModal: PropTypes.func.isRequired,
    display: PropTypes.bool.isRequired,
    inputType: PropTypes.oneOf(Object.values(INPUT_TYPES)),
    inputValue: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    onInput: PropTypes.func.isRequired,
    onSelect: PropTypes.func,
    message: PropTypes.string,
    onClick: PropTypes.func,
    title: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.values(TYPES)),
  }

  static defaultProps = {
    actions: [],
    cancelable: false,
    inputType: INPUT_TYPES.TEXT,
    inputValue: '',
    message: '',
    onClick: undefined,
    onSelect: () => {},
    type: TYPES.INFO,
  }

  static TYPES = TYPES
  static INPUT_TYPES = INPUT_TYPES

  getId = () => `${this.props.type}Modal`

  body = {
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
        onRowClick={this.props.onSelect}
        type={Search.TYPES.PARENT}
      />
    ),
  }

  renderBody = () => this.body[this.props.type] || this.props.message

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

    if (this.props.onClick) {
      return this.renderButton({
        label: I18n('modal.ok'),
        onClick: this.props.onClick,
      });
    }

    return null;
  }

  render() {
    return (
      <RBModal id={this.getId()} show={this.props.display}>
        <Header>
          <Title>
            {this.props.title}
          </Title>
        </Header>
        <Body>
          {this.renderBody()}
        </Body>
        <Footer>
          {this.renderCancelButton()}
          {this.renderButtons()}
        </Footer>
      </RBModal>
    );
  }
}
