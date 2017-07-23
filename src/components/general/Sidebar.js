import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';

import { browserHistory } from 'react-router';

import settings from '../../settings.json';
import { Translate } from '../../lib/i18n/i18n';

const links = [
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

if (settings.isAdmin) {
  links.push({
    key: 'admin',
    href: '/admin',
  });
}

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '/',
    };

    this.isCurrentLocation = this.isCurrentLocation.bind(this);
    this.getList = this.getList.bind(this);
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

  getList(data) {
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
              {this.getList(children)}
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
          {data === links && <hr/>}
        </li>
      );
    });
  }

  render() {
    return (
      <Row componentClass='nav'>
        <Col
          md={12}
          componentClass='ul'
          style={{ listStyle: 'none', fontSize: '1.1em', padding: '20px' }}
        >
          {this.getList(links)}
        </Col>
      </Row>
    );
  }
}
