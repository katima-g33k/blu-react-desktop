import React, { Component } from 'react';

import HTTP from '../../../lib/HTTP';
import Item from '../../../lib/models/Item';
import ItemView from './ItemView';
import settings from '../../../settings';


export default class ItemViewContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null,
    };

    this.getActions = this.getActions.bind(this);
  }

  componentWillMount() {
    const data = {
      id: this.props.params.id,
    };

    HTTP.post(`${settings.apiUrl}/item/select`, data, (err, res) => {
      if (res) {
        this.setState({ item: new Item(res) });
      }
    });
  }

  getActions() {
    return [
      {
        label: 'Modifier',
        href: `/item/edit/${this.state.item.id}`,
        style: 'primary',
      },
      {
        label: 'Statut',
        style: 'primary',
        onClick: (event) => {
          event.preventDefault();
        },
      },
      {
        label: 'Gérer les caisses',
        style: 'primary',
        onClick: (event) => {
          event.preventDefault();
        },
      },
    ];
  }

  render() {
    return this.state.item ? (
      <ItemView
        data={this.state.item}
        actions={this.getActions()}
      />
    ) : null;
  }
}

ItemViewContainer.propTypes = {
  params: React.PropTypes.shape(),
};
