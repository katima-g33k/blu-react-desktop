import React from 'react';
import { Label } from 'react-bootstrap';
import Item from './models/Item';

const statusHelper = {
  getLabel: (status) => {
    let style;

    switch (status) {
      case Item.STATUS.VALID:
        style = 'success';
        break;
      case Item.STATUS.OUTDATED:
        style = 'warning';
        break;
      case Item.STATUS.REMOVED:
        style = 'danger';
        break;
      default:
        style = 'default';
        break;
    }

    return (
      <Label bsStyle={style}>
        {status}
      </Label>
    );
  },
};

export default statusHelper;
