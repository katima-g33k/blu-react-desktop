import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { browserHistory } from 'react-router';
import GitHub from 'github';
import moment from 'moment';
import request from 'request';

import API from './lib/API';
import Github from './lib/Github';
import Header from './components/general/Header';
import { InformationModal } from './components/general/modals';
import Login from './components/login/Login';
import Routes from './routes/Routes';
import scanner from './lib/Scanner';
import settings from './lib/Settings';
import SettingsView from './components/general/SettingsView';
import Sidebar from './components/general/Sidebar';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      settingsUpdatedAt: null,
      showModal: null,
      update: {
        currentVersion: settings.appVersion,
        assetId: null,
        newVersion: null,
        url: null,
      },
      user: null,
    };
  }

  async componentWillMount() {
    // const { currentVersion } = this.state.update;
    // const { tag_name, assets } = await Github.repos.releases.latest('katima-g33k', 'blu-react-desktop');

    // if (currentVersion < tag_name) {
    //   const asset = assets.find(({ content_type }) => content_type === 'application/x-ms-dos-executable');

    //   if (asset) {
    //     this.setState({
    //       showModal: 'update',
    //       update: {
    //         currentVersion,
    //         assetId: asset.id,
    //         newVersion: tag_name,
    //         url: asset.browser_download_url,
    //       },
    //     });
    //   }
    // }


    const user = sessionStorage.getItem('user');

    scanner.addListener('onInvalidScan', this.onInvalidScan);
    scanner.addListener('onItemScan', this.onItemScan);
    scanner.addListener('onMemberScan', this.onMemberScan);

    if (user) {
      this.setState({ user: JSON.parse(user) });
    }
  }

  canChangeLocation = () => {
    return !browserHistory.getCurrentLocation().pathname.match(/add|edit|copies/);
  }

  onInvalidScan = () => {
    this.setState({ showModal: 'invalidCode' });
  }

  onItemScan = (ean13) => {
    if (this.canChangeLocation()) {
      API.item.exists(ean13, (error, res) => {
        if (error) {
          this.setState({ error });
          return;
        }

        const path = res.id ? `view/${res.id}` : `add?ean13=${ean13}`;
        browserHistory.push(`/item/${path}`);
      });
    }
  }

  onMemberScan = (no) => {
    if (this.canChangeLocation()) {
      API.member.exists({ no }, (error, res) => {
        if (error) {
          this.setState({ error });
          return;
        }

        const path = res.no ? `view/${res.no}` : `add?no=${no}`;
        browserHistory.push(`/member/${path}`);
      });
    }
  }

  onLogin = (user) => {
    this.setState({ user });
  }

  onLogout = () => {
    sessionStorage.removeItem('user');
    this.setState({ user: null });
  }

  onSettingsSave = () => {
    this.setState({ settingsUpdatedAt: moment() });
  }

  resetState = () => {
    this.setState({ error: null, showModal: null });
  }

  renderMain = () => {
    const { apiKey, apiUrl, secretKey } = settings;

    if (!apiKey || !apiUrl || !secretKey) {
      return (
        <Row componentClass="main">
          <Col md={6} mdOffset={3}>
            <SettingsView
              firstSetup
              onSave={this.onSettingsSave}
            />
          </Col>
        </Row>
      );
    }

    if (!this.state.user) {
      return (
        <Row componentClass="main">
          <Login onConnected={this.onLogin} />
        </Row>
      );
    }

    return (
      <Row componentClass="main">
        <Col componentClass="aside" sm={0} md={2}>
          <Sidebar onLogout={this.onLogout} />
        </Col>
        <Col sm={12} md={10}>
          <Routes />
        </Col>
      </Row>
    );
  }


  renderModal = () => {
    const { error, showModal, update } = this.state;
    const { assetId, currentVersion, newVersion, url } = update;

    if (error) {
      return (
        <InformationModal
          message={error.message}
          onClick={this.resetState}
          title={`Error ${error.code}`}
        />
      );
    }

    // if (newVersion && url) {
    //    // eslint-disable-next-line max-len
    //   const message = `Vous êtes sur la version ${currentVersion} et la version la plus récente est la ${newVersion}. Voulez-vous mettre à jour maintenant ?`;
    //   return (
    //     <InformationModal
    //       message={message}
    //       onClick={async () => {
    //         try {
    //           const options = {
    //             mode: 'no-cors',
    //             headers: {
    //               Accept: 'application/octet-stream',
    //             },
    //           };
    //           const asset = await fetch('https://api.github.com/repos/katima-g33k/blu-react-desktop/releases/assets/4592766', options);
    //           // const asset = await Github.repos.releases.getAssets('katima-g33ks', 'blu-react-desktop', assetId);
    //           console.log(asset);
    //         } catch (err) {
    //           console.log('ERR', err);
    //         }
    //       }}
    //       title={'Mise à jour disponible'}
    //     />
    //   );
    // }

    switch (showModal) {
      case 'invalidCode':
        return (
          <InformationModal
            message={'Le code que vous venez de scanner n\'est pas supporté par le système de la BLU'}
            onClick={this.resetState}
            title={'Code invalide'}
          />
        );
      case 'update':
      default:
        return null;
    }
  }

  render() {
    return (
      <Row>
        <Col md={12}>
          <Row>
            <Col md={12}>
              <Header />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              {this.renderMain()}
            </Col>
          </Row>
        </Col>
        {this.renderModal()}
      </Row>
    );
  }
}
