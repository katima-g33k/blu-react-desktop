const regex = /[^- ]*[\s|-]*/g;
const updateCasing = txt => `${txt.charAt(0).toUpperCase()}${txt.substr(1).toLowerCase()}`;
const capitalize = str => str.replace(regex, updateCasing);

export default capitalize;
