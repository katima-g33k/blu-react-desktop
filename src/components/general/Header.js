import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Image, Row } from 'react-bootstrap';

import { ASSETS } from '../../lib/constants';
import { getAssetPath } from '../../lib/helpers/assets';
import i18n from '../../lib/i18n';

import Icon from './Icon';
import LogoutButton from '../../containers/LogoutButtonContainer';
import ShortcutButton from './ShortcutButton';

const shortcuts = [
  {
    href: '/search',
    icon: Icon.ICONS.SEARCH,
    key: 'search',
  },
  {
    href: '/member/add',
    icon: Icon.ICONS.MEMBER,
    key: 'member_form',
  },
  {
    href: '/item/add',
    icon: Icon.ICONS.ITEM,
    key: 'item_form',
  },
  {
    href: '/settings',
    icon: Icon.ICONS.SETTINGS,
    key: 'settings',
  },
];

const adminShortcuts = [
  {
    href: '/admin/reservations',
    key: 'admin_reservations',
  },
  {
    href: '/admin/storage',
    key: 'admin_storage',
  },
  {
    href: '/admin/statistics',
    key: 'admin_statistics',
  },
  {
    href: '/admin/employees',
    key: 'admin_employees',
  },
  {
    href: '/admin/item/list',
    key: 'admin_itemList',
  },
  {
    href: '/admin/duplicates',
    key: 'admin_memberDuplicates',
  },
];

const styles = {
  button: {
    margin: 5,
  },
  header: {
    marginBottom: 20,
  },
  logo: {
    maxWidth: '100%',
  },
};

export default class Header extends Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool,
    isUserAdmin: PropTypes.bool,
    onShortcutClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isLoggedIn: false,
    isUserAdmin: false,
  };

  renderShortcut = shortcut => (
    <ShortcutButton
      {...shortcut}
      hint={shortcut.label || i18n(`Sidebar.${shortcut.key}`)}
      onClick={this.props.onShortcutClick}
      style={styles.button}
    />
  );

  renderAdminShortcut = shortcut => this.renderShortcut({
    ...shortcut,
    label: i18n(`Sidebar.${shortcut.key}`),
  });

  renderShortcuts = () => shortcuts.map(this.renderShortcut);

  renderAdminShortcuts = () => this.props.isUserAdmin && adminShortcuts.map(this.renderAdminShortcut);

  renderButtons = () => this.props.isLoggedIn && (
    <Col md={11}>
      <Row>
        <Col md={12}>
          <LogoutButton style={styles.button} />
          {this.renderShortcuts()}
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          {this.renderAdminShortcuts()}
        </Col>
      </Row>
    </Col>
  );

  render() {
    return (
      <Row componentClass="header" style={styles.header}>
        <Col md={1}>
          <Image src={getAssetPath(ASSETS.LOGO)} style={styles.logo} />
        </Col>
        {this.renderButtons()}
      </Row>
    );
  }
}
