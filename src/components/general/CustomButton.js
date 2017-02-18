import React, { Component } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

const style = {
  left: {
    borderRight: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  center: {
    borderLeft: 0,
    borderRight: 0,
    borderRadius: 0,
  },
  right: {
    borderLeft: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
};

export default class CustomButton extends Component {
  render() {
    return (
      <div>
        <Button
          {...this.props.leftButton}
          style={style.left}
        >
          <Glyphicon glyph={this.props.iconLeft} />
        </Button>
        <Button
          bsStyle={this.props.bsStyleCenter}
          style={style.center}
        >
          {this.props.label}
        </Button>
        <Button
          {...this.props.rightButton}
          style={style.right}
        >
          <Glyphicon glyph={this.props.iconRight} />
        </Button>
      </div>
    );
  }
}

CustomButton.propTypes = {
  bsStyleCenter: React.PropTypes.string,
  iconLeft: React.PropTypes.string.isRequired,
  iconRight: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  leftButton: React.PropTypes.shape(),
  rightButton: React.PropTypes.shape(),
};
