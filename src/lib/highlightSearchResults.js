const formatString = (str, highlight) => highlight ? `<span class="highlight">${str}</span>` : str;
const highlightSearchResults = (string, highlight) => {
  if (!highlight) {
    return string;
  }

  const regex = new RegExp(`(${highlight}|${highlight.replace(/\s/, '|')})`, 'i');
  return string.split(regex).map(str => formatString(str, regex.test(str))).join('');
};

export default highlightSearchResults;
