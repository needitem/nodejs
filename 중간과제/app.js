const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

// Middleware
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

// Routes
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});

app.post('/register', async (req, res) => {
  const { id, pw } = req.body;

  try {
    const user = await User.findOne({ id: id });
    if (user) {
      res.send('There is already a user with the same id');
      return;
    }
    const newUser = new User({ id: id, pw: pw });
    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.log(err);
  }
});

app.get('/login', (req, res) => {
  if (req.session.is_logined) {
    res.redirect('/main');
  } else {
    res.sendFile(__dirname + '/login.html');
  }
});

app.post('/login', async (req, res) => {
  const { id, pw } = req.body;

  try {
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
  } catch (err) {
    console.log(err);
  }
});

app.get('/main', (req, res) => {
  if (req.session.is_logined) {
    res.send(req.session.user + ' is logged in');
  } else {
    res.redirect('/login');
  }
});

app.use('/logout', (req, res) => {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/login');
    }
  });
});

app.get('/main/melon', async (req, res) => {
  const URL = 'https://www.melon.com/chart/index.htm';
  const response = await axios.get(URL);

  if (response.status === 200) {
    let ulList = [];
    const $ = cheerio.load(response.data);
    const $musicList = $("#lst50");

    $musicList.each(function(i, elem) {
      ulList[i] = {
        title: $(this).find('#lst50 > td > div > div > div.ellipsis.rank01 > span > a').text().trim(),
        singer: $(this).find('#lst50 > td > div > div > div.ellipsis.rank02 > a').text(),
      };
    });

    return res.json(ulList);
  } else {
    console.log("error");
  }
});

app.get('/main/searchmusic/:name', async (req, res) => {
  const serviceKey = "5884d640361dea6f9726858fce676e9f";
  const musicName = req.params.name;

  const URL = "https://ws.audioscrobbler.com/2.0/?method=track.search&track=" + musicName + "&api_key=" + serviceKey + "&format=json";
  const response = await axios.get(URL);

  const data = response.data;

  //filter data
  const track = data.results.trackmatches.track;
  const result = track.map((item) => {
    return {
      name: item.name,
      artist: item.artist,
      url: item.url
    }
  });
  res.json(result);

});

const todos = [];
app.route('/main/memos')
  .post((req, res) => {
    const todo = req.body;
    const newId = todos.length + 1;
    todo.id = newId;
    todos.push(todo);
    res.status(201).json(todo);
  })
  .get((req, res) => {   
    res.json(todos);
  });

app.route('/main/memos/:id')
  .get((req, res) => {
    const id = req.params.id;
    const todo = todos.find(todo => todo.id === Number(id));
    if (!todo) {
      res.status(404).send('To-do item not found');
    } else {
      res.json(todo);
    }
  })
  .put((req, res) => {
    const id = req.params.id;
    const todo = req.body;
    const index = todos.find(todo => todo.id === Number(id));
    if (index === -1) {
      res.status(404).send('To-do item not found');
    } else {
      todos.splice(index, 1, todo);
      todo.id = Number(id);
      res.json(todo);
    }
  })
  .delete((req, res) => {
    const id = req.params.id;
    const index = todos.find(todo => todo.id === Number(id));
    if (index === -1) {
      res.status(404).send('To-do item not found');
    } else {
      todos.splice(index, 1);
      res.sendStatus(204);
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});