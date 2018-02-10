import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { TableHeaderColumn } from 'react-bootstrap-table';

import { Button } from '../general';

const BUTTON_WIDTH = 45;
const DEFAULT_ACTION_COUNT = 4;

export default class ActionColumn extends Component {
  static propTypes = {
    rowActions: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.shape({
        bsStyle: PropTypes.string,
        glyph: PropTypes.string,
        onClick: PropTypes.func,
      })),
      PropTypes.func,
    ]),
  };

  static defaultProps = {
    rowActions: [],
  };

  get width() {
    let actionCount = this.props.rowActions.length;

    if (typeof this.props.rowActions === 'function') {
      actionCount = DEFAULT_ACTION_COUNT;
    }

    return actionCount * BUTTON_WIDTH;
  }

  getRowActions = (row) => {
    try {
      return this.props.rowActions(row);
    } catch (error) {
      return this.props.rowActions;
    }
  };

  renderAssistiveButton = (action, row, key) => (
    <OverlayTrigger
      key={key}
      overlay={<Tooltip id={action.help}>{action.help}</Tooltip>}
      placement="bottom"
    >
      {this.renderActionButton(action, row)}
    </OverlayTrigger>
  )

  renderActionButton = (action, actionData, key) => (
    <Button
      {...action}
      actionData={actionData}
      key={key}
    />
  )

  renderActionButtonGroup = row => this.getRowActions(row).map((action) => {
    if (action.help) {
      return this.renderAssistiveButton(action, row, `${row.id}${action.onClick}`);
    }

    return this.renderActionButton(action, row, `${row.id}${action.onClick}`);
  })

  render() {
    return (
      <TableHeaderColumn
        dataAlign="center"
        dataField="action"
        dataFormat={(cell, row) => (
          <ButtonGroup>
            {this.renderActionButtonGroup(row)}
          </ButtonGroup>
        )}
        width={`${this.width}px`}
      />
    );
  }
}
