export default async (ean13, api) => {
  if (!ean13) {
    return false;
  }

  try {
    return (await api.item.exists(ean13)).id;
  } catch (error) {
    return false;
  }
};
