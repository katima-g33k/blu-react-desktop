import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';

const styles = {
  container: {
    marginBottom: 5,
    marginTop: 5,
  },
};

export default class AlignedData extends Component {
  static propTypes = {
    className: PropTypes.string,
    componentClass: PropTypes.string,
    label: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.string,
    ]).isRequired,
    value: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
  };

  static defaultProps = {
    className: '',
    componentClass: 'div',
  };

  render() {
    return (
      <Row
        className={this.props.className}
        componentClass={this.props.componentClass}
        style={styles.container}
      >
        <Col md={4}>{this.props.label}</Col>
        <Col>{this.props.value}</Col>
      </Row>
    );
  }
}
