import moment from 'moment';

export const CommentColumns = [
  {
    key: 'id',
    id: true,
  },
  {
    key: 'comment',
    label: 'Commentaire',
  },
  {
    key: 'updated_at',
    label: 'Date',
    value(date) {
      return date ? moment(date).format('LL') : '';
    },
  },
];

export const SearchColumns = {
  member: [
    {
      key: 'no',
      label: 'Numéro de membre',
      id: true,
    },
    {
      key: 'first_name',
      label: 'Prénom',
    },
    {
      key: 'last_name',
      label: 'Nom',
    },
  ],
  item: [
    {
      key: 'id',
      id: true,
    },
    {
      key: 'name',
      label: 'Titre',
    },
    {
      key: 'editor',
      label: 'Éditeur',
    },
    {
      key: 'edition',
      label: 'Édition',
    },
    {
      key: 'publication',
      label: 'Année de parutation',
    },
    {
      key: 'author',
      label: 'Auteurs',
      value(authors) {
        if (!Array.isArray(authors)) {
          return '';
        }
        return authors.map((author) => `${author.first_name} ${author.last_name}`).join(', ');
      },
    },
  ],
};

export const MemberCopyColumns = [
  {
    key: 'id',
    id: true,
  },
  {
    key: 'name',
    label: 'Titre',
  },
  {
    key: 'editor',
    label: 'Éditeur',
  },
  {
    key: 'edition',
    label: 'Édition',
  },
  {
    key: 'added',
    label: 'Mis en vente',
    value(transaction) {
      return transaction[0] ? moment(transaction[0].date).format('LL') : '';
    },
  },
  {
    key: 'sold',
    label: 'Vendu',
    value(transaction) {
      return transaction[0] ? moment(transaction[0].date).format('LL') : '';
    },
  },
  {
    key: 'paid',
    label: 'Argent remis',
    value(transaction) {
      return transaction[0] ? moment(transaction[0].date).format('LL') : '';
    },
  },
  {
    key: 'price',
    label: 'Prix',
    value(prix) {
      return `${prix} $`;
    },
  },
];
