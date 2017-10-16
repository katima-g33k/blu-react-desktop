import capitalize from '../../../lib/capitalize';

export default (data) => {
  const item = data;
  item.name = capitalize(item.name);

  if (typeof item.subject !== 'object' || !item.subject.id) {
    item.subject = {
      id: +document.getElementById('subject').value,
    };
  }

  if (!item.isBook) {
    item.author = [];
    delete item.edition;
    delete item.editor;
    delete item.publication;
  } else {
    item.editor = capitalize(item.editor);
    item.author = item.author.map(author => ({
      ...author,
      firstName: capitalize(author.firstName),
      lastName: capitalize(author.lastName),
    }));
  }

  if (item.noEan13) {
    delete item.ean13;
  }

  return item;
};
