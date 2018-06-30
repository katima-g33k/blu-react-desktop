export default async (ean13, apiClient) => {
  if (!ean13) {
    return false;
  }

  try {
    return (await apiClient.item.exists(ean13)).id;
  } catch (error) {
    return false;
  }
};
