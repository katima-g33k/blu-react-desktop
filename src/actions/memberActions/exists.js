export default async (data, apiClient) => {
  if (!data.no && !data.email) {
    return false;
  }

  try {
    return (await apiClient.member.exists(data)).no;
  } catch (error) {
    return false;
  }
};
