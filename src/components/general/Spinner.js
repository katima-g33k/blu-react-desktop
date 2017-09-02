import React from 'react';
import { PulseLoader } from 'halogen';

const Spinner = () => (
  <div style={{ textAlign: 'center' }}>
    <PulseLoader
      color="#7D8364"
      size="16px"
    />
  </div>
);

export default Spinner;
