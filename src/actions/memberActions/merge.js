import { browserHistory } from 'react-router';

import { close } from '../modalActions';
import I18n from '../../lib/i18n';
import {
  MERGE_MEMBER_FAIL,
  MERGE_MEMBER_PENDING,
  MERGE_MEMBER_SUCCESS,
  OPEN_MODAL,
} from '../actionTypes';

const pending = () => ({
  type: MERGE_MEMBER_PENDING,
});

const success = no => ({
  no,
  type: MERGE_MEMBER_SUCCESS,
});

const fail = error => ({
  error,
  type: MERGE_MEMBER_FAIL,
});

export default (duplicate, no, apiClient) => async (dispatch) => {
  dispatch(pending());

  try {
    await apiClient.member.duplicates.merge(duplicate, no);

    dispatch(success(no));
    dispatch({
      actions: [{
        label: I18n('actions.ok'),
        onClick: () => {
          dispatch(close());
          browserHistory.push(`/member/view/${no}`);
        },
      }],
      message: I18n('MemberForm.modals.exists.merged.message'),
      title: I18n('MemberForm.modals.exists.merged.title'),
      type: OPEN_MODAL,
    });
  } catch (error) {
    dispatch(fail(error));
  }
};
