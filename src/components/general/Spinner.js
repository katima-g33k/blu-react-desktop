import React, { Component } from 'react';
import { PulseLoader } from 'halogen';

const styles = {
  spinner: {
    color: '#7D8364',
    size: '16px',
  },
  wrapper: {
    textAlign: 'center',
  },
};

export default class Spinner extends Component {
  render() {
    return (
      <div style={styles.wrapper}>
        <PulseLoader {...styles.spinner} />
      </div>
    );
  }
}
