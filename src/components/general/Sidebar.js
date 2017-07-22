import React, { Component } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { browserHistory } from 'react-router';

import { Translate } from '../../lib/i18n/i18n';

const links = [
  {
    key: 'search',
    href: '/search',
  },
  {
    key: 'item',
    href: '/item/add',
  },
  {
    key: 'member',
    href: '/member/add',
  },
  {
    key: 'admin',
    href: '/admin',
  },
];

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '/',
    };

    this.isCurrentLocation = this.isCurrentLocation.bind(this);
  }

  componentDidMount() {
    this.setState({ location: browserHistory.getCurrentLocation().pathname });

    browserHistory.listen(({ pathname }) => {
      this.setState({ location: pathname });
    });
  }

  isCurrentLocation(key) {
    return (new RegExp(key)).test(this.state.location);
  }

  render() {
    return (
      <Row>
        <Col>
          {links.map(({ href, key }) => (
            <Button
              block
              bsSize="large"
              bsStyle={this.isCurrentLocation(key) ? 'primary' : 'default'}
              key={`nav_${key}`}
              onClick={() => browserHistory.push(href)}>
                <Translate value={`Sidebar.${key}`} />
            </Button>
          ))}
        </Col>
      </Row>
    );
  }
}
