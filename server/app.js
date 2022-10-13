const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'hiohihihjeee';
const Todo = require('./models/todo');

const PORT = 8000;

const Database =
  'mongodb+srv://Huzaifa:xoJppDmdn8Hg3xWZ@cluster0.qftkjcd.mongodb.net/?retryWrites=true&w=majority';

mongoose
  .connect(Database)
  .then(() => {
    console.log('Database database connected');
  })
  .catch((err) => console.log(err));

const app = express();
app.use(express.json());

const requireLogin = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({
      err: 'You must be Login',
    });
  }
  const userId = jwt.verify(authorization, JWT_SECRET).userId;
  req.user = userId;
  next();
};

app.get('/test', requireLogin, (req, res) => {
  res.json({
    message: req.user,
  });
  console.log(req.user);
});

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(422).json({
        err: 'Please add the fields',
      });
    }
    const user = await User.findOne({ email: email }).exec();
    if (user) {
      return res.status(422).json({
        err: 'User already exists with email',
      });
    }
    const HashedPassword = await bcrypt.hash(password, 12);
    const userModel = await new User({
      email: email,
      password: HashedPassword,
    }).save();

    res.status(200).json({
      data: 'User added successfully',
    });
  } catch (err) {
    console.log(err);
  }
});

// SignIn

app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(422).json({
        err: 'Please add the fields',
      });
    }
    const user = await User.findOne({ email: email }).exec();
    if (!user) {
      return res.status(422).json({
        err: 'User doesnt exits',
      });
    }
    const doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET);
      res.json({ token });
    } else {
      res.status(401).json({
        err: 'Email or password is invalid',
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Helo World' });
});

app.post('/createtodo', requireLogin, async (req, res) => {
  await new Todo({
    todo: req.body.todo,
    PostedBy: req.user,
  }).save();
  res.status(200).json({
    data: 'ToDo Added succesfully',
  });
});

app.listen(PORT, () => {
  console.log('Listening server');
});

// xoJppDmdn8Hg3xWZ;
