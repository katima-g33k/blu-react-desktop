import AuthorInput from './AuthorInput';

const meta = {
  titleClass: 'h3',
  options: {
    horizontal: true,
  },
};
const isBook = {
  label: 'Est un livre',
  key: 'isBook',
  type: 'checkbox',
};
const subject = {
  label: 'Sujet',
  key: 'subject',
  type: 'select',
};
const ean13 = {
  key: 'ean13',
  inline: [
    {
      label: 'EAN13',
      key: 'ean13',
      type: 'text',
      required: true,
      validationFn: (item) => item.ean13 || item.noEan13,
    },
    {
      label: 'Pas de numéro',
      key: 'noEan13',
      type: 'checkbox',
    },
  ],
};

const schema = {
  book: {
    title: 'Modifier un ouvrage',
    ...meta,
    sections: [
      {
        fields: [
          isBook,
          {
            label: 'Titre',
            key: 'name',
            type: 'text',
            required: true,
          },
          {
            label: 'Éditeur',
            key: 'editor',
            type: 'text',
            required: true,
          },
          {
            label: 'Édition',
            key: 'edition',
            type: 'text',
          },
          {
            label: 'Année',
            key: 'publication',
            type: 'text',
          },
          {
            label: 'Auteur',
            key: 'author',
            type: 'custom',
            component: AuthorInput,
            required: true,
            validationFn: (data) => {
              let valid = true;

              data.author.forEach((author) => {
                if (!author.lastName || author.lastName === '') {
                  valid = false;
                }
              });

              return valid;
            },
          },
          subject,
          ean13,
          {
            label: 'Commentaires',
            key: 'comment',
            type: 'textarea',
          },
        ],
      },
    ],
  },
  item: {
    title: 'Modifier un objet',
    ...meta,
    sections: [
      {
        fields: [
          isBook,
          {
            label: 'Nom',
            key: 'name',
            type: 'text',
            required: true,
          },
          subject,
          ean13,
          {
            label: 'Description',
            key: 'comment',
            type: 'textarea',
          },
        ],
      },
    ],
  },
};

export default schema;
