const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

app.set(
  'port', process.env.PORT || 3000
)

app.get('/', (req, res) => {
  if (req.cookies.auth) {
    res.send('<h1>Login Success</h1>');
  } else {
    res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  fs.readFile('login.html', (err, data) => {
    res.send(data.toString());
  });
});

app.get('/user/:id', (req, res) => {
  console.log(req.params.login);
});

app.get('/query', (req, res) => {
  const { login, password } = req.query;

  console.log(login, password);
  console.log(req.body);

  if (login === 'rint' && password === '1234') {
    res.cookie('auth', true);
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

app.post('/login', (req, res) => {
  const { login, password } = req.body;

  console.log(login, password);
  console.log(req.body);

  if (login === 'rint' && password === '1234') {
    res.cookie('auth', true);
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

app.listen(app.get('port'), () => {
  console.log(`Server running at http://127.0.0.1:${app.get('port')}`);
});