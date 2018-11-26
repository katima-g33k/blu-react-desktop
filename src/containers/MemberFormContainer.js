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

const mapStateToProps = ({ appStore, memberStore, userStore }) => ({
  api: appStore.apiClient,
  member: memberStore.member,
  userIsAdmin: userStore.user.isAdmin,
});

const mapDispatchToProps = dispatch => ({
  onExists: (api, no, isUpdate, userIsAdmin) => dispatch(openExistsModal(no, isUpdate, userIsAdmin, api)),
  fetch: (api, no) => dispatch(fetch(api, no)),
  onInsert: (api, member) => dispatch(insert(api, member)),
  onUpdate: (api, no, member) => dispatch(update(api, no, member)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { member } = stateProps;

  if (ownProps.location.query.no) {
    member.no = +ownProps.location.query.no;
  }

  return {
    exists: async (data) => {
      const memberExists = await exists(data, stateProps.api);

      if (memberExists) {
        dispatchProps.onExists(stateProps.api, ownProps.params.no, memberExists, stateProps.userIsAdmin);
      }

      return memberExists;
    },
    member,
    no: +ownProps.params.no,
    onCancel: () => browserHistory.push(ownProps.params.no ? `/member/view/${ownProps.params.no}` : '/'),
    fetch: () => ownProps.params.no && dispatchProps.fetch(stateProps.api, ownProps.params.no),
    onSave: (formData) => {
      const formattedData = formatMemberFormData(formData);

      if (ownProps.params.no) {
        dispatchProps.onUpdate(stateProps.api, ownProps.params.no, formattedData);
      } else {
        dispatchProps.onInsert(stateProps.api, formattedData);
      }
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MemberForm);
