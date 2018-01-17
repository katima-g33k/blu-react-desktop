import React, { Component } from 'react';
import { Button, Col, Panel, Row } from 'react-bootstrap';
import { Link } from 'react-router';

import CustomButton from './CustomButton';

export default class ActionPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actions: props.actions || [],
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ actions: props.actions || [] });
  }

  render() {
    const style = {
      marginBottom: '10px',
    };

    return (
      <Panel header="actions">
        {this.props.actions.map((action, index) => {
          if (action.custom) {
            return (<CustomButton key={`action${index}`} {...action} />);
          }

          return (
            <Row key={`action${index}`} style={style}>
              <Col md={12}>
                <Link to={action.href || '#'}>
                  <Button
                    block
                    bsStyle={action.style || 'primary'}
                    disabled={!!action.disabled}
                    onClick={(event) => {
                      event.preventDefault();
                      action.onClick(event);
                    }}
                  >
                    {action.label}
                  </Button>
                </Link>
              </Col>
            </Row>
          );
        })}
      </Panel>
    );
  }
}

ActionPanel.propTypes = {
  actions: React.PropTypes.array,
};
