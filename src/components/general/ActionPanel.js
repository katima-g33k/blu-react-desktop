import React, { Component } from 'react';
import { Button, Col, Panel, Row } from 'react-bootstrap';
import { Link } from 'react-router';

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
      <Panel header='actions'>
        {this.props.actions.map((action, index) => {
          return (
            <Row key={`action${index}`} style={style}>
              <Col md={12}>
                <Link to={action.href || '#'}>
                  <Button
                    block
                    bsStyle={action.style || 'default'}
                    onClick={action.onClick}
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
