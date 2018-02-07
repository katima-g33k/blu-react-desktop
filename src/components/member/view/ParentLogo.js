import React, { Component } from 'react';
import { Image } from 'react-bootstrap';

const dir = __dirname;
const path = '../../assets/images/logo_parents_etudiants.png';
const styles = {
  image: {
    border: 'none',
    height: '30px',
    marginBottom: '5px',
    marginLeft: '10px',
  },
};

export default class ParentLogo extends Component {
  render() {
    return (
      <Image
        src={`${dir === '/' ? '' : `${dir}/`}${path}`}
        style={styles.image}
      />
    );
  }
}
