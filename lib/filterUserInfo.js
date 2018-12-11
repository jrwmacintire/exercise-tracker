 function filterUserInfo(unfiltered) {
  
  if(unfiltered.length <= 0) {
    throw Error('Array must not be less than or equal to a length of zero.');
  }
  
  const filtered = unfiltered.map(item => {
    return { username: item.username, _id: item._id }
  });
  
  // console.log('filtered:\n', filtered);
  return filtered;
}

module.exports = filterUserInfo;