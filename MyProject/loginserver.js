const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8080;

// ------------------use method------------------
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

// ------------------get method------------------
app.get('/', function(req, res) {
    res.redirect('/login');
});

app.get('/query', function(req, res) {
    const id = req.query.id;
    const pw = req.query.pw;

    if (!id || !pw) return res.send('Login Failed');

    console.log(id, pw);

    if (id == 'rint' && pw == '1234') {
        res.cookie('auth', true);
        res.send('Login Success');
    } else {
        res.send('Login Failed');
    }
});

app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/login.html');
});

// -----------------------------post method---------------------------
app.post('/login', function(req, res) {
    let id = req.body.login;
    let pw = req.body.password;

    if (!id || !pw) return res.send('Login Failed');

    console.log(id, pw);

    if (id == 'rint' && pw == '1234') {
        res.cookie('auth', true);
        res.send('Login Success');
    } else {
        res.send('Login Failed');
    }


});

// -----------------------------listen method---------------------------
app.listen(port, () => console.log(`Example app listening on port ${port}!`));