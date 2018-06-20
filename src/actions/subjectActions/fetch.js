import {
  FETCH_SUBJECTS_FAIL,
  FETCH_SUBJECTS_PENDING,
  FETCH_SUBJECTS_SUCCESS,
} from '../actionTypes';

const fail = error => ({
  message: error.message,
  titleKey: 'modal.error',
  titleOptions: { code: error.code || 500 },
  type: FETCH_SUBJECTS_FAIL,
});

const pending = () => ({
  type: FETCH_SUBJECTS_PENDING,
});

const success = subjectsByCategory => ({
  subjectsByCategory,
  type: FETCH_SUBJECTS_SUCCESS,
});

export default apiClient => async (dispatch) => {
  dispatch(pending());

  try {
    const subjectsByCategory = await apiClient.category.get();
    dispatch(success(subjectsByCategory));
  } catch (error) {
    dispatch(fail(error));
  }
};
