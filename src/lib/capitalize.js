/* eslint no-extend-native: 0, func-names: 0 */
const regex = /[^- ]*[\s|-]*/g;
const updateCasing = txt => `${txt.charAt(0).toUpperCase()}${txt.substr(1).toLowerCase()}`;
const capitalize = str => str.replace(regex, updateCasing);

String.prototype.capitalize = function () {
  return capitalize(this);
};

export default capitalize;
