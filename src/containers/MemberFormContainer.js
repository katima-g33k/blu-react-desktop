import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import {
  exists,
  fetch,
  insert,
  openExistsModal,
  update,
} from '../actions/memberActions';
import MemberForm from '../components/member/form/MemberForm';
import { formatMemberFormData } from '../lib/memberHelper';

const mapStateToProps = ({ appStore, memberStore }) => ({
  api: appStore.apiClient,
  member: memberStore.member,
  userIsAdmin: JSON.parse(sessionStorage.getItem('user')).isAdmin,
});

const mapDispatchToProps = dispatch => ({
  onExists: (no, isUpdate, userIsAdmin, api) => dispatch(openExistsModal(no, isUpdate, userIsAdmin, api)),
  fetch: (no, api) => dispatch(fetch(api, no)),
  onInsert: (api, member) => dispatch(insert(api, member)),
  onUpdate: (api, no, member) => dispatch(update(api, no, member)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  exists: async (data) => {
    const memberExists = await exists(data, stateProps.api);

    if (memberExists) {
      dispatchProps.onExists(ownProps.params.no, memberExists, stateProps.userIsAdmin, stateProps.api);
    }

    return memberExists;
  },
  member: stateProps.member,
  no: +ownProps.params.no,
  onCancel: () => browserHistory.push(ownProps.params.no ? `/member/view/${ownProps.params.no}` : '/'),
  fetch: () => dispatchProps.fetch(ownProps.params.no, stateProps.api),
  onSave: (formData) => {
    const formattedData = formatMemberFormData(formData);

    if (ownProps.params.no) {
      dispatchProps.onUpdate(stateProps.api, ownProps.params.no, formattedData);
    } else {
      dispatchProps.onInsert(stateProps.api, formattedData);
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MemberForm);
