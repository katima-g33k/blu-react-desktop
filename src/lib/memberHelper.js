import moment from 'moment';

import {
  DEFAULT_STATE_VALUE,
  EMAIL_REGEX,
  MEMBER_NO_REGEX,
  POSTAL_CODE_REGEX,
  PHONE_NUMBER_REGEX,
} from './constants';

export const emailIsValid = email => !!email && EMAIL_REGEX.test(email);

export const formatPhoneNumber = number => number.replace(PHONE_NUMBER_REGEX, '$1-$2-$3');

export const formatZip = zip => zip.replace(POSTAL_CODE_REGEX, '$1 $2').toUpperCase();

export const formatMemberFormData = (memberFormData) => {
  const data = memberFormData;

  data.firstName = data.firstName.capitalize();
  data.lastName = data.lastName.capitalize();

  if (data.noNo) {
    delete data.noNo;
    delete data.no;
  } else if (data.no.length === 7) {
    data.no = `${+data.no.substr(0, 2) <= +moment().format('YY') ? '20' : '19'}${data.no}`;
  }

  if (data.city.name) {
    data.city.name = data.city.name.capitalize();
    data.city.state.code = data.city.state.code || DEFAULT_STATE_VALUE;
  } else {
    delete data.city;
  }

  if (data.zip) {
    data.zip = data.zip.replace(/\s/g, '').toUpperCase();
  }

  if (data.address) {
    data.address = data.address.capitalize();
  }

  data.phone = data.phone.filter(phone => phone.number).map(phone => ({
    note: phone.note,
    number: phone.number.replace(/\D/g, ''),
  }));

  return data;
};

export const memberNoIsValid = member => member.noNo || MEMBER_NO_REGEX.test(member.no);

export const nameIsValid = name => !!name;

export const phoneIsValid = phoneNumber => !phoneNumber || PHONE_NUMBER_REGEX.test(phoneNumber);

export const zipIsValid = zip => !zip || POSTAL_CODE_REGEX.test(zip);
