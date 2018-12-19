export const formatItemFormData = (item) => {
  const data = {
    isBook: item.isBook,
    name: item.name.capitalize(),
    comment: item.comment,
    subject: item.subject,
    author: item.author.map(author => ({
      ...author,
      firstName: author.firstName.capitalize(),
      lastName: author.lastName.capitalize(),
    })),
  };

  if (item.id) {
    data.id = item.id;
  }

  if (item.isBook) {
    data.edition = item.edition;
    data.editor = item.editor.capitalize();
    data.publication = item.publication;
  }

  if (!item.noEan13) {
    data.ean13 = item.ean13;
  }

  return data;
};

export const authorIsValid = item => !item.isBook || item.author.every(author => author.lastName);

export const ean13IsValid = item => item.noEan13 || !!item.ean13;

export const editorIsValid = item => !item.isBook || item.editor !== '';

export const nameIsValid = item => item.name !== '';

export const publicationIsValid = item => !item.isBook || !!item.publication;
