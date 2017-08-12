import React from 'react';
import { Label } from 'react-bootstrap';
import Item from './models/Item';

const statusHelper = {
  getLabel: (item) => {
    let style;

    switch (item.getStatus()) {
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
        {item.getStatusString()}
      </Label>
    );
  },
};

export default statusHelper;
