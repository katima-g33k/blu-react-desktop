import React, { Component } from 'react';
import { Image } from 'react-bootstrap';

import { ASSETS } from '../../../lib/constants';
import { getAssetPath } from '../../../lib/helpers/assets';

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
        src={getAssetPath(ASSETS.STUDENT_PARENT_LOGO)}
        style={styles.image}
      />
    );
  }
}
