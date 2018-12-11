'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const shortid = require('shortid');
const filterUserInfo = require('./lib/filterUserInfo');
const convertToDateString = require('./lib/convertToDateString');
const createUserExerciseLog = require('./lib/createUserExerciseLog');
const createDetailedUserExerciseLog = require('./lib/createDetailedUserExerciseLog');

const cors = require('cors');

const mongoose = require('mongoose');
require('./models/User');
mongoose.Promise = global.Promise;
const User = mongoose.model('User');
mongoose.connect(process.env.MLAB_URI, { useNewUrlParser: true }, (err, db) => {
  console.log('Connected to database!');
});

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/exercise/new-user', async (req, res) => {
  console.log('POST at api/exercise/new-user !');
  
  const username = req.body.username;
  const userId = shortid.generate();
  const emptyArray = [];
  
  try {
    const user = await User.findOne({ username: username }, (err, obj) => {
      if(err) return res.status(400).send({ error: "item not in DB" })
    });
    
    if(user) {
      // console.log('url:\n', url);
      res.status(200).send({ message: 'User already exists in database.' });
    } else {
      
      const item = new User({
        username,
        userId,
        emptyArray
      });
      
      const response = {
        username: username,
        _id: userId
      };
      
      await item.save();
      res.status(200).send(response);
      
    }
  } catch (err) {
    return res.status(401).send(err);
  }
  
  // return res.status(200).send(username);
});

app.post('/api/exercise/add', async (req, res) => {
  console.log('POST at api/exercise/add !');
  
  const { userId, description, duration, date } = req.body;
  const user = await User.findOne({ userId: userId });
  const username = user.username;
  const dateString = convertToDateString(date);
  // console.log(`username: ${username}`);
  
  const response = {
    username: username,
    description: description,
    duration: parseInt(duration, 10),
    _id: userId,
    date: dateString
  };
  
  const exerciseItem = {
    description: description,
    duration: duration,
    date: dateString
  };
  
  if(user) {
    console.log('exerciseItem:\n', exerciseItem);
    
    user.exercises.push(exerciseItem);
    user.save();
    
    return res.status(200).send(response);
  } else {
    return res.status(400).send({ error: 'User does not exist. Please add user and try again.' });
  }
  
  // res.status(200).send(req.body);
  
});

app.get('/api/exercise/users', async (req, res) => {
  console.log('GET at api/exercise/users !');
  
  let dbUsers;
  const dbQuery = await User.find((err, users) => {
    if(err) return res.status(400).send(err);
    dbUsers = users;
  });
  
  // console.log('dbUsers:\n', dbUsers);
  // console.log(filterByNameAndId(dbUsers));
  
  const filteredUsers = filterUserInfo(dbUsers);
  
  return res.status(200).send(filteredUsers);
  
});

app.get('/api/exercise/log?', async (req, res) => {
  console.log('GET at api/exercise/log !');
  
  const { userId, limit, from, to } = req.query,
        fromString = convertToDateString(from),
        toString = convertToDateString(to);
  
  console.log(`userId: ${userId}, from: ${from}, to: ${to}, limit: ${limit}`);
  
  const user = await User.findOne({ userId: userId });
  
  if(user) {
    // console.log('user:\n', user);
    let userExerciseLog;
    if(from != undefined && to != undefined) {
      userExerciseLog = createDetailedUserExerciseLog(user, from, to, limit);
    } else {
      userExerciseLog = createUserExerciseLog(user);
    }
    return res.status(200).send(userExerciseLog);
  } else {
    // console.log('user may not exist');
    return res.status(400).send({ error: 'User may not exist yet.' });
  }
  
  // return res.status(200).send(userId);
  
});

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
