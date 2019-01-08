import React, { Component } from 'react';
import ReactLoading from 'react-loading';

const styles = {
  spinner: {
    color: '#7D8364',
    height: 64,
    margin: 'auto',
    width: 64,
  },
  wrapper: {
    textAlign: 'center',
  },
};

export default class Spinner extends Component {
  render() {
    return (
      <div style={styles.wrapper}>
        <ReactLoading style={styles.spinner} type="bubbles" />
      </div>
    );
  }
}
