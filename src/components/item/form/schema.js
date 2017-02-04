const schema = {
  title: 'Modifier un ouvrage',
  titleClass: 'h3',
  options: {
    horizontal: true,
  },
  sections: [
    {
      fields: [
        {
          label: 'Titre',
          key: 'name',
          type: 'text',
        },
        {
          label: 'Éditeur',
          key: 'editor',
          type: 'text',
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
          label: 'Sujet',
          key: 'subject',
          type: 'select',
        },
        {
          inline: [
            {
              label: 'EAN13',
              key: 'ean13',
              type: 'text',
            },
            {
              label: 'Pas de numéro',
              key: 'no-ean13',
              type: 'checkbox',
            },
          ],
        },
      ],
    },
  ],
  actions: [
    {
      label: 'Annuler',
      options: {
        bsStyle: 'danger',
      },
      onClick(event, data) {
        event.preventDefault();
        return data;
      },
    },
    {
      label: 'Sauvegarder',
      options: {
        bsStyle: 'success',
      },
      onClick(event, data) {
        event.preventDefault();
        return data;
      },
    },
  ],
};

export default schema;
