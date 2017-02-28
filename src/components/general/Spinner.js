import React, { Component } from 'react';
import { PulseLoader } from 'halogen';

export default class Spinner extends Component {
  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <PulseLoader
          color="#7D8364"
          size="16px"
        />
      </div>
    );
  }
}
