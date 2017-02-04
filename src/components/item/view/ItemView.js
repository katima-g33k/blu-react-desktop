import React, { Component } from 'react';
import { Label, Panel } from 'react-bootstrap';

import AlignedData from '../../general/AlignedData';
import CopyTableContainer from '../../copy/table/CopyTableContainer';
import I18n, { Translate } from '../../../lib/i18n/i18n';
import { INFORMATION_FIELDS, LABEL_STYLE, PANEL_STYLE } from './constant';
import ProfileStats from '../../general/ProfileStats';

export default class ItemView extends Component {
  constructor(props) {
    super(props);
    this.renderInformation = this.renderInformation.bind(this);
    this.renderInternalManagement = this.renderInternalManagement.bind(this);
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
            value={this.props.data[INFORMATION_FIELDS[key]] || ''}
          />
        ))}
      </section>
    );
  }

  renderInternalManagement() {
    const status = this.props.data.getStatus().toLowerCase();
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
          value={this.props.data.subject.category.name}
        />
        <AlignedData
          label={<Translate value="ItemView.internalManagement.subject" />}
          value={this.props.data.subject.name}
        />
        <AlignedData
          label={<Translate value="ItemView.internalManagement.storage" />}
          value={this.props.data.storageString}
        />
      </section>
    );
  }

  render() {
    return (
      <Panel
        header={I18n.t('ItemView.title')}
        bsStyle={PANEL_STYLE[this.props.data.getStatus()]}
      >
        <h3>{this.props.data.name}</h3>
        {this.renderInformation()}
        {this.renderInternalManagement()}
        <h4>
          <Translate value="ItemView.stats.title" />
        </h4>
        <ProfileStats copies={this.props.data.copies}/>
        <CopyTableContainer copies={this.props.data.copies} />
      </Panel>
    );
  }
}

ItemView.propTypes = {
  data: React.PropTypes.shape(),
};
