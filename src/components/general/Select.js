import React, { Component, PropTypes } from 'react';
import { Col, ControlLabel, FormControl, Row } from 'react-bootstrap';

export default class Select extends Component {
  constructor(props) {
    super(props);

    this.renderOptgroups = this.renderOptgroups.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
  }

  renderOptions(options) {
    return options.map(({ label, value }) => (
      <option
        key={value}
        value={value}
      >
        {label}
      </option>
    ));
  }

  renderOptgroups(optgroups) {
    return optgroups.map((optgroup, index) => (
      <optgroup
        key={`optgroup${index}`}
        label={optgroup.label}
      >
        {this.renderOptions(optgroup.options)}
      </optgroup>
    ));
  }

  render() {
    const { data, label, onChange, value } = this.props;

    return (
      <Row>
        <Col
          componentClass={ControlLabel}
          md={2}
          style={{ paddingTop: '6px' }}
        >
          {label}
        </Col>
        <Col md={10}>
          <FormControl
            componentClass='select'
            onChange={onChange}
            value={value}
          >
            {data[0].options ? this.renderOptgroups(data) : this.renderOptions(data)}
          </FormControl>
        </Col>
      </Row>
    );
  }
}

Select.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};
