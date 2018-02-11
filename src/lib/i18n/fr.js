/* eslint max-len: 0 */
const fr = {
  actions: {
    add: 'Ajouter',
  },
  Admin: {
    statistics: {
      title: 'Adminnistraton - Statistiques',
      chart: {
        labels: {
          added: 'Ajoutés',
          sold: 'Ventes',
          soldParent: 'Ventes parents-étudiants',
          paid: 'Remboursés',
        },
      },
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
    transferAlert: 'Ce compte a été transféré à la BLU le(s) %{dates}',
    actions: {
      addCopies: 'Ajouter des livres',
      delete: 'Supprimer',
      modify: 'Modifier',
      pay: 'Remettre l\'argent',
      printAccount: 'Imprimer l\'état du compte',
      printReceipt: 'Imprimer un reçu',
      reactivate: 'Réactiver le compte',
      renew: 'Renouveler le compter',
      transfer: 'Transférer à la BLU',
    },
    modal: {
      comment: {
        delete: {
          title: 'Supprimer un commentaire',
          message: 'Souhaitez-vous vraiment supprimer ce commentaire : "%{comment}"',
          action: 'Supprimer',
        },
        insert: {
          title: 'Ajouter un commentaire',
          message: 'Saisissez le commentaire',
          action: 'Enregistrer',
        },
        update: {
          title: 'Modifier un commentaire',
          message: 'Saisissez le commentaire',
          action: 'Enregistrer',
        },
      },
      delete: {
        title: 'Suppression d\'un compte',
        message: 'Êtes-vous certain de vouloir supprimer ce compte? Cette action est IRRÉVERSIBLE',
        action: 'Supprimer',
      },
      payConfirmation: {
        title: 'Remise d\'argent',
        message: 'Souhaitez-vous imprimer un reçu lors de la remise d\'argent ?',
      },
      paySuccessful: {
        title: 'Argent Remis',
        message: 'Le montant de %{amount} a été remis avec succès',
      },
      reactivate: {
        title: 'Réactivation du compte',
        message: 'Attention, vous êtes sur le point de réactiver le compte. Souhaitez-vous transférer son contenu à la BLU avant la réactivation ?',
        actions: {
          transfer: 'Transférer et Réactiver',
          reactivate: 'Réactiver',
        },
      },
      transfer: {
        title: 'Transfert à la BLU',
        message: 'Souhaitez-vous transférer le contenu du compte à la BLU ?',
        action: 'Transférer',
      },
    },
    general: {
      title: 'Informations générales',
      no: 'Numéro de compte',
      email: 'Courriel',
      address: 'Addresse',
      phone: 'Téléphone %{index}',
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
      title: 'Résultats (%{num})',
      addButton: 'Ajouter',
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
  CopyTable: {
    filters: {
      added: 'En Stock',
      sold: 'Vendu',
      paid: 'Argent Remis',
      reserved: 'Réservé',
      search: 'Recherche',
    },
    help: {
      cancelSell: 'Annuler la vente',
      cancelReservation: 'Annuler la réservation',
      delete: 'Supprimer',
      reserve: 'Réserver',
      sell: 'Vendre',
      sellHalfPrice: 'Vendre à moitié prix',
    },
    modals: {
      delete: {
        action: 'Supprimer',
        message: 'Souhaitez-vous supprimer cet exemplaire ?',
        title: 'Supprimer un exemplaire',
      },
      update: {
        action: 'Enregistrer',
        message: 'Entrer le nouveau montant.',
        title: 'Mettre à jour le prix',
      },
      cancelReservation: {
        action: 'Confirmer',
        message: 'Souhaitez-vous vraiment annuler cette réservation ?',
        title: 'Annuler une réservation',
      },
    },
  },
  modal: {
    cancel: 'Annuler',
    error: 'Erreur %{code}',
    ok: 'Ok',
  },
  table: {
    defaultFileName: 'data',
    export: 'Exporter sélection',
    placeholder: 'Aucune donnée',
  },
};

export default fr;
