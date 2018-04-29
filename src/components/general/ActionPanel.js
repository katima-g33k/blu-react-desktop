import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Panel, Row } from 'react-bootstrap';

import I18n from '../../lib/i18n';

const DEFAULT_BS_STYLE = 'primary';
const styles = {
  row: {
    marginBottom: '10px',
  },
};

export default class ActionPanel extends Component {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
      customComponent: PropTypes.node,
      disabled: PropTypes.bool,
      label: PropTypes.string,
      onClick: PropTypes.func,
      style: PropTypes.string,
    })).isRequired,
  };

  renderAction = action => (
    <Row key={action.customComponent || action.label} style={styles.row}>
      <Col md={12}>
        {action.customComponent ? action.customComponent : (
          <Button
            block
            bsStyle={action.style || DEFAULT_BS_STYLE}
            disabled={action.disabled}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
      </Col>
    </Row>
  );

  render() {
    return (
      <Panel header={I18n('general.actions')}>
        {this.props.actions.map(this.renderAction)}
      </Panel>
    );
  }
}
