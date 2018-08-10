/* eslint max-len: 0 */
export default {
  actions: {
    add: 'Ajouter',
    cancel: 'Annuler',
    delete: 'Supprimer',
    login: 'Se connecter',
    logout: 'Déconnexion',
    ok: 'OK',
    save: 'Enregistrer',
  },
  general: {
    item: {
      status: {
        OUTDATED: 'Désuet',
        REMOVED: 'Retiré',
        VALID: 'Valide',
      },
    },
    scanner: {
      invalid: {
        message: 'Le code que vous venez de scanner n\'est pas supporté par le système de la BLU',
        title: 'Code invalide',
      },
    },
    dateLabel: {
      end: 'Fin',
      start: 'Début',
    },
  },
  Admin: {
    statistics: {
      amountDue: {
        datePickerLabel: 'Choisir une date',
        message: {
          1: 'En date du %{date}, la BLU doit ',
          2: ' à ses membres actifs',
        },
        title: 'Montant à rembourser aux membres',
      },
      byInterval: {
        date: {
          title: 'Par date',
        },
        semester: {
          title: 'Par session',
        },
        title: 'Montant par transaction',
      },
      title: 'Adminnistraton - Statistiques',
      chart: {
        labels: {
          added: 'Ajoutés',
          amount: 'Argent',
          quantity: 'Quantité',
          savings: 'Argent épargné',
          sold: 'Ventes',
          soldParent: 'Ventes parents-étudiants',
          paid: 'Remboursés',
        },
      },
    },
    employees: {
      modals: {
        form: {
          title: {
            add: 'Ajouter un.e employé.e',
            edit: 'Modifier un.e employé.e',
          },
          fields: {
            confirmPassword: 'Confirmer le mot de passe',
            isActive: 'Est activé',
            isAdmin: 'Est administrateur',
            password: 'Mot de passe',
            setPassword: 'Changer le mot de passe',
            username: 'Nom d\'utilisateur',
          },
        },
        remove: {
          message: 'Êtes-vous certains de vouloir supprimer %{username} ?',
          title: 'Suppression d\'un.e employé.e',
        },
      },
      title: 'Adminnistraton - Gestion des employé.e.s',
      table: {
        columns: {
          username: 'Nom d\'utilisateur',
          isAdmin: {
            title: 'Permissions',
            admin: 'Administrateur',
            user: 'Utilisateur',
          },
          isActive: {
            title: 'Est activé',
            active: 'Actif',
            inactive: 'Inactif',
          },
        },
        placeholder: 'Aucun employé dans le système',
        title: 'Liste des employé.e.s',
      },
    },
    itemList: {
      title: 'Adminnistraton - Gestion des ouvrages',
      table: {
        columns: {
          author: 'Auteur.e.s',
          edition: 'Édition',
          editor: 'Éditeur',
          inStock: 'En stock',
          name: 'Titre',
          publication: 'Publication',
          status: 'Statut',
          subject: 'Matière',
        },
        filters: {
          outdated: 'Désuet',
          removed: 'Retiré',
          valid: 'Valide',
        },
        placeholder: 'Aucun ouvrage dans le système',
        title: 'Liste des ouvrages (%{items})',
      },
    },
    reservation: {
      actions: {
        clear: 'Tout Supprimer',
      },
      modals: {
        clear: {
          message: 'Êtes-vous certains de vouloir supprimer TOUTES les réservations ? Ceci est IRRÉVERSIBLE. Ne le faîtes pas à moins d\'être certain de ne pas avoir de réservation pour la session en cours.',
          title: 'Suppression des réservations',
        },
      },
      table: {
        columns: {
          date: 'Date',
          item: 'Ouvrage',
          parent: 'Parent',
        },
        placeholder: 'Aucune réservation dans le système',
        title: 'Liste des réservations',
      },
      title: 'Adminnistraton - Geston des réservations',
    },
    storage: {
      title: 'Adminnistraton - Gestion des caisses de rangement',
      actions: {
        clear: 'Vider',
      },
      table: {
        columns: {
          no: 'Numéro de caisse',
          content: 'Contenu',
        },
        placeholder: 'Aucune réservation dans le système',
        title: 'Liste des caisses de rangement',
      },
      modals: {
        clear: {
          message: 'Êtes-vous certains de vouloir vider les caisses de rangement ? Ceci est IRRÉVERSIBLE. Ne le faîtes pas à moins d\'être certain de ne plus avoir besoin des caisses présentement enregistrées.',
          title: 'Vider les caisses de rangement',
        },
      },
    },
    duplicates: {
      title: 'Administration - Liste des comptes dupliqués',
      table: {
        columns: {
          member: 'Member %{index}',
        },
        data: {
          registration: 'Inscription: %{date}',
          lastActivity: 'Dernière activité: %{date}',
        },
        placeholder: 'Aucun duplicat détecté',
        title: 'Liste des comptes de membre dupliqués',
      },
    },
  },
  ItemForm: {
    title: 'Formulaire de l\'ouvrage',
    subtitle: {
      book: {
        add: 'Ajouter un ouvrage',
        edit: 'Modifier un ouvrage',
      },
      item: {
        add: 'Ajouter un objet',
        edit: 'Modifier un objet',
      },
    },
    fields: {
      isBook: 'Est un ouvrage',
      name: 'Titre',
      subject: 'Sujet',
      ean13: 'EAN13',
      noEan13: 'Pas de code',
      comment: {
        book: 'Commentaires',
        item: 'Description',
      },
      editor: 'Éditeur',
      edition: 'Édition',
      publication: 'Année',
      author: {
        label: 'Auteur %{index}',
        placeholder: {
          firstName: 'Prénom',
          lastName: 'Nom*',
        },
      },
    },
    modals: {
      exists: {
        message: 'Les informations que vous avez inscrites correspondent à un ouvrage déjà existant.',
        title: 'Erreur - Ouvrage existant',
        goToItem: {
          action: 'Aller à la fiche',
          message: 'Un ouvrage avec les informations saisies existe déjà. Voulez-vous aller à sa fiche ?',
        },
        merge: {
          action: 'Fusionner',
          message: 'Les informations que vous avez inscrites correspondent à un ouvrage déjà existant. Voulez-vous fusionner cet ouvrage avec l\'ouvrage correspondant ?',
        },
        merged: {
          message: 'Les ouvrages ont été fusionnés, vous serez redirigé à la fiche de l\'ouvrage.',
          title: 'Ouvrages fusionmés',
        },
      },
    },
  },
  ItemView: {
    actions: {
      delete: 'Supprimer',
      modify: 'Modifier',
      reserve: 'Réserver',
      storage: 'Gérer les caisses',
    },
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
    modal: {
      deleteConfirmation: {
        message: 'Voulez-vous vraiment supprimer cet ouvrage? Cette action est IRRÉVERSIBLE',
        title: 'Suppression d\'un ouvrage',
      },
      deleted: {
        message: 'L\'ouvrage a été supprimé',
        title: 'Ouvrage supprimé',
      },
      reserveWarning: {
        message: 'Attention! Il y a des exemplaires en stock Voulez-vous vraiment réserver l\'ouvrage ?',
        title: 'Réservation d\'un ouvrage',
      },
      updateStorage: {
        title: 'Modifier les caisses de rangements',
        message: 'Veuillez entrer les caisses de rangements, séparé par ;',
      },
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
    fields: {
      username: 'Pseudonym',
      password: 'Mot de passe',
    },
    error: {
      title: 'Erreur de connexion',
      message: 'Pseudonym ou mot de passe invalide.',
    },
  },
  MemberForm: {
    title: 'Formulaire du membre',
    subtitle: {
      add: 'Ajouter un membre',
      contact: 'Information de contact',
      edit: 'Modifier un member',
    },
    fields: {
      address: 'Adresse',
      city: 'Ville',
      email: {
        label: 'Courriel',
        placeholder: 'courriel@exemple.com',
      },
      isParent: 'Parent-Étudiant',
      firstName: 'Prénom',
      lastName: 'Nom',
      no: {
        label: 'Numéro de member',
        placeholder: '200000000',
      },
      noNo: 'Pas de numéro',
      phone: {
        label: 'Téléphone %{index}',
        note: 'Note',
        placeholder: 'XXX-XXX-XXXX',
      },
      state: 'Province',
      zip: {
        label: 'Code postal',
        placeholder: 'A0A 0A0',
      },
    },
    modals: {
      exists: {
        message: 'Les informations que vous avez inscrites correspondent à un compte déjà existant.',
        title: 'Erreur - Membre existant',
        goToMember: {
          action: 'Aller à la fiche',
          message: 'Un membre avec les informations saisies existe déjà. Voulez-vous aller à sa fiche ?',
        },
        merge: {
          action: 'Fusionner',
          message: 'Les informations que vous avez inscrites correspondent à un compte déjà existant. Voulez-vous fusionner ce compte avec le compte correspondant ?',
        },
        merged: {
          message: 'Les comptes ont été fusionnés, vous serez redirigé au compte du membre.',
          title: 'Comptes fusionmés',
        },
      },
    },
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
  ReservationList: {
    title: 'Liste des réservation',
    table: {
      parent: 'Parent',
      date: 'Date',
      received: 'Reçu',
    },
    modal: {
      message: 'Souhaitez-vous vraiment supprimer la réservation de %{name} ?',
      title: 'Supprimer une réservation',
    },
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
    fields: {
      apiKey: 'Clé d\'API',
      apiUrl: 'URL de l\'API',
      secretKey: 'Clé d\'encryption',
      calibrate: 'Calibrer le scanner',
    },
    calibrator: {
      title: 'Calibration du scanneur',
      message: {
        waiting: 'Veuillez scanner un code à barres afin de calibrer le scanneur',
        scanned: 'Code scanné avec succès',
      },
    },
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
    searchParent: {
      title: 'Recherche d\'un parent-étudiant',
    },
  },
  table: {
    defaultFileName: 'data',
    export: 'Exporter sélection',
    placeholder: 'Aucune donnée',
  },
};
