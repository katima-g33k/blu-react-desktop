import { browserHistory } from 'react-router';
import { connect } from 'react-redux';

import App from '../App';

const canChangeLocation = () => !browserHistory.getCurrentLocation().pathname.match(/add|edit|copies/);

const mapStateToProps = ({ appStore }) => ({
  api: appStore.apiClient,
});

const mapDispatchToProps = () => ({
  onInvalidScan: () => {
    // this.setState({ showModal: 'invalidCode' });
  },
  onItemScan: async (ean13, api) => {
    if (canChangeLocation()) {
      try {
        const { id } = await api.item.exists(ean13);
        const path = id ? `view/${id}` : `add?ean13=${ean13}`;
        browserHistory.push(`/item/${path}`);
      } catch (error) {
        // this.setState({ error });
      }
    }
  },
  onMemberScan: async (scannedNo, api) => {
    if (canChangeLocation()) {
      try {
        const { no } = await api.member.exists(scannedNo);
        const path = no ? `view/${no}` : `add?no=${scannedNo}`;
        browserHistory.push(`/member/${path}`);
      } catch (error) {
        // this.setState({ error });
      }
    }
  },
});

const mergeProps = (stateProps, dispatchProps) => ({
  api: stateProps.api,
  onInvalidScan: dispatchProps.onInvalidScan,
  onItemScan: ean13 => dispatchProps.onItemScan(ean13, stateProps.api),
  onMemberScan: no => dispatchProps.onMemberScan(no, stateProps.api),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(App);
