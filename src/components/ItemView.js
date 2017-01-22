import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import I18n, { Translate } from '../lib/i18n/i18n';
import HTTP from '../lib/HTTP';
import ProfileStats from './ProfileStats';
import settings from '../settings';
import CopyTable from './CopyTable';

export default class ItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null,
    };
    this.renderInformation = this.renderInformation.bind(this);
    this.getAuthors = this.getAuthors.bind(this);
    this.getStorage = this.getStorage.bind(this);
    this.getStatus = this.getStatus.bind(this);
    this.renderInternalManagement = this.renderInternalManagement.bind(this);
    this.renderStats = this.renderStats.bind(this);
    this.isValid = this.isValid.bind(this);
    this.isOutdated = this.isOutdated.bind(this);
    this.isRemoved = this.isRemoved.bind(this);
    this.getPanelStyle = this.getPanelStyle.bind(this);
  }

  componentWillMount() {
    const url = `${settings.apiUrl}/item/select`;
    const data = {
      id: this.props.params.id,
    };

    HTTP.post(url, data, (err, item) => {
      if (item) {
        this.setState({ item });
      }
    });
  }

  getAuthors() {
    const authors = this.state.item.author;
    if (!Array.isArray(authors)) {
      return '';
    }
    return authors.map((author) => `${author.first_name} ${author.last_name}`).join(', ');
  }

  getStorage() {
    return this.state.item.storage.join(', ');
  }

  isValid() {
    if (!this.state.item) {
      return true;
    }

    const status = this.state.item.status;
    return !status.REMOVED && !status.OUTDATED;
  }

  isOutdated() {
    if (!this.state.item) {
      return false;
    }

    const status = this.state.item.status;
    return !status.REMOVED && status.OUTDATED;
  }

  isRemoved() {
    return this.state.item && this.state.item.status.REMOVED;
  }

  getStatus() {
    const status = this.state.item.status;

    if (status.REMOVED) {
      return I18n.t('ItemView.internalManagement.removed');
    }

    if (status.OUTDATED) {
      return I18n.t('ItemView.internalManagement.outdated');
    }

    return I18n.t('ItemView.internalManagement.valid');
  }

  getPanelStyle() {
    if (this.isValid()) {
      return 'default';
    }

    return this.isOutdated() ? 'warning' : 'danger';
  }

  renderInformation() {
    return this.state.item ? (
      <section>
        <h4>
          <Translate value="ItemView.information.title" />
        </h4>
        <p>
          <Translate value="ItemView.information.authors" />: {this.getAuthors()}
        </p>
        <p>
          <Translate value="ItemView.information.edition" />: {this.state.item.edition}
        </p>
        <p>
          <Translate value="ItemView.information.editor" />: {this.state.item.editor}
        </p>
        <p>
          <Translate value="ItemView.information.publication" />: {this.state.item.publication}
        </p>
        <p>
          <Translate value="ItemView.information.barcode" />: {this.state.item.ean13}
        </p>
        <p>
          <Translate value="ItemView.information.comment" />: {this.state.item.comment}
        </p>
      </section>
    ) : null;
  }

  renderInternalManagement() {
    const subject = this.state.item ? this.state.item.subject.name : '';
    const category = this.state.item ? this.state.item.subject.category.name : '';

    return this.state.item ? (
      <section>
        <h4>
          <Translate value="ItemView.internalManagement.title" />
        </h4>
        <p>
          <Translate value="ItemView.internalManagement.status" />: {this.getStatus()}
        </p>
        <p>
          <Translate value="ItemView.internalManagement.category" />: {category}
        </p>
        <p>
          <Translate value="ItemView.internalManagement.subject" />: {subject}
        </p>
        <p>
          <Translate value="ItemView.internalManagement.storage" />: {this.getStorage()}
        </p>
      </section>
    ) : null;
  }

  renderStats() {
    return this.state.item ? (
      <section>
        <h4>
          <Translate value="ItemView.stats.title" />
        </h4>
        <ProfileStats copies={this.state.item.copies}/>
      </section>
    ) : null;
  }

  render() {
    return this.state.item ? (
      <Panel
        header={I18n.t('ItemView.title')}
        bsStyle={this.getPanelStyle()}
      >
        <h3>{this.state.item.name}</h3>
        {this.renderInformation()}
        {this.renderInternalManagement()}
        {this.renderStats()}
        <CopyTable copies={this.state.item.copies} />
      </Panel>
    ) : null;
  }
}

ItemView.propTypes = {
  params: React.PropTypes.shape(),
};
