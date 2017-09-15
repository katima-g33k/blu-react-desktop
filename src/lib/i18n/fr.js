const fr = {
  Admin: {
    statistics: {
      title: 'Adminnistraton - Statistiques',
    },
    employees: {
      title: 'Adminnistraton - Gestion des employé.e.s',
    },
    itemList: {
      title: 'Adminnistraton - Gestion des ouvrages',
    },
    reservation: {
      title: 'Adminnistraton - Geston des réservations',
    },
    storage: {
      title: 'Adminnistraton - Gestion des caisses de rangement',
    },
    duplicates: {
      title: 'Administration - Liste des comptes dupliqués',
    },
  },
  ItemForm: {
    title: 'Formulaire de l\'ouvrage',
  },
  ItemView: {
    title: 'Ouvrage',
    information: {
      title: 'Informations',
      authors: 'Auteur.e.s',
      edition: 'Édition',
      editor: 'Éditeur',
      publication: 'Année de parution',
      barcode: 'Code EAN13',
      comment: 'Commentaire',
    },
    internalManagement: {
      title: 'Gestion interne',
      status: 'Statut',
      valid: 'Valide',
      outdated: 'Désuet',
      removed: 'Retiré',
      category: 'Catégorie',
      subject: 'Matière',
      storage: 'Caisses de rangement',
    },
    stats: {
      title: 'Statistiques',
    },
    copies: {
      title: 'Liste des exemplaires',
      none: 'Aucun exemplaire',
    },
  },
  Login: {
    title: 'Connexion',
  },
  MemberForm: {
    title: 'Formulaire du membre',
  },
  MemberView: {
    title: 'Membre',
    general: {
      title: 'Informations générales',
      no: 'Numéro de compte',
      email: 'Courriel',
      address: 'Addresse',
      phone: 'Téléphone',
    },
    account: {
      title: 'État du compte',
      activation: 'État d\'activation',
      active: 'Actif',
      deactivated: 'Désactivé',
      registration: 'Date d\'inscription',
      lastActivity: 'Dernière activité',
      deactivation: 'Date de désactivation',
    },
    comment: {
      title: 'Notes et commentaires',
      none: 'Aucun commentaire',
    },
    stats: {
      title: 'Statistiques',
    },
    copies: {
      title: 'Liste des exemplaires',
      none: 'Aucun exemplaire',
    },
  },
  ProfileStats: {
    books: 'livres',
    added: 'Mis en vente',
    sold: 'Vendus',
    toSell: 'À vendre',
    toPay: 'À rembourser',
    paid: 'Remboursés',
  },
  Search: {
    title: 'Recherche',
    filters: {
      member: 'Membre',
      item: 'Ouvrage',
      archive: {
        item: 'Désuets/Retirés',
        member: 'Désactivés',
        parent: 'Désactivés',
      },
    },
    cancel: 'Annuler',
    results: {
      title: 'Résultats',
      none: 'Aucun résultat',
    },
  },
  SettingsView: {
    title: 'Paramètres',
  },
  Sidebar: {
    search: 'Recherche',
    member: 'Membre',
    member_form: 'Formulaire de membre',
    member_view: 'Fiche de membre',
    member_copies: 'Ajout d\'exemplaires',
    item: 'Ouvrage',
    item_form: 'Formulaire d\'ouvrage',
    item_view: 'Fiche d\'ouvrage',
    admin: 'Administration',
    admin_employees: 'Employé.e.s',
    admin_reservations: 'Réservations',
    admin_storage: 'Caisses de rangement',
    admin_statistics: 'Statistiques',
    admin_itemList: 'Liste des ouvrages',
    admin_memberDuplicates: 'Comptes dupliqués',
    settings: 'Paramètres',
  },
  TableColumns: {
    search: {
      member: {
        no: 'Numéro de membre',
        firstName: 'Prénom',
        lastName: 'Nom',
      },
      item: {
        title: 'Titre',
        editor: 'Éditeur',
        edition: 'Édition',
        publication: 'Année de parution',
        authors: 'Auteur.e.s',
      },
    },
    comment: {
      comment: 'Commentaire',
      date: 'Date',
    },
    itemCopy: {
      member: 'Membre',
      added: 'Mis en vente',
      sold: 'Vendu',
      paid: 'Argent remis',
      price: 'Prix',
    },
    memberCopy: {
      title: 'Titre',
      editor: 'Éditeur',
      edition: 'Édition',
      added: 'Mis en vente',
      sold: 'Vendu',
      paid: 'Argent remis',
      price: 'Prix',
    },
  },
};

export default fr;
