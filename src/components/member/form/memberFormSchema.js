const memberFormSchema = {
  titleClass: 'h3',
  options: {
    horizontal: true,
  },
  sections: [
    {
      fields: [
        {
          key: 'isParent',
          type: 'checkbox',
          label: 'Parent-Étudiant',
        },
        {
          key: 'firstName',
          type: 'text',
          label: 'Prénom*',
          placeholder: 'Prénom',
          required: true,
        },
        {
          key: 'lastName',
          type: 'text',
          label: 'Nom*',
          placeholder: 'Nom',
          required: true,
        },
        {
          key: 'no',
          inline: [
            {
              key: 'no',
              type: 'number',
              label: 'Numéro de membre*',
              placeholder: '200000000',
              required: true,
              validationFn: ({ no, noNo }) => no || noNo,
            },
            {
              label: 'Pas de numéro',
              key: 'noNo',
              type: 'checkbox',
            },
          ],
        },
      ],
    },
    {
      title: 'Information de contact',
      titleClass: 'h4',
      fields: [
        {
          key: 'address',
          type: 'text',
          label: 'Adresse',
          placeholder: 'Adresse',
        },
        {
          key: 'zip',
          type: 'text',
          label: 'Code Postale',
          placeholder: 'A0A 0A0',
        },
        {
          key: 'city',
          type: 'text',
          label: 'Ville',
          placeholder: 'Ville',
          value(value) {
            return value ? value.name : '';
          },
          onChange(event, data) {
            const member = data;
            member.city.name = event.target.value;
            return member;
          },
        },
        {
          key: 'state',
          type: 'select',
          label: 'Province',
          default: 'QC',
          value(value, data = {}) {
            return data.city ? data.city.state.code : this.default;
          },
          onChange(event, data) {
            const member = data;
            member.city.state.code = event.target.value;
          },
        },
        {
          key: 'email',
          type: 'email',
          label: 'Courriel*',
          placeholder: 'courriel@exemple.com',
          required: true,
        },
        {
          inline: [
            {
              key: 'phone1',
              type: 'phone',
              label: 'Téléphone 1',
              placeholder: 'XXX-XXX-XXXX',
              value(value, member) {
                return member.phone && member.phone[0] ? member.phone[0].number : '';
              },
              onChange(event, data) {
                const member = data;
                member.phone[0].number = event.target.value;
                return member;
              },
            },
            {
              key: 'note1',
              type: 'text',
              label: 'Note',
              value(value, member) {
                return member.phone && member.phone[0] ? member.phone[0].note : '';
              },
              onChange(event, data) {
                const member = data;
                member.phone[0].note = event.target.value;
                return member;
              },
            },
          ],
        },
        {
          inline: [
            {
              key: 'phone2',
              type: 'phone',
              label: 'Téléphone 2',
              placeholder: 'XXX-XXX-XXXX',
              value(value, member) {
                return member.phone && member.phone[1] ? member.phone[1].number : '';
              },
              onChange(event, data) {
                const member = data;
                if (member.phone[1]) {
                  member.phone[1].number = event.target.value;
                } else {
                  member.phone.push({
                    number: event.target.value,
                    note: '',
                  });
                }
                return member;
              },
            },
            {
              key: 'note2',
              type: 'text',
              label: 'Note',
              value(value, member) {
                return member.phone && member.phone[1] ? member.phone[1].note : '';
              },
              onChange(event, data) {
                const member = data;
                if (member.phone[1]) {
                  member.phone[1].note = event.target.value;
                } else {
                  member.phone.push({
                    number: '',
                    note: event.target.value,
                  });
                }
                return member;
              },
            },
          ],
        },
      ],
    },
  ],
};

export default memberFormSchema;
