function convertToDateString(dateString) {
  const dateObj = new Date(dateString);
  return dateObj.toDateString();
}

module.exports = convertToDateString;