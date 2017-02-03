import React, { Component } from 'react';
import { Label, Panel } from 'react-bootstrap';
import I18n, { Translate } from '../../lib/i18n/i18n';
import HTTP from '../../lib/HTTP';
import ProfileStats from '../general/ProfileStats';
import settings from '../../settings';
import CopyTableContainer from '../copy/table/CopyTableContainer';
import Item from '../../lib/models/Item';
import AlignedData from '../general/AlignedData';

const INFORMATION_FIELDS = {
  authors: 'authorString',
  edition: 'edition',
  editor: 'editor',
  publication: 'publication',
  ean13: 'ean13',
  comment: 'comment',
};

const LABEL_STYLE = {
  valid: 'success',
  outdated: 'warning',
  removed: 'danger',
};

const PANEL_STYLE = {
  VALID: 'default',
  OUTDATED: 'warning',
  REMOVED: 'danger',
};

export default class ItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null,
    };

    this.renderInformation = this.renderInformation.bind(this);
    this.renderInternalManagement = this.renderInternalManagement.bind(this);
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

  renderInformation() {
    return (
      <section>
        <h4>
          <Translate value="ItemView.information.title" />
        </h4>
        {Object.keys(INFORMATION_FIELDS).map(key => (
          <AlignedData
            key={key}
            label={<Translate value={`ItemView.information.${key}`} />}
            value={this.state.item[INFORMATION_FIELDS[key]] || ''}
          />
        ))}
      </section>
    );
  }

  renderInternalManagement() {
    const status = this.state.item.getStatus().toLowerCase();
    return (
      <section>
        <h4>
          <Translate value="ItemView.internalManagement.title" />
        </h4>
        <AlignedData
          label={<Translate value="ItemView.internalManagement.status" />}
          value={
            <Label bsStyle={LABEL_STYLE[status]}>
              <Translate value={`ItemView.internalManagement.${status}`} />
            </Label>
          }
        />
        <AlignedData
          label={<Translate value="ItemView.internalManagement.category" />}
          value={this.state.item.subject.category.name}
        />
        <AlignedData
          label={<Translate value="ItemView.internalManagement.subject" />}
          value={this.state.item.subject.name}
        />
        <AlignedData
          label={<Translate value="ItemView.internalManagement.storage" />}
          value={this.state.item.storageString}
        />
      </section>
    );
  }

  render() {
    return this.state.item ? (
      <Panel
        header={I18n.t('ItemView.title')}
        bsStyle={PANEL_STYLE[this.state.item.getStatus()]}
      >
        <h3>{this.state.item.name}</h3>
        {this.renderInformation()}
        {this.renderInternalManagement()}
        <h4>
          <Translate value="ItemView.stats.title" />
        </h4>
        <ProfileStats copies={this.state.item.copies}/>
        <CopyTableContainer copies={this.state.item.copies} />
      </Panel>
    ) : null;
  }
}

ItemView.propTypes = {
  params: React.PropTypes.shape(),
};
