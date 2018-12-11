const convertToDateString = require('./convertToDateString');

function createDetailedUserExerciseLog(user, from, to, limit) {
  // console.log(user);
  // console.log(`from: ${from}, to: ${to}, limit: ${limit}`);
  const exerciseLog = user.exercises;
  
  const response = {
    _id: user.userId,
    username: user.username,
    from: convertToDateString(from),
    to: convertToDateString(to),
    count: user.exercises.length,
    log: user.exercises
  };
  
  return response;
}

module.exports = createDetailedUserExerciseLog;