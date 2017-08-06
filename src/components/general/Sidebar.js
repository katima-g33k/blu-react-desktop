import React, { Component } from 'react';
import { Col, Glyphicon, Row } from 'react-bootstrap';
import { browserHistory } from 'react-router';

import { Translate } from '../../lib/i18n/i18n';

const menuItems = [
  {
    key: 'search',
    href: '/search',
  },
  {
    key: 'item',
    children: [
      {
        key: 'item_form',
        href: '/item/add',
      },
      {
        key: 'item_view',
      },
    ],
  },
  {
    key: 'member',
    children: [
      {
        key: 'member_form',
        href: '/member/add',
      },
      {
        key: 'member_view',
      },
      {
        key: 'member_copies',
      },
    ],
  },
];

const adminMenuItems = {
  key: 'admin',
  children: [
    {
      key: 'admin_reservations',
      href: '/admin/reservations',
    },
    {
      key: 'admin_storage',
      href: '/admin/storage',
    },
    {
      key: 'admin_statistics',
      href: '/admin/statistics',
    },
    {
      key: 'admin_employees',
      href: '/admin/employees',
    },
    {
      key: 'admin_itemList',
      href: '/admin/item/list',
    },
  ],
};

const settingsMenuItem = {
  key: 'settings',
  href: '/settings',
};

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '/',
    };

    this.isCurrentLocation = this.isCurrentLocation.bind(this);
    this.getMenuItems = this.getMenuItems.bind(this);
    this.renderBackButton = this.renderBackButton.bind(this);
    this.renderMenu = this.renderMenu.bind(this);
  }

  componentDidMount() {
    this.setState({ location: browserHistory.getCurrentLocation().pathname });

    browserHistory.listen(({ pathname }) => {
      this.setState({ location: pathname });
    });
  }

  isCurrentLocation(key, href) {
    const { location } = this.state;
    return location.includes(href) || location.includes(key.replace(/_/g, '/'));
  }

  getMenuItems() {
    const user = sessionStorage.getItem('user');
    const data = [...menuItems];

    if (user && JSON.parse(user).isAdmin) {
      data.push(adminMenuItems);
    }

    data.push(settingsMenuItem);
    return data;
  }

  renderBackButton() {
    return (
      <p id="backButton" onClick={browserHistory.goBack}>
        <Glyphicon glyph="arrow-left" /> {'Page précédente'}
      </p>
    );
  }

  renderMenu(data, isChild) {
    return data.map(({ children, key, href }) => {
      if (children) {
        return (
          <li
            key={key}
            style={{
              margin: '10px 0',
              paddingLeft: '10px',
            }}
          >
            <Translate value={`Sidebar.${key}`} />
            <ul style={{ listStyle: 'none' }}>
              {this.renderMenu(children, true)}
            </ul>
            <hr/>
          </li>
        );
      }

      const isCurrentLocation = this.isCurrentLocation(key, href);
      const onClick = () => {
        if (href) {
          browserHistory.push(href);
        }
      };
      return (
        <li
          key={key}
          onClick={onClick}
          style={{
            cursor: href ? 'pointer' : 'default',
            padding: '10px',
            backgroundColor: isCurrentLocation ? '#F5F5F5' : '#FFF',
            fontWeight: isCurrentLocation ? 'bold' : 'normal',
          }}
        >
          <Translate value={`Sidebar.${key}`} />
          {!isChild && <hr/>}
        </li>
      );
    });
  }

  render() {
    return (
      <Row componentClass='nav'>
        <Row>
          <Col md={12}>
            {this.renderBackButton()}
          </Col>
        </Row>
        <Row>
          <Col
            md={12}
            componentClass='ul'
            style={{ listStyle: 'none', fontSize: '1.1em', padding: '20px' }}
          >
            {this.renderMenu(this.getMenuItems())}
          </Col>
        </Row>
      </Row>
    );
  }
}
