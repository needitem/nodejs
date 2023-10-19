const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true
}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

// Define User model
const userSchema = new mongoose.Schema({
  id: String,
  pw: String
});

const User = mongoose.model('users', userSchema);

// Register page
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});

// Register session
app.post('/register', async (req, res) => {
  var post = req.body;
  var id = post.id;
  var pw = post.pw;

  // Insert user data into MongoDB collection
  const newUser = new User({ id: id, pw: pw });
  try {
    // Check if there is a user with the same id
    const user = await User.findOne({ id: id });
    if (user) {
      res.send('There is already a user with the same id');
      return;
    }
    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.log(err);
  }
});


// Login page
app.get('/login', (req, res) => {
  if (req.session.is_logined) {
    res.redirect('/main');
  } else {
    res.sendFile(__dirname + '/login.html');
  }
});

// Login session
app.post('/login', async (req, res) => {
  const post = req.body;
  const id = post.id;
  const pw = post.pw;

  // Find user data from MongoDB collection
  const user = await User.findOne({ id: id });
  if (!user) {
    res.send('Invalid ID');
  } else if (user.pw !== pw) {
    res.send('Invalid password');
  } else {
    req.session.is_logined = true;
    req.session.user = String(id);
    res.redirect('/main');
  }
});

// Main page
app.get('/main', (req, res) => {
  res.send(req.session.user + ' is logged in');
  setTimeout(() => {
    res.redirect('/airkorea');
  }, 3000);
});

// Logout session
app.use('/logout', (req, res) => {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/login');
    }
  });
});

// To do list API
const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean
});

const Todo = mongoose.model('todos', todoSchema);

// Routes
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    console.log(err);
  }
});

app.post('/todos', async (req, res) => {
  const post = req.body;
  const title = post.title;
  const description = post.description;
  const completed = post.completed;

  const newTodo = new Todo({ title: title, description: description, completed: completed });
  try {
    await newTodo.save();
    res.json(newTodo);
  } catch (err) {
    console.log(err);
  }
});

app.put('/todos/:id', async (req, res) => {
  const id = req.params.id;
  const post = req.body;
  const title = post.title;
  const description = post.description;
  const completed = post.completed;

  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      res.send('Invalid ID');
      return;
    }
    todo.title = title;
    todo.description = description;
    todo.completed = completed;
    await todo.save();
    res.json(todo);
  } catch (err) {
    console.log(err);
  }
});

app.delete('/todos/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      res.send('Invalid ID');
      return;
    }
    await todo.delete();
    res.send('Todo deleted');
  } catch (err) {
    console.log(err);
  }
});


// Crawl page
app.get('/airkorea', async (req, res) => {
  const serviceKey = "TmliNLK%2BMxHxuin3oikNVclqhEMV%2BwYSce6XvcF5Jz%2BMPfH1UiAxjvnvnG56AC7nYzCv3AvfL%2FENAgEV1wHOxw%3D%3D";
  const airUrl = "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty";

  let params = encodeURI('serviceKey') + '=' + serviceKey;
  params += '&' + encodeURI('numOfRows') + '=' + encodeURI('1');
  params += '&' + encodeURI('pageNo') + '=' + encodeURI('1');
  params += '&' + encodeURI('dataTerm') + '=' + encodeURI('DAILY');
  params += '&' + encodeURI('ver') + '=' + encodeURI('1.3');
  params += '&' + encodeURI('stationName') + '=' + encodeURI('강남구');
  params += '&' + encodeURI('returnType') + '=' + encodeURI('json');

  const airApiUrl = airUrl + '?' + params;

  try{
      const result = await axios.get(airApiUrl);
      res.json(result.data);
  }
  catch(error){
      console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});