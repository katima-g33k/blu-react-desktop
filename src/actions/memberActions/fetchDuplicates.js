import {
  FETCH_MEMBER_DUPLICATES_FAIL,
  FETCH_MEMBER_DUPLICATES_PENDING,
  FETCH_MEMBER_DUPLICATES_SUCCESS,
} from '../actionTypes';

const pending = () => ({
  type: FETCH_MEMBER_DUPLICATES_PENDING,
});

const success = duplicates => ({
  duplicates,
  type: FETCH_MEMBER_DUPLICATES_SUCCESS,
});

const fail = error => ({
  error,
  type: FETCH_MEMBER_DUPLICATES_FAIL,
});

export default api => async (dispatch) => {
  dispatch(pending());

  try {
    const res = await api.member.duplicates.list();
    const duplicates = res.reduce((acc, cur) => {
      const duplicate = acc.find(({ email, no }) =>
        email === cur.email || `${no}`.includes(cur.no) || `${cur.no}`.includes(no),
      );

      if (duplicate) {
        duplicate.members.push(cur);
      } else {
        acc.push({
          no: cur.no,
          email: cur.email,
          members: [cur],
        });
      }

      return acc;
    }, []).filter(({ members }) => members.length > 1).map(({ members }) => members);

    dispatch(success(duplicates));
  } catch (error) {
    dispatch(fail(error));
  }
};
