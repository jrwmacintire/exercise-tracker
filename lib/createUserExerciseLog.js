function createUserExerciseLog(user) {
  const exerciseLog = user.exercises;
  // console.log(user);
  
  const response = {
    _id: user.userId,
    username: user.username,
    count: user.exercises.length,
    log: user.exercises
  };
  
  return response;
}

module.exports = createUserExerciseLog;